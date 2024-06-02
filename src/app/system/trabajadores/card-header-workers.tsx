"use client";

import { post, postImage } from "@/app/http/api.http";
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
import { ChangeEvent, FormEvent, useState } from "react";

function CardHeaderWorker() {
  /// define states
  const session = useSession();
  const [isUnitaryModalOpen, setUnitaryModalOpen] = useState(false);
  const [isMassiveModalOpen, setMassiveModalOpen] = useState(false);
  const [file, setFile] = useState<any>();
  const [password, setPassword] = useState("");
  const [dataWorker, setDataWorker] = useState({
    full_name: "",
    dni: "",
    department: "",
    position: "",
    phone: "",
    hire_date: "",
  });

  /// define functions
  async function handleRegistrarDataMassive() {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      await postImage("workers/file", formData, session.data);
      setPassword("");
    } catch (error) {}
  }

  async function handleRegistrerData() {
    try {
      setPassword("");
    } catch (error) {}
  }

  console.log(file);

  return (
    <>
      <div className="items-start justify-between flex ">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-lg font-semibold">
            Reportes Generales
          </h3>
        </div>
        <div className="flex mt-3 md:mt-0 gap-4">
          <Button
            onClick={() => setUnitaryModalOpen(true)}
            className=" flex gap-2"
          >
            <span>Registro unitario</span>
            <UserPlus size={20} />
          </Button>

          <Button
            onClick={() => setMassiveModalOpen(true)}
            className=" flex gap-2"
          >
            <span>Registro masivo</span>
            <Sheet size={20} />
          </Button>
        </div>
      </div>

      <Dialog open={isUnitaryModalOpen} onOpenChange={setUnitaryModalOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Generar reporte unitario</DialogTitle>
            <DialogDescription className="mt-2">
              Recuerde que la generacion de reporte es semanal, se recomienda
              hacerlo los viernes o sabados
            </DialogDescription>
          </DialogHeader>
          <div className="w-full grid grid-cols-2 mt-4 gap-4">
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Nombres completos</Label>
              <Input
                type="text"
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, full_name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2  col-span-1">
              <Label>DNI</Label>
              <Input
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, dni: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2  col-span-1">
              <Label>Celular</Label>
              <Input
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, phone: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Departamento</Label>
              <Input
                type="text"
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, department: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Posicion</Label>
              <Input
                type="text"
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, position: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2  col-span-2">
              <Label>Fecha de inscripcion</Label>
              <Input
                type="date"
                onChange={(e) =>
                  setDataWorker({ ...dataWorker, hire_date: e.target.value })
                }
              />
            </div>
            <hr className="col-span-2" />
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Contrasena administrador</Label>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="submit">Generar reporte</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMassiveModalOpen} onOpenChange={setMassiveModalOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Generar reporte masivo</DialogTitle>
            <DialogDescription className="mt-2">
              Recuerde que el archivo debe tener un formato unico, los usuarios
              que ya existan no se registraran.{" "}
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
          <div className="flex flex-col gap-2 mt-4">
            <Label>Contrasena</Label>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="************"
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button onClick={handleRegistrarDataMassive}>
                Generar reporte
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CardHeaderWorker;
