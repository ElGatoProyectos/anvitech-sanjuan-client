"use client";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { toast } from "@/components/ui/use-toast";
import { get, post } from "@/app/http/api.http";
import { useSession } from "next-auth/react";

function CardHeaderReport() {
  // define states
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");

  // define functions

  async function handleGenerateReport() {
    try {
      setTimeout(() => {
        setLoading(true);
      }, 1000);
      // await post(
      //   "reports",
      //   { username: session.data?.user.username, password },
      //   session.data
      // );

      setTimeout(() => {
        setLoading(false);
      }, 10000);
    } catch (error) {
      useToastDestructive("Error", "Error al ejecutar la accion");
    }
  }
  return (
    <>
      <Dialog>
        <div className="items-start justify-between flex ">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-lg font-semibold">
              Reportes generados
            </h3>
          </div>
          <div className="mt-3 md:mt-0">
            <DialogTrigger asChild>
              <Button className=" ">Generar reporte semanal</Button>
            </DialogTrigger>
          </div>
        </div>

        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Generare reporte</DialogTitle>
            <DialogDescription className="mt-2">
              Recuerde que la generacion de reporte es semanal, se recomienda
              hacerlo los viernes o sabados
            </DialogDescription>
          </DialogHeader>

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
              <Button onClick={handleGenerateReport} type="submit">
                Generar reporte
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={loading}>
        <DialogContent
          className="sm:max-w-xl"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Modificar registros</DialogTitle>
            <DialogDescription>
              Recuerde que esta modificación afectará directamente a la base de
              datos
            </DialogDescription>
          </DialogHeader>
          {/* Contenido personalizado del modal */}
          <div className="overflow-y-hidden">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>

            <span>
              Generando reporte, este proceso se demora, no cierres ni canceles
              el proceso
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CardHeaderReport;
