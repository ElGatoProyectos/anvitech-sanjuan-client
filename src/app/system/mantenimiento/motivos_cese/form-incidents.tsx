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
  /// define states
  const session = useSession();
  const { setUpdatedAction, updatedAction } = useUpdatedStore();
  const [termination, setTermination] = useState({ title: "" });
  const [loading, setLoading] = useState(false);

  /// define functions

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (
        session.data?.user.role === "admin" ||
        session.data?.user.role === "superadmin"
      ) {
        setLoading(true);
        await post("terminations", termination, session.data);
        setUpdatedAction();
        setTermination({ title: "" });
        setLoading(false);
      }
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el formulario");
      setLoading(false);
    }
  }

  return (
    <div className="w-full  col-span-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <span className="text-gray-600">
          Los motivos de cese no alteran al trabajador desdepues de haberlos
          modificados, si desea modificar su motivos de cese tiene que ir al
          detalle de trabajador
        </span>
        <div className="flex flex-col gap-2">
          <Label>Titulo</Label>
          <Textarea
            value={termination.title}
            onChange={(e) =>
              setTermination({ ...termination, title: e.target.value })
            }
            disabled={session.data?.user.role === "user"}
          ></Textarea>
        </div>

        <div className="flex flex-col gap-2">
          {session.data?.user.role === "admin" ||
            (session.data?.user.role === "superadmin" && (
              <Button disabled={loading}>Registrar motivo</Button>
            ))}
        </div>
      </form>
    </div>
  );
}

export default FormIncidents;
