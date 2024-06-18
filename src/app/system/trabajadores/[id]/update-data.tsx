"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { getId, post, putId } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";

function UpdateDataWorker({ id }: { id: string }) {
  // todo  define states
  const { updatedAction, setUpdatedAction } = useUpdatedStore();

  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<any>({});
  const session = useSession();

  const [termination, setTermination] = useState({
    termination_date: "",
    reason: "",
  });

  const [openModalTermination, setOpenModalTermination] = useState(false);

  async function fetchDataWorker(id: string) {
    try {
      const response = await getId("workers", Number(id), session.data);
      console.log(response.data);
      setWorker(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log(worker);

      await putId("workers", worker, Number(id), session.data);

      useToastDefault("Ok", "Modificacion realizada con exito");
    } catch (error) {
      useToastDestructive("Error", "Error al modificar trabajador");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataWorker(id);
    }
  }, [session.status, updatedAction]);

  function formatDateToInput(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const formatDateToInputNull = (date: Date | null) => {
    if (!date) return "";
    const isoString = new Date(date).toISOString();
    return isoString.split("T")[0];
  };

  // =========================== cese de trabajador ================================

  async function handleUpdateDateTermination() {
    try {
      setLoading(true);
      await putId("workers/termination", termination, worker.id, session.data);
      setLoading(false);
      useToastDefault("Ok", "Fecha de cese registrada");
      setUpdatedAction();
    } catch (error) {
      useToastDestructive("Error", "Error al ingresar el cese");
      setLoading(false);
    }
  }

  async function handleRemoveTermination() {
    try {
      setLoading(true);
      await putId(
        "workers/termination",
        { restore: true },
        worker.id,
        session.data
      );
      setLoading(false);
      useToastDefault("Ok", "Fecha de cese anulada");
      setUpdatedAction();
    } catch (error) {
      useToastDestructive("Error", "Error al ingresar el cese");
      setLoading(false);
    }
  }

  //- component
  return (
    <div className="bg-white p-8 rounded-lg">
      <div>
        <span className="font-semibold">Datos del trabajador</span>
      </div>
      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-2 w-full gap-20 mt-8 "
      >
        {loading ? (
          <Skeleton className="col-span-3 h-36" />
        ) : (
          <>
            <div className="">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Tipo de documento</Label>
                  <Input
                    onChange={(e) =>
                      setWorker({ ...worker, type_dni: e.target.value })
                    }
                    defaultValue={worker.type_dni}
                  ></Input>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>DNI</Label>
                  <Input
                    onChange={(e) =>
                      setWorker({ ...worker, dni: e.target.value })
                    }
                    defaultValue={worker.dni}
                  ></Input>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Nombres completos</Label>
                  <Input
                    defaultValue={worker.full_name}
                    onChange={(e) =>
                      setWorker({ ...worker, full_name: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Departamento</Label>
                  <Input
                    defaultValue={worker.department}
                    onChange={(e) =>
                      setWorker({ ...worker, department: e.target.value })
                    }
                  ></Input>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Posición</Label>
                  <Input
                    defaultValue={worker.position}
                    onChange={(e) =>
                      setWorker({ ...worker, position: e.target.value })
                    }
                  ></Input>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Supervisor</Label>
                  <Input
                    defaultValue={worker.supervisor}
                    onChange={(e) =>
                      setWorker({ ...worker, position: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Coordinador</Label>
                  <Input
                    defaultValue={worker.coordinator}
                    onChange={(e) =>
                      setWorker({ ...worker, position: e.target.value })
                    }
                  ></Input>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Gestor comercial</Label>
                  <Input
                    defaultValue={worker.management}
                    onChange={(e) =>
                      setWorker({ ...worker, position: e.target.value })
                    }
                  ></Input>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label>Tipo contratacion</Label>
                <Select
                  value={worker.type_contract}
                  onValueChange={(e) =>
                    setWorker({ ...worker, type_contract: e })
                  }
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue>
                      {worker.type_contract === "VENDEDOR"
                        ? "VENDEDOR"
                        : "SUPERVISOR"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="VENDEDOR">VENDEDOR</SelectItem>
                      <SelectItem value="SUPERVISOR">SUPERVISOR</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Fecha de ingreso</Label>
                <Input
                  type="date"
                  defaultValue={formatDateToInput(worker.hire_date)}
                  onChange={(e) =>
                    setWorker({ ...worker, hire_date: e.target.value })
                  }
                ></Input>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Fecha de Cese</Label>
                <Input
                  disabled
                  type="date"
                  defaultValue={formatDateToInputNull(worker.termination_date)}
                ></Input>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Estado</Label>
                <Select
                  value={worker.enabled}
                  onValueChange={(e) => setWorker({ ...worker, enabled: e })}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue>
                      {worker.enabled === "si" ? "Habilitado" : "Deshabilitado"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="si">Habilitado</SelectItem>
                      <SelectItem value="no">Deshabilitado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button type="submit">Guardar cambios</Button>
                <Button
                  type="button"
                  onClick={() => setOpenModalTermination(true)}
                  variant={"outline"}
                >
                  Fecha de cese
                </Button>
              </div>
            </div>
          </>
        )}
      </form>

      <Dialog
        open={openModalTermination}
        onOpenChange={() => setOpenModalTermination(!openModalTermination)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fecha de cese</DialogTitle>
            <DialogDescription>
              Recuerde que esta accion inhabilita al trabajador
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label>Seleccione una fecha</Label>
              <Input
                type="date"
                defaultValue={formatDateToInputNull(worker.termination_date)}
                onChange={(e) =>
                  setTermination({
                    ...termination,
                    termination_date: e.target.value,
                  })
                }
              ></Input>
            </div>
            <div>
              <Label>Ingrese el motivo</Label>
              <Textarea
                defaultValue={worker.reason}
                onChange={(e) =>
                  setTermination({
                    ...termination,
                    reason: e.target.value,
                  })
                }
              ></Textarea>
            </div>
          </div>
          <DialogFooter>
            {worker.termination_date !== "" && (
              <Button
                type="button"
                variant={"outline"}
                onClick={handleRemoveTermination}
                disabled={loading}
              >
                Anular cese
              </Button>
            )}

            <Button
              type="button"
              onClick={handleUpdateDateTermination}
              disabled={loading}
            >
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdateDataWorker;
