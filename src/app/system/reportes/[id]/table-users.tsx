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
import { FormEvent, useEffect, useState } from "react";
import ModalDetailReport from "./modal-detail";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { get, getId } from "@/app/http/api.http";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

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

function TableUser({ id }: { id: string }) {
  // const [daySelected, setDaySelected] = useState("");

  // function handleSelectDay(e: string) {
  //   setDaySelected(e);
  // }

  /// define states
  const session = useSession();
  const [workers, setWorkers] = useState([]);
  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);

  async function fetchDetailReport() {
    try {
      setLoading(true);
      const response = await getId("reports", Number(id), session.data);
      setWorkers(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al capturar la información");
      setLoading(false);
    }
  }

  function handleSelectDetail(item: any) {
    setDetail(item);
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDetailReport();
    }
  }, [session.status]);

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
                <SelectItem value="Corregir">Corregir</SelectItem>
                <SelectItem value="Verificado">Verificado</SelectItem>
                <SelectItem value="Corregido">Corregido</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-2">
          <table className="w-full table-auto text-sm text-left ">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">DNI</th>
                <th className="py-3 pr-6">Nombres</th>
                <th className="py-3 pr-6">Sede</th>
                <th className="py-3 pr-6">Acción</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {loading || session.status !== "authenticated" ? (
                <>
                  <tr>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                  </tr>
                </>
              ) : (
                workers.map((item: any, idx) => (
                  <tr key={idx}>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      {item.nombre}
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.sede}</td>

                    <td className=" whitespace-nowrap">
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          onClick={() => handleSelectDetail(item)}
                        >
                          Detalle
                        </Button>
                      </DialogTrigger>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDetailReport detail={detail}></ModalDetailReport>
    </Dialog>
  );
}

export default TableUser;
