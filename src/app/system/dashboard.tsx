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
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";

function Dashboard() {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [date, setDate] = useState("");

  const {
    attendanceVsAbsence,
    formattedLateness,
    loading,
    changeFilter,
    dataDepartments,
    week,
  } = useWorkerWeek(date);

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white w-full col-span-2  p-2 rounded-lg flex gap-16 justify-end">
        <div className="flex gap-4">
          <span>Filtrar por fecha semanal</span>
          <Input type="date" onChange={(e) => setDate(e.target.value)}></Input>
        </div>
        {/* <div className="flex gap-4">
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Seleccione un departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos</SelectItem>
                  {dataDepartments.map((item, index) => (
                    <SelectItem key={index} value={item.department}>
                      {item.department}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={changeFilter}>Filtrar</Button>
          </div> */}
      </div>
      {/* <GraphicBar attendanceVsAbsence={attendanceVsAbsence} /> */}
      <GraphicBar week={week} />

      <GraphicLine formattedLateness={formattedLateness} />

      <div className="bg-white w-full  p-2  rounded-lg xl:col-span-1 col-span-2">
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

      <div className="bg-white w-full  p-2  rounded-lg xl:col-span-1 col-span-2">
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

      <Modal isOpen={loading || isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="flex justify-start py-8">
                Traendo la informacion, espere un momento
                <Spinner />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Dashboard;
