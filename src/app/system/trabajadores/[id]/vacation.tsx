"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function VacationWorker() {
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
        <span className="font-semibold">Vacaciones del trabajador</span>
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
          <Label>Fecha de inicio</Label>
          <Input type="date"></Input>
        </div>
        <div className="col-span-2">
          <Button>Registrar vacaciones</Button>
        </div>
      </form>
    </div>
  );
}

export default VacationWorker;
