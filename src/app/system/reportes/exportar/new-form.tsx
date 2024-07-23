"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { get, post } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { reportNewSchema, reportStartSoftForWorker } from "./export-new";

function NewFormExport() {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  // ================================================================
  const [workers, setWorkers] = useState<any[]>([]);
  const [firstRangeDate, setFirstRangeDate] = useState({
    start: "",
    end: "",
  });
  const [workerSelected, setWorkerSelected] = useState<any>();

  async function fetchWorkers() {
    try {
      const response = await get("workers", session.data);
      setWorkers(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer los trabajadores");
    }
  }

  function handleSelectWorker(full_name: string) {
    const worker = workers.find((item) => item.full_name === full_name);
    setWorkerSelected(worker);
  }

  async function handleGenerateFisrtReport() {
    try {
      const response = await post(
        "reports/export/new-report-worker",
        { workerSelected, dateSelected: firstRangeDate },
        session.data
      );

      reportStartSoftForWorker(response.data, workerSelected);

      useToastDefault("Ok", "Reporte generado correctamente");
    } catch (error) {
      useToastDestructive("Error", "Ocurrio un error al generar reporte");
    }
  }

  //  ===============================================

  const [dateTwo, setDateTwo] = useState("");

  async function handleGenerateReportNewWeek() {
    try {
      const response = await post(
        "/reports/export/new-model-report",
        { dateSelected: dateTwo },
        session.data
      );
      reportNewSchema(response.data);
      useToastDefault("Ok", "Reporte generado correctamente");
    } catch (error) {
      useToastDestructive("Error", "Error al generar reporte");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchWorkers();
    }
  }, [session.status]);

  return (
    <>
      <div className="grid grid-cols-2 gap-16">
        {/*  */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-4">
            <Label>Seleccione un trabajador</Label>

            <Autocomplete
              label="Seleccione uno"
              className="w-full"
              onInputChange={(value) => handleSelectWorker(value)}
              isDisabled={session.data?.user.role === "user"}
            >
              {workers.map((item, idx) => (
                <AutocompleteItem key={idx} value={item.full_name}>
                  {item.full_name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Label>Seleccione rango de fecha</Label>
            <div className="flex gap-4 justify-between">
              <Input
                type="date"
                onChange={(e) =>
                  setFirstRangeDate({
                    ...firstRangeDate,
                    start: e.target.value,
                  })
                }
              ></Input>
              <Input
                type="date"
                onChange={(e) =>
                  setFirstRangeDate({ ...firstRangeDate, end: e.target.value })
                }
              ></Input>
            </div>
          </div>

          <Button onClick={() => handleGenerateFisrtReport()}>
            Descargar formato
          </Button>
        </div>
        {/* ===================================================== */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-4">
            <Label>Formato control de asistencia</Label>
            <div className="flex flex-col gap-4 justify-between">
              <Input
                type="date"
                onChange={(e) => setDateTwo(e.target.value)}
              ></Input>
            </div>
          </div>

          <Button onClick={handleGenerateReportNewWeek}>
            Descargar formato básico
          </Button>
        </div>
        {/*  */}
      </div>

      <Dialog open={loading} onOpenChange={() => setLoading(false)}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Generando reporte</DialogTitle>
            <DialogDescription className="mt-2"></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            Generando reporte, espere...
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewFormExport;
