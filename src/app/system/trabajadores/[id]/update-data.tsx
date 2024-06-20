"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { get, getId, post, putId } from "@/app/http/api.http";
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
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";

const companies = [
  {
    name: "INTEGRAL NORTE SAC",
    ruc: "20605413740",
  },
  {
    name: "INTEGRAL PRO SAC",
    ruc: "20605413944",
  },
  {
    name: "INTEGRAL ORIENTE SAC",
    ruc: "20609799065",
  },
  {
    name: "INTEGRAL SUR SAC",
    ruc: "20609802805",
  },
  {
    name: "DIGITAL MAX SAC",
    ruc: "20600665341",
  },
];

function UpdateDataWorker({ id }: { id: string }) {
  // todo  define states
  const { updatedAction, setUpdatedAction } = useUpdatedStore();

  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<any>({});
  const session = useSession();

  const [terminations, setTerminations] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);

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
      const formatData = {
        ...worker,
        company: worker.company.split("-")[0],
        company_ruc: worker.company.split("-")[1],
      };

      await putId("workers", formatData, Number(id), session.data);

      useToastDefault("Ok", "Modificacion realizada con exito");
    } catch (error) {
      useToastDestructive("Error", "Error al modificar trabajador");
    }
  }

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

  async function fetchTerminations() {
    try {
      const response = await get("terminations", session.data);
      setTerminations(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer los motivos de cese");
    }
  }

  async function fetchSupervisors() {
    try {
      const response = await get("workers/supervisor", session.data);
      setSupervisors(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer los supervisores");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataWorker(id);
      fetchTerminations();
      fetchSupervisors();
    }
  }, [session.status, updatedAction]);

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

                  <Autocomplete
                    label="Seleccione uno"
                    className="w-full"
                    defaultInputValue={worker.supervisor}
                    onInputChange={(value) =>
                      setWorker({ ...worker, supervisor: value })
                    }
                  >
                    {supervisors.map((item, idx) => (
                      <AutocompleteItem key={idx} value={item.full_name}>
                        {item.full_name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {/* <Input
                    defaultValue={worker.supervisor}
                    onChange={(e) =>
                      setWorker({ ...worker, position: e.target.value })
                    }
                  ></Input> */}
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Coordinador</Label>
                  <Autocomplete
                    label="Seleccione uno"
                    className="w-full"
                    defaultInputValue={worker.coordinator}
                    onInputChange={(value) =>
                      setWorker({ ...worker, coordinator: value })
                    }
                  >
                    {supervisors.map((item, idx) => (
                      <AutocompleteItem key={idx} value={item.full_name}>
                        {item.full_name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Gestor comercial</Label>
                  <Autocomplete
                    label="Seleccione uno"
                    className="w-full"
                    defaultInputValue={worker.management}
                    onInputChange={(value) =>
                      setWorker({ ...worker, management: value })
                    }
                  >
                    {supervisors.map((item, idx) => (
                      <AutocompleteItem key={idx} value={item.full_name}>
                        {item.full_name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label>Empresa</Label>
                <Select
                  value={worker.company}
                  onValueChange={(e) => setWorker({ ...worker, company: e })}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue>{worker.company}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company, index) => (
                        <SelectItem
                          value={company.name + "-" + company.ruc}
                          key={index}
                        >
                          {company.name + "-" + company.ruc}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
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

              <Select
                onValueChange={(value) =>
                  setTermination({
                    ...termination,
                    reason: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {terminations.map((item, index) => (
                      <SelectItem value={item.title} key={index}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* <Textarea
                defaultValue={worker.reason}
                onChange={(e) =>
                  setTermination({
                    ...termination,
                    reason: e.target.value,
                  })
                }
              ></Textarea> */}
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
