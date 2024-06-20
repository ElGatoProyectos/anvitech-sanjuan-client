"use client";

import { useSession } from "next-auth/react";

import GraphicBar from "../graphics/bar";
import GraphicLine from "../graphics/line";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkerWeek } from "../hooks/useWokersWeek";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Dashboard() {
  const session = useSession();

  const [date, setDate] = useState("");

  const {
    attendanceVsAbsence,
    formattedLateness,
    loading,
    changeFilter,
    week,
  } = useWorkerWeek(date);

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white w-full col-span-2 p-2 rounded-lg flex gap-16 justify-between">
        <div className="flex gap-4">
          <Input type="date" onChange={(e) => setDate(e.target.value)}></Input>

          <Button>Filtrar</Button>
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Seleccione un departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="VENDEDOR">No definido</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={changeFilter}>Filtrar</Button>
        </div>
      </div>
      <GraphicBar attendanceVsAbsence={attendanceVsAbsence} />

      <GraphicLine formattedLateness={formattedLateness} />

      <div className="bg-white w-full  p-2  rounded-lg">
        <table className="w-full text-left text-sm  " cellPadding={2}>
          <thead>
            <tr>
              <th>NOMBRES</th>
              <th>DNI</th>
              <th>TARDANZAS</th>
            </tr>
          </thead>
          <tbody>
            {week.slice(0, 20).map((item: any, idx) => (
              <tr key={idx}>
                <td>{item.worker.full_name}</td>
                <td>{item.worker.dni}</td>
                <td>
                  {Number(item.lunes && item.lunes.tardanza === "si" ? 1 : 0) +
                    Number(
                      item.martes && item.martes.tardanza === "si" ? 1 : 0
                    ) +
                    Number(
                      item.miercoles && item.miercoles.tardanza === "si" ? 1 : 0
                    ) +
                    Number(
                      item.jueves && item.jueves.tardanza === "si" ? 1 : 0
                    ) +
                    Number(
                      item.viernes && item.viernes.tardanza === "si" ? 1 : 0
                    ) +
                    Number(
                      item.sabado && item.sabado.tardanza === "si" ? 1 : 0
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white w-full  p-2  rounded-lg">
        <table className="w-full text-left text-sm " cellPadding={2} border={1}>
          <thead>
            <tr>
              <th>NOMBRES</th>
              <th>DNI</th>
              <th>FALTAS</th>
            </tr>
          </thead>
          <tbody>
            {week.slice(0, 20).map((item: any, idx) => (
              <tr key={idx}>
                <td>{item.worker.full_name}</td>
                <td>{item.worker.dni}</td>

                <td>
                  {Number(item.lunes && item.lunes.falta === "si" ? 1 : 0) +
                    Number(item.martes && item.martes.falta === "si" ? 1 : 0) +
                    Number(
                      item.miercoles && item.miercoles.falta === "si" ? 1 : 0
                    ) +
                    Number(item.jueves && item.jueves.falta === "si" ? 1 : 0) +
                    Number(
                      item.viernes && item.viernes.falta === "si" ? 1 : 0
                    ) +
                    Number(item.sabado && item.sabado.falta === "si" ? 1 : 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
