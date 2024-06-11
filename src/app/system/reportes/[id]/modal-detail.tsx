"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import {
  deleteId,
  get,
  getByDNI,
  getId,
  post,
  putId,
} from "@/app/http/api.http";
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
import { CircleParking, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

function ModalDetailReport({
  worker,
  reportId,
  isClosing,
}: {
  worker: any;
  reportId: string;
  isClosing: boolean;
}) {
  /// define states

  const session = useSession();
  const [daySelected, setDaySelected] = useState("");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [falta, setFalta] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingUpdateIncident, setLoadingUpdateIncident] = useState(false);
  const [detailSelected, setDetailSelected] = useState<any>({});
  const [incidentSelected, setIncidentSelected] = useState("");
  const [incidentsForDetail, setincidentsForDetail] = useState<any[]>([]);

  const [loadingDetailIncidents, setLoadingDetailIncidents] = useState(false);

  const [dataDetail, setDataDetail] = useState<any[]>([]);

  const [hours, setHours] = useState({
    hora_inicio: "",
    hora_inicio_refrigerio: "",
    hora_fin_refrigerio: "",
    hora_salida: "",
  });

  /// define functions

  /// si en caso el dia no exista para el registro debería bloquear la muestra
  function handleSelectDay(e: string) {
    setDaySelected(e);

    const detailFiltered = dataDetail.find((item) => item.dia === e);

    setDetailSelected(detailFiltered);
    setFalta(detailFiltered.falta);
    setHours({
      ...hours,
      hora_inicio: detailFiltered?.hora_inicio || "",
      hora_inicio_refrigerio: detailFiltered?.hora_inicio_refrigerio || "",
      hora_fin_refrigerio: detailFiltered?.hora_fin_refrigerio || "",
      hora_salida: detailFiltered?.hora_salida || "",
    });

    fetchIncidentsDetail(detailFiltered.id);
  }

  async function fetchIncidents() {
    try {
      const response = await get("incidents", session.data);
      setIncidents(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function fetchIncidentsDetail(detailId: number) {
    try {
      const response = await getId("reports/incident/", detailId, session.data);
      console.log(response);
      setincidentsForDetail(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function fetchDetailReport(dni: string, reportId: string) {
    try {
      setLoadingDetailIncidents(true);
      const response = await post(
        "reports/detail",
        { dni, reportId },
        session.data
      );

      console.log(response.data);
      setDataDetail(response.data);
      setLoadingDetailIncidents(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la información");
    }
  }

  async function handleUpdateHours() {
    try {
      ///petición
      setLoadingUpdate(true);
      await putId("reports/detail", hours, detailSelected.id, session.data);
      useToastDefault("Ok", "Modificación realizada con éxito");

      setLoadingUpdate(false);
    } catch (error) {
      useToastDestructive("Error", "Hubo un error al modificar las horas");
      setLoadingUpdate(false);
    }
  }

  /// ok
  async function handleAddIncident() {
    try {
      setLoadingUpdate(true);
      await post(
        "reports/incident",
        { detailReportId: detailSelected.id, incidentId: incidentSelected },

        session.data
      );
      setLoadingUpdate(false);
    } catch (error) {
      setLoadingUpdate(false);

      useToastDestructive("Error", "Hubo un error al registrar la incidencia");
    }
  }

  async function handleDeleteIncident(detailId: number) {
    try {
      setLoadingUpdate(true);
      await deleteId("reports/detail", detailId, session.data);
      setLoadingUpdate(false);
    } catch (error) {
      useToastDestructive("Error", "Error al intentar eliminar");
    }
  }

  function handleCloseModal() {
    setHours({
      hora_inicio: "",
      hora_inicio_refrigerio: "",
      hora_fin_refrigerio: "",
      hora_salida: "",
    });

    setDaySelected("");

    setincidentsForDetail([]);
  }

  /// run handlers

  useEffect(() => {
    if (worker.dni) {
      fetchIncidents();
      fetchDetailReport(worker.dni, reportId);
    }
  }, [worker]);

  useEffect(() => {
    handleCloseModal();
  }, [isClosing]);

  useEffect(() => {
    if (session.status === "authenticated" && daySelected) {
      const detailFiltered = dataDetail.find(
        (item) => item.dia === daySelected
      );
      fetchIncidentsDetail(detailFiltered.id);
    }
  }, [loadingUpdate]);

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-base">Detalle de dia</DialogTitle>
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
              <Input
                value={hours.hora_inicio}
                onChange={(e) =>
                  setHours({ ...hours, hora_inicio: e.target.value })
                }
              ></Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Salida</Label>
              <Input
                value={hours.hora_salida}
                onChange={(e) =>
                  setHours({ ...hours, hora_salida: e.target.value })
                }
              ></Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Salida refrigerio</Label>
              <Input
                value={hours.hora_inicio_refrigerio}
                onChange={(e) =>
                  setHours({ ...hours, hora_inicio_refrigerio: e.target.value })
                }
              ></Input>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Retorno refrigerio</Label>
              <Input
                value={hours.hora_fin_refrigerio}
                onChange={(e) =>
                  setHours({ ...hours, hora_fin_refrigerio: e.target.value })
                }
              ></Input>
            </div>
          </div>
        ) : (
          <div className="w-full mt-8 text-slate-600 h-36">
            <span>No ha seleccionado un dia</span>
          </div>
        )}

        <div className="flex justify-end mt-4 w-full">
          {daySelected === "" ? (
            <Button size={"sm"} disabled type="button" variant="default">
              Dia no seleccionado
            </Button>
          ) : (
            <Button
              disabled={loadingUpdate}
              size={"sm"}
              type="button"
              variant="default"
              onClick={handleUpdateHours}
            >
              Guardar cambios de horas
            </Button>
          )}
        </div>
      </div>

      <hr />

      <div className="mb-4">
        <span className="text-sm font-semibold">Ingreso de incidentes</span>
        <br />

        <table className="text-sm text-slate-700 w-full text-left mt-2  table-auto">
          <tbody>
            {session.status === "authenticated" ? (
              incidentsForDetail.map((item, index) => (
                <tr key={index}>
                  <td>{item.incident.title}</td>
                  <td>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => handleDeleteIncident(item.id)}
                    >
                      <Trash size={20} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
        <br />

        {falta ? (
          <>
            <div className="w-full mt-4">
              <Select onValueChange={(e) => setIncidentSelected(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un incidente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {incidents.map((item, index) => (
                      <SelectItem value={item.id} key={index}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                variant="default"
                size={"sm"}
                onClick={handleAddIncident}
                disabled={
                  loadingUpdateIncident ||
                  incidentSelected === "" ||
                  loadingUpdate
                }
              >
                Guardar cambios de incidentes
              </Button>
            </div>
          </>
        ) : (
          <div>
            <span className="text-sm text-gray-600">
              El usuario no tiene faltas, si desea puede activar la opción de
              agregar incidentes
            </span>

            <div className="flex justify-end">
              <Button
                size={"sm"}
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
