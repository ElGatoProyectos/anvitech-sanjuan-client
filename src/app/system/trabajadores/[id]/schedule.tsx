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
import { post } from "@/app/http/api.http";
import { useSession } from "next-auth/react";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";

function ScheduleWorker() {
  /// define states

  const session = useSession();

  const [schedule, setSchedule] = useState([
    {
      name: "Lunes",
      hours: {
        start: "08:00",
        end: "18:00",
      },
    },
    {
      name: "Martes",
      hours: {
        start: "00:00",
        end: "00:00",
      },
    },
    {
      name: "Miercoles",
      hours: {
        start: "00:00",
        end: "00:00",
      },
    },
    {
      name: "Jueves",
      hours: {
        start: "00:00",
        end: "00:00",
      },
    },
    {
      name: "Viernes",
      hours: {
        start: "00:00",
        end: "00:00",
      },
    },
    {
      name: "Sabado",
      hours: {
        start: "00:00",
        end: "00:00",
      },
    },
  ]);
  const [scheduleDay, setScheduleDay] = useState({
    name: "",
    hours: {
      start: "",
      end: "",
    },
  });
  const [custom, setCustom] = useState("custom");

  const [loading, setLoading] = useState(false);

  /// define function
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
      await post("schedule", schedule, session.data);
      useToastDefault("Ok", "Modificación realizada con éxito");
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Fallo al modificar");
    }
  }

  /// setup handlers

  return (
    <div className="bg-white p-8 rounded-lg">
      <div className=" flex justify-between">
        <span className="font-semibold">Horario del trabajador</span>
        <Select onValueChange={handleSelectDay} disabled={custom !== "custom"}>
          <SelectTrigger className="min-w-56 max-w-56">
            <SelectValue placeholder="Seleccione el dia" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Lunes">Lunes</SelectItem>
              <SelectItem value="Martes">Martes</SelectItem>
              <SelectItem value="Miercoles">Miercoles</SelectItem>
              <SelectItem value="Jueves">Jueves</SelectItem>
              <SelectItem value="Viernes">Viernes</SelectItem>
              <SelectItem value="Sabado">Sabado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex mt-8">
        <div className="w-full grid grid-cols-3 gap-16">
          <div className="flex flex-col gap-4">
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
                    <SelectItem value="full-time">Full time</SelectItem>
                    <SelectItem value="part-time">Part time</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 grid-rows-3 pt-5">
            {schedule.map((item, index) => (
              <div
                className="flex gap-4 border justify-center items-center"
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
            <Textarea className="w-full" />
          </div>

          <div>
            <Button onClick={() => console.log(schedule)}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ScheduleWorker;
