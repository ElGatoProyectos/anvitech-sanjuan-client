"use client";
import { useToastDestructive } from "@/app/hooks/toast.hook";
import { post } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";

function FormIncidents() {
  const session = useSession();

  const { setUpdatedAction, updatedAction } = useUpdatedStore();

  const [incident, setIncident] = useState({ title: "", description: "" });

  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await post("incidents", { incident, password }, session.data);
      setUpdatedAction();
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el formulario");
    }
  }

  return (
    <div className="w-full  col-span-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Titulo</Label>
          <Input
            onChange={(e) =>
              setIncident({ ...incident, title: e.target.value })
            }
          ></Input>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Descripcion</Label>
          <Textarea
            className="w-full"
            onChange={(e) =>
              setIncident({ ...incident, description: e.target.value })
            }
          ></Textarea>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Contrasena administrador</Label>
          <Input onChange={(e) => setPassword(e.target.value)}></Input>
        </div>
        <div className="flex flex-col gap-2">
          <Button>Registrar incidente</Button>
        </div>
      </form>
    </div>
  );
}

export default FormIncidents;
