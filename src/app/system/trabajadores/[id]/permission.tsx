"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function PermissionsWorker() {
  const [dateVacation, setDateVacation] = useState({
    start: "",
    end: "",
  });

  async function handleUpdate() {
    try {
    } catch (error) {}
  }
  return (
    <div className="bg-white p-8 rounded-lg">
      <div>
        <span className="font-semibold">Permisos del trabajador</span>
      </div>
      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-2 w-full gap-8 mt-8 "
      >
        <div>
          <Label>Fecha de inicio</Label>
          <Input type="date"></Input>
        </div>
        <div>
          <Label>Fecha de culminacion</Label>
          <Input type="date"></Input>
        </div>
        <div className="col-span-2">
          <Label>Razon o motivo</Label>
          <Textarea className="w-full h-20"></Textarea>
        </div>
        <div className="col-span-2">
          <Button>Registrar permiso</Button>
        </div>
      </form>
    </div>
  );
}

export default PermissionsWorker;
