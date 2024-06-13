"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { scheduleFullTime, schedulePartTime } from "./schedule.examples";
import { getId, post } from "@/app/http/api.http";
import { useSession } from "next-auth/react";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";

function ScheduleWorker({ id }: { id: string }) {
  /// define states

  const session = useSession();

  const [schedule, setSchedule] = useState<any[]>(scheduleFullTime);
  const [scheduleDay, setScheduleDay] = useState({
    name: "",
    hours: {
      start: "",
      end: "",
    },
  });
  const [custom, setCustom] = useState("custom");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");

  type ApiResponse = {
    [key: string]: string;
  };

  type ScheduleItem = {
    name: string;
    hours: {
      start: string;
      end: string;
    };
  };

  type Schedule = ScheduleItem[];

  const daysOfWeekMap: { [key: string]: string } = {
    lunes: "LUNES",
    martes: "MARTES",
    miercoles: "MIERCOLES",
    jueves: "JUEVES",
    viernes: "VIERNES",
    sabado: "SABADO",
  };

  function transformSchedule(schedule: ApiResponse) {
    return Object.entries(schedule).map(([day, hours]) => {
      const [start, end] = hours.split("-");
      return {
        name: daysOfWeekMap[day],
        hours: {
          start,
          end,
        },
      };
    });
  }

  /// define function

  async function fetchScheduleWorker() {
    try {
      setLoading(true);
      const response = await getId("schedule/worker", Number(id), session.data);
      const {
        type,
        comments,
        id: scheduleId,
        worker_id,

        ...formatFields
      } = response.data;

      const transformedSchedule = transformSchedule(formatFields);
      setSchedule([...transformedSchedule]);

      setComments(comments);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      useToastDestructive("Error", "Error al traer la información");
    }
  }
  console.log(schedule);

  function handleSelectDay(e: any) {
    const day = schedule.find((x) => x.name === e);
    if (day) {
      setScheduleDay(day);
    }
  }

  function handleChangeInputHourStart(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setSchedule((prevSchedule) =>
      prevSchedule.map((day) =>
        day.name === scheduleDay.name
          ? { ...day, hours: { ...day.hours, start: value } }
          : day
      )
    );

    setScheduleDay((prevDay) => ({
      ...prevDay,
      hours: {
        ...prevDay.hours,
        start: value,
      },
    }));
  }

  function handleChangeInputHourEnd(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setSchedule((prevSchedule) =>
      prevSchedule.map((day) =>
        day.name === scheduleDay.name
          ? { ...day, hours: { ...day.hours, end: value } }
          : day
      )
    );

    setScheduleDay((prevDay) => ({
      ...prevDay,
      hours: {
        ...prevDay.hours,
        end: value,
      },
    }));
  }

  function handleChangeTypeSchedule(value: string) {
    setCustom(value);
    if (value === "full-time") {
      setSchedule(scheduleFullTime);
    } else if (value === "part-time") {
      setSchedule(schedulePartTime);
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      await post(
        "schedule",
        { workerId: id, schedule, comments },
        session.data
      );

      useToastDefault("Ok", "Modificación realizada con éxito");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      useToastDestructive("Error", "Error al registrar horario");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchScheduleWorker();
    }
  }, [session.status]);

  /// setup handlers

  return (
    <div className="bg-white p-8 rounded-lg">
      <div className=" flex justify-between">
        <span className="font-semibold">Horario del trabajador</span>
      </div>
      <div className="w-full flex mt-8">
        <div className="w-full grid grid-cols-3 gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Dia de semana</Label>
              <Select
                onValueChange={handleSelectDay}
                disabled={custom !== "custom"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el dia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="LUNES">Lunes</SelectItem>
                    <SelectItem value="MARTES">Martes</SelectItem>
                    <SelectItem value="MIERCOLES">Miercoles</SelectItem>
                    <SelectItem value="JUEVES">Jueves</SelectItem>
                    <SelectItem value="VIERNES">Viernes</SelectItem>
                    <SelectItem value="SABADO">Sabado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Hora de entrada</Label>
              <Input
                disabled={custom !== "custom"}
                value={scheduleDay.hours.start}
                onChange={handleChangeInputHourStart}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Hora de salida</Label>
              <Input
                disabled={custom !== "custom"}
                value={scheduleDay.hours.end}
                onChange={handleChangeInputHourEnd}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Horarios por defecto</Label>
              <Select onValueChange={handleChangeTypeSchedule}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Seleccione el modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="custom">Personalizado</SelectItem>
                    <SelectItem value="full-time">Por defecto</SelectItem>
                    <SelectItem value="part-time">Part time</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 grid-rows-3 pt-5">
            {session.status === "authenticated" &&
              schedule.map((item, index) => (
                <div
                  className="flex gap-4 border justify-center items-center text-sm"
                  key={index}
                >
                  <span className="min-w-24 font-semibold">{item.name}</span>
                  <div>
                    <span>{item.hours.start} </span>-
                    <span> {item.hours.end} </span>
                  </div>
                </div>
              ))}
          </div>

          <hr className="col-span-3" />

          <div className="flex flex-col gap-2 col-span-3">
            <Label>Comentarios</Label>
            <Textarea
              defaultValue={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Button disabled={loading} onClick={handleSubmit}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ScheduleWorker;
