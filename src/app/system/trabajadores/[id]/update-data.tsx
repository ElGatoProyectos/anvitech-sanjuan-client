"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { getId, putId } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

function UpdateDataWorker({ id }: { id: string }) {
  console.log(id);
  // todo  define states
  const { updatedAction } = useUpdatedStore();

  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<any>({});
  const [password, setPassword] = useState("");
  const session = useSession();

  async function fetchDataWorker(id: string) {
    try {
      const response = await getId("workers", Number(id), session.data);
      setWorker(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la informacion");
    }
  }

  async function fetchDataGraphics() {}

  async function handleUpdate() {
    try {
      await putId("workers", worker, Number(id), session.data);
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
      <form action={``} className="grid grid-cols-3 w-full gap-20 mt-8 ">
        {loading ? (
          <Skeleton className="col-span-3 h-36" />
        ) : (
          <>
            <div className="col-span-2">
              <div className="flex flex-col gap-4">
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
                  <Label>DNI</Label>
                  <Input
                    onChange={(e) =>
                      setWorker({ ...worker, dni: e.target.value })
                    }
                    defaultValue={worker.dni}
                  ></Input>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label>Ingrese su contrasena de administrador</Label>
                <Input
                  onChange={(e) =>
                    setWorker({ ...worker, password: e.target.value })
                  }
                  type={`password`}
                />
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
