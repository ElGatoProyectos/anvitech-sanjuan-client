"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { post } from "@/app/http/api.http";
import { createUserSchema } from "@/app/form-schemas/create-user.schema";
import { useUpdatedStore } from "@/app/store/zustand";

function CardHeaderUser() {
  // define states

  const { setUpdatedAction } = useUpdatedStore();

  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

  const [data, setData] = useState({
    full_name: "",
    dni: "",
    email: "",
  });

  // define functions

  async function handleSubmit() {
    try {
      createUserSchema.parse(data);
      if (session.status === "authenticated") {
        await post("users", data, session.data);
        useToastDefault("Ok", "Registro realizado con exito");
      }

      setUpdatedAction();
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el formulario");
    }
  }

  return (
    <Dialog>
      <div className="items-start justify-between flex ">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-lg font-semibold">
            Lista de usuarios
          </h3>
        </div>
        <div className="mt-3 md:mt-0">
          <DialogTrigger asChild>
            <Button className=" ">Registrar</Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Registrar usuario</DialogTitle>
          <DialogDescription className="mt-2">
            Recuerde que las credenciales por defecto no son seguras, se
            recomienda modificarlas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="gap-2">
            <Label>Nombres completos</Label>
            <Input
              onChange={(e) => setData({ ...data, full_name: e.target.value })}
              type="text"
              required
            />
          </div>
          <div className="gap-2">
            <Label>DNI</Label>
            <Input
              onChange={(e) => setData({ ...data, dni: e.target.value })}
              type="text"
              required
            />
          </div>
          <div className="gap-2">
            <Label>Email</Label>
            <Input
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="email"
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button onClick={handleSubmit} type="submit">
              Registrar ahora
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CardHeaderUser;
