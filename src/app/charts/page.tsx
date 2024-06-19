"use client";

import { useSession } from "next-auth/react";

import GraphicBar from "../graphics/bar";
import GraphicLine from "../graphics/line";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../globals.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkerWeek } from "../hooks/useWokersWeek";

function Dashboard() {
  const session = useSession();
  const { attendanceVsAbsence, formattedLateness } = useWorkerWeek();

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white w-full col-span-2 p-2 rounded-lg flex gap-16 justify-between">
        <div className="flex gap-4">
          <Input type="date"></Input>
          <Input type="date"></Input>
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
          <Button>Filtrar</Button>
        </div>
      </div>
      <GraphicBar attendanceVsAbsence={attendanceVsAbsence} />

      <GraphicLine formattedLateness={formattedLateness} />

      <div className="bg-white w-full  p-2  rounded-lg">
        <table className="w-full text-left text-sm ">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>DNI</th>
              <th>Posicion</th>
              <th>Departamento</th>
              <th>Supervisor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>

              <td></td>

              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white w-full  p-2  rounded-lg">
        <table className="w-full text-left text-sm ">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>DNI</th>
              <th>Posicion</th>
              <th>Departamento</th>
              <th>Supervisor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>

              <td></td>

              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
