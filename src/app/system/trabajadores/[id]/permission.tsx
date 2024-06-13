"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function PermissionsWorker() {
  const [dateVacation, setDateVacation] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);

  async function handleUpdate() {
    try {
    } catch (error) {}
  }
  return (
    <div className="bg-white p-8 rounded-lg">
      <div>
        <span className="font-semibold">Permisos del trabajador</span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <table cellPadding={8} className="text-sm w-full text-left border">
          <thead>
            <tr className="border-y">
              <th>Periodo</th>
              <th>Dias</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-y ">
              <td>Mayo 2024</td>
              <td>7</td>
              <td>15/02/2024</td>
              <td>15/02/2024</td>
            </tr>
            <tr className="border-y">
              <td>Mayo 2024</td>
              <td>7</td>
              <td>15/02/2024</td>
              <td>15/02/2024</td>
            </tr>
            <tr className="border-y">
              <td>Mayo 2024</td>
              <td>7</td>
              <td>15/02/2024</td>
              <td>15/02/2024</td>
            </tr>
          </tbody>
        </table>
        <div className=" flex gap-4">
          <Button onClick={() => setOpenModalHistory(true)}>
            Mostrar todas los permisos
          </Button>
          <Button onClick={() => setOpenModal(true)}>Registrar permiso</Button>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={() => setOpenModal(!openModal)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registro de permiso</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-2 w-full gap-4 mt-2 "
          >
            <div>
              <Label>Fecha de inicio</Label>
              <Input
                onChange={(e) =>
                  setDateVacation({
                    ...dateVacation,
                    start_date: e.target.value,
                  })
                }
                type="date"
              ></Input>
            </div>
            <div>
              <Label>Fecha fin</Label>
              <Input
                onChange={(e) =>
                  setDateVacation({ ...dateVacation, end_date: e.target.value })
                }
                type="date"
              ></Input>
            </div>

            <div className="col-span-2">
              <Label>Motivo</Label>
              <Textarea
                onChange={(e) =>
                  setDateVacation({ ...dateVacation, reason: e.target.value })
                }
              ></Textarea>
            </div>
          </form>
          <DialogFooter>
            <Button>Registrar vacaciones</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openModalHistory}
        onOpenChange={() => setOpenModalHistory(!openModalHistory)}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Historial de permisos</DialogTitle>
          </DialogHeader>
          <div className=" w-full gap-8 max-h-[500px] overflow-y-scroll">
            <table cellPadding={8} className="text-sm w-full text-left border">
              <thead>
                <tr className="border-y">
                  <th>Periodo</th>
                  <th>Dias</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-y ">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
                <tr className="border-y">
                  <td>Mayo 2024</td>
                  <td>7</td>
                  <td>15/02/2024</td>
                  <td>15/02/2024</td>
                </tr>
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button>Exportar Datos</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PermissionsWorker;
