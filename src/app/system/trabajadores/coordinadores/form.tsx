"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { post } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

function FormRegisterCoordinator() {
  const { setUpdatedAction, updatedAction } = useUpdatedStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ full_name: "" });

  const session = useSession();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await post("workers/coordinators", data, session.data);
      useToastDefault("Ok", "Coordinador registrado");
      setLoading(false);
      setUpdatedAction();
    } catch (error) {
      setLoading(false);
      useToastDestructive("Error", "Error al registrar coordinador");
    }
  }

  return (
    <div className="w-full  col-span-1">
      <form onSubmit={handleSubmit} className="flex  gap-4">
        <div className="flex w-full gap-2">
          <Input
            className="w-full"
            placeholder="Ingrese los nombres"
            onChange={(e) =>
              setData({
                ...data,
                full_name: e.target.value,
              })
            }
          ></Input>
        </div>

        <div className="flex flex-col gap-2">
          <Button disabled={loading}>Registrar ahora</Button>
        </div>
      </form>
    </div>
  );
}

export default FormRegisterCoordinator;
