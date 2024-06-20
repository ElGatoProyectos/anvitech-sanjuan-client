"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get, post, postImage } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Sheet, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { exportAllWorkers } from "./export";

function CardHeaderWorker() {
  /// define states
  const { setUpdatedAction } = useUpdatedStore();

  const [loading, setLoading] = useState(false);
  const session = useSession();
  const [isUnitaryModalOpen, setUnitaryModalOpen] = useState(false);
  const [isMassiveModalOpen, setMassiveModalOpen] = useState(false);
  const [file, setFile] = useState<any>();
  const [dataWorker, setDataWorker] = useState({
    full_name: "",
    dni: "",
    department: "",
    position: "",
    hire_date: "",
  });

  /// define functions

  async function exportDataGeneral() {
    try {
      setLoading(true);
      const response = await get("workers", session.data);
      exportAllWorkers(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al generar el excel");
    }
  }
  return (
    <>
      <div className="items-start justify-between flex ">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-lg font-semibold">
            Lista de trabajadores
          </h3>
        </div>
        <div className="flex mt-3 md:mt-0 gap-4">
          <Button className=" flex gap-2" onClick={exportDataGeneral}>
            <span>Exportar datos de trabajadores</span>
            <Sheet size={20} />
          </Button>

          {/* <Button
            onClick={() => setMassiveModalOpen(true)}
            className=" flex gap-2"
          >
            <span>Registro masivo</span>
            <Sheet size={20} />
          </Button> */}
        </div>
      </div>

      {/* <Dialog open={isUnitaryModalOpen} onOpenChange={setUnitaryModalOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Generar reporte unitario</DialogTitle>
            <DialogDescription className="mt-2">
              Recuerde que la generación de reporte es semanal, se recomienda
              hacerlo los viernes o sábados
            </DialogDescription>
          </DialogHeader>
          <div className="w-full grid grid-cols-2 mt-4 gap-4">
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Nombres completos</Label>
              <Input
                type="text"
                onChange={(e) =>
                  setDataWorker({
                    ...dataWorker,
                    full_name: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2  col-span-2">
              <Label>DNI</Label>
              <Input
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, dni: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2  col-span-2">
              <Label>Departamento</Label>
              <Input
                type="text"
                onChange={(e) =>
                  setDataWorker({
                    ...dataWorker,
                    department: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Posición</Label>
              <Input
                type="text"
                onChange={(e) =>
                  setDataWorker({
                    ...dataWorker,
                    position: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2  col-span-2">
              <Label>Fecha de contratación</Label>
              <Input
                type="date"
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, hire_date: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button disabled={loading} onClick={handleRegisterData}>
                Registrar trabajador
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMassiveModalOpen} onOpenChange={setMassiveModalOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Generar reporte masivo</DialogTitle>
            <DialogDescription className="mt-2">
              Recuerde que el archivo debe tener un formato único, los usuarios
              que ya existan lanzaran un error.
              <Link
                download={"formato_datos"}
                href={"/files/modelo.xlsx"}
                className="underline text-blue-600"
              >
                Descargar formato
              </Link>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Label>Archivo</Label>
            <Input
              type="file"
              accept=".xlsx"
              onChange={(e: any) => setFile(e.target.files[0])}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button disabled={loading} onClick={handleRegistrarDataMassive}>
                Registrar trabajadores
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}

export default CardHeaderWorker;
