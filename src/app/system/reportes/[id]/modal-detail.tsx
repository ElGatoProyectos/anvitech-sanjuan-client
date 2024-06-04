"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get, getByDNI, getId, post } from "@/app/http/api.http";
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

function ModalDetailReport({
  worker,
  reportId,
}: {
  worker: any;
  reportId: string;
}) {
  /// define states

  // console.log("workermodal-----", worker);
  const session = useSession();
  const [daySelected, setDaySelected] = useState("");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [falta, setFalta] = useState(false);

  const [dataDetail, setDataDetail] = useState<any[]>([]);

  const [hours, setHours] = useState({
    hora_inicio: "",
    hora_inicio_refrigerio: "",
    hora_fin_refrigerio: "",
    hora_salida: "",
  });

  /// define functions

  function handleSelectDay(e: string) {
    setDaySelected(e);

    const detailFiltered = dataDetail.find((item) => item.dia === e);

    if (detailFiltered) {
      setHours({
        ...hours,
        hora_inicio: detailFiltered?.hora_inicio || "",
        hora_inicio_refrigerio: detailFiltered?.hora_inicio_refrigerio || "",
        hora_fin_refrigerio: detailFiltered?.hora_fin_refrigerio || "",
        hora_salida: detailFiltered?.hora_salida || "",
      });
    } else {
      setHours({
        hora_inicio: "",
        hora_inicio_refrigerio: "",
        hora_fin_refrigerio: "",
        hora_salida: "",
      });
    }
  }

  async function fetchIncidents() {
    try {
      const response = await get("incidents", session.data);
      setIncidents(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function fetchDetailReport(dni: string, reportId: string) {
    try {
      const response = await post(
        "reports/detail",
        { dni, reportId },
        session.data
      );
      setDataDetail(response.data);
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
    if (worker.dni) {
      fetchIncidents();
      fetchDetailReport(worker.dni, reportId);
    }
  }, [worker]);

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Modificar registros</DialogTitle>
        <DialogDescription>
          Recuerde que esta modificación afectara directamente a la base de
          datos
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
              <SelectItem value="lunes">Lunes</SelectItem>
              <SelectItem value="martes">Martes</SelectItem>
              <SelectItem value="miercoles">Miercoles</SelectItem>
              <SelectItem value="jueves">Jueves</SelectItem>
              <SelectItem value="viernes">Viernes</SelectItem>
              <SelectItem value="sabado">Sabado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {daySelected !== "" ? (
          <div className="grid grid-cols-2 w-full mt-8 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Ingreso</Label>
              <Input defaultValue={hours.hora_inicio}></Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Salida</Label>
              <Input defaultValue={hours.hora_salida}></Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Salida refrigerio</Label>
              <Input defaultValue={hours.hora_inicio_refrigerio}></Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Retorno refrigerio</Label>
              <Input defaultValue={hours.hora_fin_refrigerio}></Input>
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
