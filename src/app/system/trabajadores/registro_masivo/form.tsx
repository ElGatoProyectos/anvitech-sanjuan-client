"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { post, postImage } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalContent, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

function FormRegisterWorkersMassive() {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function handleRegistrarDataMassive(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      await postImage("workers/file", formData, session.data);
      useToastDefault("Ok", "Carga realizada con exito");
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el archivo excel");
      setLoading(false);
    }
  }

  return (
    <div className=" bg-white rounded-lg  p-8">
      <div className="mb-8">
        <h1 className="text-lg font-semibold">
          Registrar trabajadores masivos
        </h1>
      </div>

      {session.data?.user.role === "admin" ||
        (session.data?.user.role === "superadmin" && (
          <form
            onSubmit={handleRegistrarDataMassive}
            className="flex flex-col gap-8"
          >
            <div>
              👉
              <Link
                target="_blank"
                download
                as="/files/formato_trabajadores_carga_masiva.xlsx"
                href="/files/formato_trabajadores_carga_masiva.xlsx"
                className="underline text-blue-600"
              >
                Descargar formato
              </Link>
            </div>
            <div className="flex flex-col gap-2  col-span-2">
              <Label>Archivo</Label>
              <Input
                type="file"
                accept=".xlsx"
                onChange={(e: any) => setFile(e.target.files[0])}
              />
            </div>

            <div className="flex flex-col gap-2  col-span-2">
              <Button disabled={loading} type="submit">
                Registrar masivamente
              </Button>
            </div>
          </form>
        ))}

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
  );
}

export default FormRegisterWorkersMassive;
