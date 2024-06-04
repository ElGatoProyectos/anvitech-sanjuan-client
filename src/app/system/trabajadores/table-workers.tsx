"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

function TableWorkers() {
  /// define states
  const [loading, setLoading] = useState(false);
  const { updatedAction } = useUpdatedStore();
  const [workers, setWorkers] = useState<any[]>([]);
  const session = useSession();

  /// define functions

  async function fetchDataWorkers() {
    try {
      setLoading(true);
      const response = await get("workers", session.data);
      setWorkers(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Hubo un error al traer la información");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataWorkers();
    }
  }, [session.status, updatedAction]);

  return (
    <div className=" flex flex-col mt-4">
      <div className="flex gap-4">
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
              <th className="py-3 pr-6">DNI</th>
              <th className="py-3 pr-6">Configuración</th>
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
                </tr>
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
                </tr>
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
                </tr>
              </>
            ) : (
              workers.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.full_name}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Link
                      className="bg-black rounded-md px-4 py-2 outline-none text-white "
                      href={`/system/trabajadores/` + item.id}
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
  );
}

export default TableWorkers;
