"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { getId, putId } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
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
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";

function UpdateDataWorker({ id }: { id: string }) {
  // todo  define states
  const { updatedAction } = useUpdatedStore();

  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<any>({});
  const session = useSession();

  async function fetchDataWorker(id: string) {
    try {
      const response = await getId("workers", Number(id), session.data);
      setWorker(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      // await putId("workers", worker, Number(id), session.data);
    } catch (error) {
      useToastDestructive("Error", "Error al modificar trabajador");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataWorker(id);
    }
  }, [session.status, updatedAction]);

  return (
    <div className="bg-white p-8 rounded-lg">
      <div>
        <span className="font-semibold">Datos del trabajador</span>
      </div>
      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-3 w-full gap-20 mt-8 "
      >
        {loading ? (
          <Skeleton className="col-span-3 h-36" />
        ) : (
          <>
            <div className="col-span-2">
              <div className="flex flex-col gap-4">
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
              </div>
            </div>
            <div className="flex flex-col gap-4">
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
              <div>
                <Button>Modificar datos</Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default UpdateDataWorker;
