"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function TableCoordinators() {
  const { setUpdatedAction, updatedAction } = useUpdatedStore();
  const [data, setData] = useState<any[]>([]);

  const session = useSession();

  async function fetchData() {
    try {
      const response = await get("workers/coordinators", session.data);
      setData(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la informacion");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchData();
    }
  }, [session.status, updatedAction]);

  return (
    <div className="md:col-span-2 col-span-1">
      <table className="w-full table-auto text-sm text-left ">
        <thead className="text-gray-600 font-medium border-b">
          <tr>
            <th className="py-3 pr-6">Nombres</th>
            <th className="py-3 pr-6">Eliminar</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 ">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.full_name}</td>{" "}
              <td>
                <Trash2 />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableCoordinators;
