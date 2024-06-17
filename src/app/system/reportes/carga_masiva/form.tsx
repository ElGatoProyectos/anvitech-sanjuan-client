"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { post, postImage } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

function FormReportMassive() {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function handleRegistrarDataMassive(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      await postImage("reports/upload", formData, session.data);
      setLoading(false);

      useToastDefault("Ok", "Registros realizado con exito");
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el archivo excel");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-lg font-semibold">Registrar reportes masivos</h1>
      </div>
      <form
        onSubmit={handleRegistrarDataMassive}
        className="flex flex-col gap-8"
      >
        <div>
          Recuerde que el archivo debe tener un formato único, los reportes que
          no tengan el formato anulara toda la carga.
          <Link
            target="_blank"
            download
            as="/files/formato_reporte_carga_masiva.xlsx"
            href="/files/formato_reporte_carga_masiva.xlsx"
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
            Registrar trabajador
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormReportMassive;
