"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get } from "@/app/http/api.http";
import { Dialog } from "@/components/ui/dialog";
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
import { ChangeEvent, useEffect, useState } from "react";

function TableReports() {
  const session = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [reportsFiltered, setReportsFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = reportsFiltered.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function fetchDataReports() {
    try {
      setLoading(true);
      const response = await get("reports", session.data);
      setReports(response.data);
      setReportsFiltered(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer los datos");
    }
  }

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setReportsFiltered(reports);
    } else {
      const filtered = reports.filter((item) => item.name.includes(value));
      setReportsFiltered(filtered);
    }
    setCurrentPage(1);
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
          <Input
            placeholder="Buscar por reporte"
            onChange={handleChangeInput}
          ></Input>
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
              {loading || session.status !== "authenticated" ? (
                <tr>
                  <td>Cargando...</td>
                </tr>
              ) : (
                currentReports.map((item, idx) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  );
}

export default TableReports;
