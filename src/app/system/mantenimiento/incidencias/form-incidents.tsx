"use client";
import { useToastDestructive } from "@/app/hooks/toast.hook";
import { post } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalBody, ModalContent, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";

function FormIncidents() {
  /// define states
  const session = useSession();
  const { setUpdatedAction, updatedAction } = useUpdatedStore();
  const [incident, setIncident] = useState({
    title: "",
    description: "",
    date: "",
  });
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
        await post("incidents", incident, session.data);
        setUpdatedAction();
        setIncident({ title: "", description: "", date: "" });
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Titulo</Label>
            <Input
              onChange={(e) =>
                setIncident({ ...incident, title: e.target.value })
              }
              disabled={session.data?.user.role === "user"}
            ></Input>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Fecha de ejecucion</Label>
            <Input
              type="date"
              onChange={(e) =>
                setIncident({ ...incident, date: e.target.value })
              }
              disabled={session.data?.user.role === "user"}
            ></Input>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Descripción</Label>
          <Textarea
            className="w-full"
            onChange={(e) =>
              setIncident({ ...incident, description: e.target.value })
            }
            disabled={session.data?.user.role === "user"}
          ></Textarea>
        </div>

        <div className="flex flex-col gap-2">
          <Button disabled={loading || session.data?.user.role === "user"}>
            Registrar incidente
          </Button>
        </div>

        <Modal isOpen={loading || session.status !== "authenticated"}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex justify-start py-8">
                  Cargando , espere un momento
                  <Spinner />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </form>
    </div>
  );
}

export default FormIncidents;
