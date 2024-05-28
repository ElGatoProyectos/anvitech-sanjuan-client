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
import { useState } from "react";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { toast } from "@/components/ui/use-toast";

function CardHeaderUser() {
  // define states

  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");

  // define functions

  async function fetchGenerateReport() {
    try {
      setIsLoading(!isLoading);

      setTimeout(() => {
        setIsLoading(!isLoading);
      }, 2000);
    } catch (error) {}
  }

  async function handleGenerateReport() {
    if (password !== "admin") {
      console.log("error");
      useToastDestructive("Error", "Credenciales incorrectas");
    } else {
      useToastDefault(
        "Ok",
        <div className="w-fit">
          <span className="animate-pulse">Registrando</span>
        </div>
      );

      setTimeout(() => {
        useToastDefault("Ok", "Reporte generado con exito");
      }, 2000);

      await fetchGenerateReport();
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
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              required
            />
          </div>
          <div className="gap-2">
            <Label>DNI</Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              required
            />
          </div>
          <div className="gap-2">
            <Label>Email</Label>
            <Input onChange={(e) => setPassword(e.target.value)} type="email" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button onClick={handleGenerateReport} type="submit">
              Registrar ahora
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CardHeaderUser;
