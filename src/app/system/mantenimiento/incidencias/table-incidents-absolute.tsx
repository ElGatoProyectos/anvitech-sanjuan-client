"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { deleteId, get, putId } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function TableIncidentsAbsolute() {
  const session = useSession();

  const { setUpdatedAction, updatedAction } = useUpdatedStore();

  const [incidents, setIncidents] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  async function handleDeleteIncidentAbsolute(id: number) {
    try {
      const response = await deleteId("incidents/absolute", id, session.data);
      setUpdatedAction();
      useToastDefault("Ok", "Incidente eliminado");
    } catch (error) {
      useToastDestructive("Error", "Error al eliminar incidente");
    }
  }

  async function fetchDataIncidents() {
    try {
      const response = await get("incidents/absolute", session.data);
      setIncidents(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al solicitar la informacion");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataIncidents();
    }
  }, [session.status, updatedAction]);

  return (
    <Dialog>
      <div className="md:col-span-2 col-span-1">
        <table className="w-full table-auto text-sm text-left ">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Descripcion</th>
              <th className="py-3 pr-6">Fecha</th>
              <th className="py-3 pr-6">Eliminar</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 ">
            {loading ? (
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
              </>
            ) : (
              incidents.map((item, idx) => (
                <tr key={idx} className=" w-full">
                  <td className="pr-6 py-4 whitespace-nowrap ">
                    {item.description}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap ">{item.date}</td>
                  <td className="pr-6 py-4 whitespace-nowrap ">
                    <Button>
                      <Trash2
                        onClick={() => handleDeleteIncidentAbsolute(item.id)}
                      />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Dialog>
  );
}

export default TableIncidentsAbsolute;
