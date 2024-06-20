"use client";

import { get, post } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, CheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { exportNormal, exportStartSoft } from "./export";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  {
    name: "Enero",
    number: "1",
  },
  {
    name: "Febrero",
    number: "2",
  },
  {
    name: "Marzo",
    number: "3",
  },
  {
    name: "Abril",
    number: "4",
  },
  {
    name: "Mayo",
    number: "5",
  },
  {
    name: "Junio",
    number: "6",
  },
  {
    name: "Julio",
    number: "7",
  },
  {
    name: "Agosto",
    number: "8",
  },
  {
    name: "Setiembre",
    number: "9",
  },
  {
    name: "Octubre",
    number: "10",
  },
  {
    name: "Noviembre",
    number: "11",
  },
  {
    name: "Diciembre",
    number: "12",
  },
];

function FormOptions() {
  const session = useSession();
  const [dataReports, setDataReports] = useState<any[]>([]);
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);

  const [dateLimits, setdateLimits] = useState({
    min: "",
    max: "",
  });

  async function handleGenerateReportStarSoft() {
    try {
      setOpenFirst(true);
      if (monthSelected !== "") {
        const response = await post(
          "reports/export/starsoft",
          { month: monthSelected },
          session.data
        );

        const newYear = new Date().getFullYear();
        const month = parseInt(monthSelected, 10) - 1; // Restar 1 porque los meses en JavaScript son de 0 a 11

        // Fecha de inicio del mes
        const startOfMonth = new Date(newYear, month, 1);

        // Fecha final del mes
        const endOfMonth = new Date(newYear, month + 1, 0);

        exportStartSoft(response.data, startOfMonth, endOfMonth);
        setOpenFirst(false);

        useToastDefault("Ok", "Reporte generado con exito");
      }
      setOpenFirst(false);
    } catch (error) {
      setOpenFirst(false);

      useToastDestructive("Error", "Error al generar excel");
    }
  }

  async function handleGenerateReportNormal() {
    try {
      setOpenFirst(true);
      const response = await post("reports/export", dateLimits, session.data);

      exportNormal(response.data);
      setOpenFirst(false);

      useToastDefault("Ok", "Reporte generado con exito");
      setOpenFirst(false);
    } catch (error) {
      setOpenFirst(false);

      useToastDestructive("Error", "Error al generar excel");
    }
  }

  async function fetchReports() {
    try {
      const response = await get("reports", session.data);
      setDataReports(response.data);
    } catch (error) {}
  }

  const [open, setOpen] = useState(false);
  const [monthSelected, setMonthSelected] = useState("");

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchReports();
    }
  }, [session.status]);

  return (
    <>
      <div className="flex flex-row gap-16">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-4">
            <Label>Mes a reportar</Label>
            <Select onValueChange={(e) => setMonthSelected(e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {months.map((item, index) => (
                    <SelectItem value={item.number} key={index}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => handleGenerateReportStarSoft()}>
            Descargar formato STARSOFT
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-4">
            <Label>Fecha inicio</Label>
            <Input
              type="date"
              onChange={(e) =>
                setdateLimits({ ...dateLimits, min: e.target.value })
              }
            ></Input>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Label>Fecha fin</Label>
            <Input
              type="date"
              onChange={(e) =>
                setdateLimits({ ...dateLimits, max: e.target.value })
              }
            ></Input>
          </div>
          <Button onClick={() => handleGenerateReportNormal()}>
            Descargar formato NORMAL
          </Button>
        </div>
      </div>

      <Dialog open={openFirst} onOpenChange={() => setOpenFirst(!openFirst)}>
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

      <Dialog open={openSecond} onOpenChange={() => setOpenSecond(!openSecond)}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Reporte normal</DialogTitle>
            <DialogDescription className="mt-2">
              El reporte normal, es un reporte en base a las coincidencias de
              los campos de la base de datos. Seleccione los dias a generar el
              reporte
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Label>Fecha inicio</Label>
            <Input type="date"></Input>
          </div>
          <DialogFooter className="mt-4">
            <Button
              disabled={loadingSecond}
              onClick={handleGenerateReportNormal}
              type="submit"
            >
              Crear reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FormOptions;

//  para poder filtrar por fechas debemos filtrar por reporte
//  el campo de registro tambien deberia ser datetime preferiblemente para pdoer fitlrar en base a un rango mas comodo de filtrar
