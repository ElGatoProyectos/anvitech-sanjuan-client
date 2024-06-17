"use client";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { post } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";

function FormIncidentsAbsolute() {
  /// define states
  const session = useSession();
  const { setUpdatedAction, updatedAction } = useUpdatedStore();
  const [incident, setIncident] = useState({ description: "", date: "" });
  const [loading, setLoading] = useState(false);

  /// define functions

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await post("incidents/absolute", incident, session.data);
      setUpdatedAction();
      setIncident({ description: "", date: "" });
      setLoading(false);

      useToastDefault("Ok", "Incidente creado");
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el formulario");
      setLoading(false);
    }
  }

  return (
    <div className="w-full  col-span-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Descripcion</Label>
          <Input
            onChange={(e) =>
              setIncident({ ...incident, description: e.target.value })
            }
          ></Input>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Fecha de ejecucion</Label>
          <Input
            type="date"
            onChange={(e) => setIncident({ ...incident, date: e.target.value })}
          ></Input>
        </div>

        <div className="flex flex-col gap-2">
          <Button disabled={loading}>Registrar ahora</Button>
        </div>
      </form>
    </div>
  );
}

export default FormIncidentsAbsolute;
