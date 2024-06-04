"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function ModalDetailReport({ detail }: { detail: any }) {
  /// define states
  const session = useSession();
  const [daySelected, setDaySelected] = useState("");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [falta, setFalta] = useState(false);

  /// define functions

  function handleSelectDay(e: string) {
    setDaySelected(e);
  }

  async function fetchIncidents() {
    try {
      const response = await get("incidents", session.data);
      setIncidents(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function handleUpdateHours() {
    try {
    } catch (error) {
      useToastDestructive("Error", "Hubo un error al modificar las horas");
    }
  }

  async function handleAddIncident() {
    try {
    } catch (error) {
      useToastDestructive("Error", "Hubo un error al registrar la incidencia");
    }
  }

  /// run handlers

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchIncidents();
    }
  }, [session.status]);

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Modificar registros</DialogTitle>
        <DialogDescription>
          Recuerde que esta modifcacion afectara directamente a la base de datos
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center w-full mb-4">
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

        <div className="flex justify-end mt-4 w-full">
          <Button type="button" variant="default">
            Guardar cambios de horas
          </Button>
        </div>
      </div>

      <hr />

      <div className="mb-4">
        <span className="font-semibold">Ingreso de incidentes</span>

        {falta ? (
          <>
            <div className="w-full mt-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un incidente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {incidents.map((item, index) => (
                      <SelectItem value={item.id}>{item.title}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="button" variant="default">
                Guardar cambios de incidentes
              </Button>
            </div>
          </>
        ) : (
          <div>
            <span className="text-sm text-gray-600">
              El usuario no tiene faltas, si desea puede activar la opcion de
              agregar incidentes
            </span>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="default"
                onClick={() => setFalta(!falta)}
              >
                Habilitar
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export default ModalDetailReport;
