"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { deleteId, getId, post, putId } from "@/app/http/api.http";
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
import { Settings, Trash } from "lucide-react";
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

  // add function handle change date

  const [isDeleteRowSelected, setIsDeleteRowSelected] = useState(false);
  const [rowSelected, setRowSelected] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    id: "",
  });

  async function handleSelectRow(data: any, type: string) {
    try {
      if (type === "delete") {
        await deleteId("vacations", data.id, session.data);
        useToastDefault("Ok", "Accion realizada correctamente");
      } else if (type === "edit-selected") {
        setIsDeleteRowSelected(true);
        setRowSelected({
          ...rowSelected,
          start_date: data.start_date.split("T")[0],
          end_date: data.end_date.split("T")[0],
          reason: data.reason,
          id: data.id,
        });
      } else if (type === "edit") {
        const { id, ...restData } = rowSelected;
        await putId(
          "vacations",
          restData,
          Number(rowSelected.id),
          session.data
        );
        useToastDefault("Ok", "Accion realizada correctamente");
      }
    } catch (error) {
      useToastDestructive("Error", "Error al ejecutar la accion");
    }
  }

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
                  {item.start_date.split("T")[0]} a{" "}
                  {item.end_date.split("T")[0]}
                </td>
                <td>
                  {calculateDateDifference(item.start_date, item.end_date) + 1}
                </td>
                <td>{item.start_date.split("T")[0]}</td>
                <td>{item.end_date.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" flex gap-4">
          <Button onClick={() => setOpenModalHistory(true)}>
            Mostrar todas las vaciones
          </Button>

          {session.data?.user.role === "admin" ||
            (session.data?.user.role === "superadmin" && (
              <Button onClick={() => setOpenModal(true)}>
                Registrar vacaciones
              </Button>
            ))}
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
        <DialogContent className="min-w-[60rem]">
          <DialogHeader>
            <DialogTitle>Historial de vacaciones</DialogTitle>
          </DialogHeader>
          <div className=" w-full gap-8 max-h-[500px]  flex justify-between ">
            <div className="overflow-y-scroll">
              <table
                cellPadding={12}
                className="text-sm min-w-full text-left border  "
              >
                <thead>
                  <tr className="border-y">
                    <th>Periodo</th>
                    <th>Dias</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {dataVacationsAll.map((item, idx) => (
                    <tr className="border-y " key={idx}>
                      <td>
                        {item.start_date.split("T")[0]} a{" "}
                        {item.end_date.split("T")[0]}
                      </td>
                      <td>
                        {calculateDateDifference(
                          item.start_date,
                          item.end_date
                        ) + 1}
                      </td>
                      <td>{item.start_date.split("T")[0]}</td>
                      <td>{item.end_date.split("T")[0]}</td>
                      <td>
                        <Trash
                          onClick={() => handleSelectRow(item, "delete")}
                          role="button"
                          color="red"
                          width={18}
                        />
                      </td>
                      <td>
                        <Settings
                          onClick={() => handleSelectRow(item, "edit-selected")}
                          role="button"
                          color="black"
                          width={20}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="relative min-w-40  ">
              {isDeleteRowSelected ? (
                <div className=" mr-8 flex flex-col gap-4">
                  <Input
                    className="min-w-48"
                    type="date"
                    value={rowSelected.start_date}
                    onChange={(e) =>
                      setRowSelected({
                        ...rowSelected,
                        start_date: e.target.value,
                      })
                    }
                  ></Input>
                  <Input
                    className="w-full"
                    type="date"
                    value={rowSelected.end_date}
                    onChange={(e) =>
                      setRowSelected({
                        ...rowSelected,
                        end_date: e.target.value,
                      })
                    }
                  ></Input>
                  <Textarea
                    value={rowSelected.reason}
                    onChange={(e) =>
                      setRowSelected({ ...rowSelected, reason: e.target.value })
                    }
                  ></Textarea>

                  <Button onClick={() => handleSelectRow(rowSelected, "edit")}>
                    Modificar
                  </Button>
                </div>
              ) : (
                <div className=" mr-8 flex flex-col gap-4">
                  <span>Seleccione una fila para editar</span>
                </div>
              )}
            </div>
          </div>
          {/* <DialogFooter>
            <Button>Exportar Datos</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VacationWorker;
