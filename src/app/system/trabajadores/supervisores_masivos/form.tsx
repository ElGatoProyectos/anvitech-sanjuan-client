"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { post, postImage } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

function FormRegisterSupervisorMassive() {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function handleRegistrarDataMassive(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      await postImage("workers/supervisor/file", formData, session.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el archivo excel");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-lg font-semibold">
          Registrar supervisores masivos
        </h1>
      </div>

      {session.data?.user.role === "admin" && (
        <form
          onSubmit={handleRegistrarDataMassive}
          className="flex flex-col gap-8"
        >
          <div>
            👉
            <Link
              target="_blank"
              download
              as="/files/formato_supervisores_carga_masiva.xlsx"
              href="/files/formato_supervisores_carga_masiva.xlsx"
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
      )}
    </div>
  );
}

export default FormRegisterSupervisorMassive;
