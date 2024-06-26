"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get, putId } from "@/app/http/api.http";
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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalBody, ModalContent, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function TableIncidents() {
  const session = useSession();

  const { setUpdatedAction, updatedAction } = useUpdatedStore();

  const [terminations, setTerminations] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [terminationSelected, setTerminationSelected] = useState({
    title: "",
  });

  const [terminationId, setTerminationId] = useState(0);

  function handleIncidentSelected(data: any) {
    setTerminationSelected({
      ...terminationSelected,
      title: data.title,
    });
    setTerminationId(data.id);
  }

  async function handleUpdateTermination() {
    try {
      setLoading(true);

      if (
        session.data?.user.role === "admin" ||
        session.data?.user.role === "superadmin"
      ) {
        await putId(
          "terminations",
          terminationSelected,
          terminationId,
          session.data
        );
        setUpdatedAction();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Error al modificar");
    }
  }
  async function fetchDataTerminations() {
    try {
      const response = await get("terminations", session.data);
      setTerminations(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Error al solicitar la informacion");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataTerminations();
    }
  }, [session.status, updatedAction]);

  return (
    <Dialog>
      <div className="md:col-span-2 col-span-1">
        <table className="w-full table-auto text-sm text-left ">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Titulo</th>
              <th className="py-3 pr-6">Detalle</th>
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
                </tr>
                <tr>
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
                </tr>
              </>
            ) : (
              terminations.map((item, idx) => (
                <tr key={idx} className=" w-full">
                  <td className="pr-6 py-4 whitespace-nowrap ">{item.title}</td>
                  <td className="pr-6 py-4 whitespace-nowrap ">
                    <DialogTrigger asChild>
                      {session.data?.user.role !== "user" && (
                        <Button
                          size={"sm"}
                          onClick={() => handleIncidentSelected(item)}
                        >
                          Detalle
                        </Button>
                      )}
                    </DialogTrigger>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Modal isOpen={loading || session.status !== "authenticated"}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex justify-start py-8">
                  Cargando , espere un momento
                  <Spinner />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificar motivo</DialogTitle>
          <DialogDescription>
            Recuerde que esta modificacion no altera los registros pasados
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Descripcion</Label>
            <Textarea
              defaultValue={terminationSelected.title}
              className="w-full"
              onChange={(e) =>
                setTerminationSelected({
                  ...terminationSelected,
                  title: e.target.value,
                })
              }
            ></Textarea>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateTermination}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TableIncidents;
