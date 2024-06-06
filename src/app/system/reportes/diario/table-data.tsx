"use client";

import { get } from "@/app/http/api.http";
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
import { useEffect, useState } from "react";

function TableData() {
  const [workers, setWorkers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const session = useSession();

  async function fetchWorkers() {
    try {
      setLoading(true);

      const response = await get("reports/day", session.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {}
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchWorkers();
    }
  }, [session.status]);

  return (
    <div>
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
                      {item.full_name}
                    </td>

                    <td className=" whitespace-nowrap">
                      <Button variant="secondary">Detalle</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableData;
