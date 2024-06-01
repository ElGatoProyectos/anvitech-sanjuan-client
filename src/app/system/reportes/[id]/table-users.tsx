"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import ModalDetailReport from "./modal-detail";

const users = [
  {
    id: 1,
    fullName: "Usuario 1",
    reporte: "Reporte 1",
  },
  {
    id: 2,
    fullName: "Usuario 2",
    reporte: "Reporte 1",
  },
  {
    id: 3,
    fullName: "Usuario 3",
    reporte: "Reporte 1",
  },
  {
    id: 4,
    fullName: "Usuario 4",
    reporte: "Reporte 1",
  },
  {
    id: 5,
    fullName: "Usuario 5",
    reporte: "Reporte 1",
  },
  {
    id: 6,
    fullName: "Usuario 6",
    reporte: "Reporte 1",
  },
  {
    id: 7,
    fullName: "Usuario 7",
    reporte: "Reporte 1",
  },
  {
    id: 8,
    fullName: "Usuario 8",
    reporte: "Reporte 1",
  },
  {
    id: 9,
    fullName: "Usuario 9",
    reporte: "Reporte 1",
  },
  {
    id: 10,
    fullName: "Usuario 10",
    reporte: "Reporte 1",
  },
];

function TableUser() {
  // const [daySelected, setDaySelected] = useState("");

  // function handleSelectDay(e: string) {
  //   setDaySelected(e);
  // }

  return (
    <Dialog>
      <div className=" flex flex-col">
        <div className="flex p-2 gap-4">
          <Input></Input>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Seleccione uno</SelectLabel>
                <SelectItem value="apple">Corregir</SelectItem>
                <SelectItem value="banana">Verificado</SelectItem>
                <SelectItem value="blueberry">Corregido</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-2">
          <table className="w-full table-auto text-sm text-left ">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Nombres</th>
                <th className="py-3 pr-6">Reporte</th>
                <th className="py-3 pr-6">Estado</th>

                <th className="py-3 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {users.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.fullName}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.reporte}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-2 rounded-full font-semibold text-xs ${
                        item.id % 2 === 0
                          ? "text-green-600 bg-green-50"
                          : "text-blue-600 bg-blue-50"
                      }`}
                    >
                      {item.id % 2 === 0 ? "Verificado" : "Corregir"}
                    </span>
                  </td>

                  <td className="text-right whitespace-nowrap">
                    <DialogTrigger asChild>
                      <Button variant="secondary">Detalle</Button>
                    </DialogTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDetailReport></ModalDetailReport>

      {/* <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Modificar registros</DialogTitle>
          <DialogDescription>
            Recuerde que esta modifcacion afectara directamente a la base de
            datos
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center w-full">
          <Select onValueChange={(e) => handleSelectDay(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Seleccione un dia</SelectLabel>
                <SelectItem value="Lunes">Lunes</SelectItem>
                <SelectItem value="Martes">Martes</SelectItem>
                <SelectItem value="Miercoles">Miercoles</SelectItem>
                <SelectItem value="Jueves">Jueves</SelectItem>
                <SelectItem value="Viernes">Viernes</SelectItem>
                <SelectItem value="Sabado">Sabado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {daySelected !== "" ? (
            <div className="grid grid-cols-2 w-full mt-8 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Ingreso</Label>
                <Input></Input>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Salida</Label>
                <Input></Input>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Salida refrigerio</Label>
                <Input></Input>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Retorno refirgerio</Label>
                <Input></Input>
              </div>
            </div>
          ) : (
            <div className="w-full mt-8 text-slate-600 h-36">
              <span>No ha seleccionado un dia</span>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end mt-8">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>

          <Button type="button" variant="default">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent> */}
    </Dialog>
  );
}

export default TableUser;
