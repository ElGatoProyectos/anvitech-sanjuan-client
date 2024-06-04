"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get } from "@/app/http/api.http";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

function TableReports() {
  const [reports, setReports] = useState<any[]>([]);

  const session = useSession();

  async function fetchDataReports() {
    try {
      const response = await get("reports", session.data);
      setReports(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer los datos");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataReports();
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
                <th className="py-3 pr-6">Reporte</th>
                <th className="py-3 pr-6">Fecha</th>
                <th className="py-3 pr-6">Estado</th>

                <th className="py-3 pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {reports.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.date_created}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-2 rounded-full font-semibold text-xs ${
                        item.state === "default"
                          ? "text-green-600 bg-green-50"
                          : "text-blue-600 bg-blue-50"
                      }`}
                    >
                      {item.state}
                    </span>
                  </td>

                  <td className="text-right whitespace-nowrap">
                    <Link
                      href={"/system/reportes/" + item.id}
                      className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg"
                    >
                      Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  );
}

export default TableReports;
