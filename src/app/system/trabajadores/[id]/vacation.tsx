"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { getId, post } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

function VacationWorker({ id }: { id: string }) {
  const [dateVacation, setDateVacation] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [dataVacationsMin, setDataVacationsMin] = useState<any[]>([]);

  const [dataVacationsAll, setDataVacationsAll] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  const session = useSession();

  async function handleRegister() {
    try {
      await post(
        "vacations",
        { ...dateVacation, worker_id: Number(id) },
        session.data
      );

      setOpenModal(false);
      useToastDefault("Ok", "Vacacion registrada");
      setIsFetching(!isFetching);
    } catch (error) {
      useToastDestructive("Error", "Error al registrar la vacion");
    }
  }

  async function fetchLastVactions() {
    try {
      const response = await getId(
        "workers/vacations/min",
        Number(id),
        session.data
      );
      setDataVacationsMin(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer las vacaciones");
    }
  }

  async function fetchAllVacations() {
    try {
      const response = await getId(
        "workers/vacations",
        Number(id),
        session.data
      );
      setDataVacationsAll(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer las vacaciones");
    }
  }

  function formatDate(dateString: string) {
    return format(new Date(dateString), "yyyy-MM-dd");
  }

  function parseDateString(dateString: string): Date {
    return new Date(dateString.replace(" ", "T"));
  }

  function calculateDateDifference(
    dateString1: string,
    dateString2: string
  ): number {
    const date1 = parseDateString(dateString1);
    const date2 = parseDateString(dateString2);

    const differenceInMillis = date2.getTime() - date1.getTime();

    const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

    return differenceInDays;
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchLastVactions();
    }
  }, [session.status, isFetching]);

  useEffect(() => {
    if (openModalHistory) fetchAllVacations();
  }, [openModalHistory]);

  return (
    <div className="bg-white p-8 rounded-lg">
      <div>
        <span className="font-semibold">Vacaciones del trabajador</span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <table cellPadding={8} className="text-sm w-full text-left border">
          <thead>
            <tr className="border-y">
              <th>Periodo</th>
              <th>Dias</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
            </tr>
          </thead>
          <tbody>
            {dataVacationsMin.map((item, idx) => (
              <tr className="border-y " key={idx}>
                <td>
                  {formatDate(item.start_date)} a {formatDate(item.end_date)}
                </td>
                <td>
                  {calculateDateDifference(item.start_date, item.end_date) + 1}
                </td>
                <td>{formatDate(item.start_date)}</td>
                <td>{formatDate(item.end_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" flex gap-4">
          <Button onClick={() => setOpenModalHistory(true)}>
            Mostrar todas las vaciones
          </Button>

          {session.data?.user.role === "admin" && (
            <Button onClick={() => setOpenModal(true)}>
              Registrar vacaciones
            </Button>
          )}
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={() => setOpenModal(!openModal)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registro vaciones</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 w-full gap-4 mt-2 ">
            <div>
              <Label>Fecha de inicio</Label>
              <Input
                onChange={(e) =>
                  setDateVacation({
                    ...dateVacation,
                    start_date: e.target.value,
                  })
                }
                type="date"
              ></Input>
            </div>
            <div>
              <Label>Fecha fin</Label>
              <Input
                onChange={(e) =>
                  setDateVacation({ ...dateVacation, end_date: e.target.value })
                }
                type="date"
              ></Input>
            </div>

            <div className="col-span-2">
              <Label>Motivo</Label>
              <Textarea
                onChange={(e) =>
                  setDateVacation({ ...dateVacation, reason: e.target.value })
                }
              ></Textarea>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleRegister}>Registrar vacaciones</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openModalHistory}
        onOpenChange={() => setOpenModalHistory(!openModalHistory)}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Historial de vacaciones</DialogTitle>
          </DialogHeader>
          <div className=" w-full gap-8 max-h-[500px] overflow-y-scroll">
            <table cellPadding={8} className="text-sm w-full text-left border">
              <thead>
                <tr className="border-y">
                  <th>Periodo</th>
                  <th>Dias</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                </tr>
              </thead>
              <tbody>
                {dataVacationsAll.map((item, idx) => (
                  <tr className="border-y " key={idx}>
                    <td>
                      {formatDate(item.start_date)} a{" "}
                      {formatDate(item.end_date)}
                    </td>
                    <td>
                      {calculateDateDifference(item.start_date, item.end_date) +
                        1}
                    </td>
                    <td>{formatDate(item.start_date)}</td>
                    <td>{formatDate(item.end_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button>Exportar Datos</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VacationWorker;
