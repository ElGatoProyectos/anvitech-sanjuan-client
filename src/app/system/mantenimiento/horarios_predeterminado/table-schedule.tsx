"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get, post, putId } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

function TableSchedule() {
  const [typeSchedules, setTypeSchedules] = useState<any[]>([]);
  const [typeScheduleSelected, setTypeScheduleSelected] = useState<any>({});
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
  });
  const [loading, setLoading] = useState(false);

  const [newFetch, setNewFetch] = useState(false);
  const session = useSession();

  function handleSelectTypeSchedule(typeSchedule: any) {
    setTypeScheduleSelected(typeSchedule);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);

      await post("schedule/type", newSchedule, session.data);
      setLoading(false);
      setNewFetch(!newFetch);
      setNewSchedule({
        name: "",
        lunes: "",
        martes: "",
        miercoles: "",
        jueves: "",
        viernes: "",
        sabado: "",
      });
    } catch (error) {
      setLoading(false);
      useToastDestructive("Error", "Error al traer modificar horario");
    }
  }

  async function handleUpdate() {
    try {
      setLoading(true);
      const { id, ...dataSet } = typeScheduleSelected;
      await putId("schedule/type", dataSet, id, session.data);
      setNewFetch(!newFetch);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Erro al traer modificar horario");
    }
  }

  async function fetchTypesSchedules() {
    try {
      setLoading(true);
      const response = await get("schedule/type", session.data);
      setTypeSchedules(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Erro al traer los horarios");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchTypesSchedules();
    }
  }, [session.status, newFetch]);

  return (
    <div className="grid grid-cols-4 gap-8 text-sm">
      {/* form register */}
      <div className="col-span-1 border rounded-lg p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label>Nombre del horario</Label>
            <Input
              value={newSchedule.name}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, name: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Label>Lunes</Label>
            <Input
              value={newSchedule.lunes}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, lunes: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Label>Martes</Label>
            <Input
              value={newSchedule.martes}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, martes: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Label>Miercoles</Label>
            <Input
              value={newSchedule.miercoles}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, miercoles: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Label>Jueves</Label>
            <Input
              value={newSchedule.jueves}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, jueves: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Label>Viernes</Label>
            <Input
              value={newSchedule.viernes}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, viernes: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Label>Sabado</Label>
            <Input
              value={newSchedule.sabado}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, sabado: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <Button disabled={loading}>Registrar</Button>
          </div>
        </form>
      </div>

      {/* table list */}
      <div className="col-span-3  border rounded-lg p-4">
        <Dialog>
          <table className="w-full table-auto text-sm text-left">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Nombre</th>
                <th className="py-3 pr-6">lunes</th>
                <th className="py-3 pr-6">martes</th>
                <th className="py-3 pr-6">miercoles</th>
                <th className="py-3 pr-6">jueves</th>
                <th className="py-3 pr-6">viernes</th>
                <th className="py-3 pr-6">sabado</th>
                <th className="py-3 pr-6">Detalle</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y text-xs">
              {typeSchedules.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.lunes}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.martes}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.miercoles}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.jueves}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.viernes}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.sabado}</td>

                  <td className="text-left whitespace-nowrap">
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleSelectTypeSchedule(item)}
                        variant={"outline"}
                      >
                        <Settings />
                      </Button>
                    </DialogTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Editar Horario</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <Label>Nombre de horario</Label>
                <Input
                  defaultValue={typeScheduleSelected.name}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      name: e.target.value,
                    })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Lunes</Label>
                <Input
                  defaultValue={typeScheduleSelected.lunes}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      lunes: e.target.value,
                    })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Martes</Label>
                <Input
                  defaultValue={typeScheduleSelected.martes}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      martes: e.target.value,
                    })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Miercoles</Label>
                <Input
                  defaultValue={typeScheduleSelected.miercoles}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      miercoles: e.target.value,
                    })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Jueves</Label>
                <Input
                  defaultValue={typeScheduleSelected.jueves}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      jueves: e.target.value,
                    })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Viernes</Label>
                <Input
                  defaultValue={typeScheduleSelected.viernes}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      viernes: e.target.value,
                    })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Sabado</Label>
                <Input
                  defaultValue={typeScheduleSelected.sabado}
                  onChange={(e) =>
                    setTypeScheduleSelected({
                      ...typeScheduleSelected,
                      sabado: e.target.value,
                    })
                  }
                ></Input>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button onClick={handleUpdate} type="submit" disabled={loading}>
                  Modificar ahora
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default TableSchedule;
