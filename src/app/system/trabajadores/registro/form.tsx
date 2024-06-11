"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { post } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";

function Form() {
  const [dataWorker, setDataWorker] = useState<any>({});

  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function handleRegisterData(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await post("workers", dataWorker, session.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el registro");
      setLoading(false);
    }
  }
  return (
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-lg font-semibold">Registrar trabajador</h1>
      </div>
      <form
        action=""
        onSubmit={handleRegisterData}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2  col-span-2">
          <Label>Nombres completos</Label>
          <Input
            type="text"
            onChange={(e) =>
              setDataWorker({
                ...dataWorker,
                full_name: e.target.value.toUpperCase(),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2  col-span-2">
          <Label>DNI</Label>
          <Input
            onChange={(e) =>
              setDataWorker({ ...dataWorker, dni: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2  col-span-2">
          <Label>Departamento</Label>
          <Input
            type="text"
            onChange={(e) =>
              setDataWorker({
                ...dataWorker,
                department: e.target.value.toUpperCase(),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2  col-span-2">
          <Label>Posición</Label>
          <Input
            type="text"
            onChange={(e) =>
              setDataWorker({
                ...dataWorker,
                position: e.target.value.toUpperCase(),
              })
            }
          />
        </div>

        <div className="flex flex-col gap-2  col-span-2">
          <Label>Fecha de contratación</Label>
          <Input
            type="date"
            onChange={(e) =>
              setDataWorker({ ...dataWorker, hire_date: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2  col-span-2">
          <Button disabled={loading} type="submit">
            Registrar trabajador
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Form;
