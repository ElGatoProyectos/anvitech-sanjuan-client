"use client";

import { createUserSchema } from "@/app/form-schemas/create-user.schema";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { post } from "@/app/http/api.http";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

function Form() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      setLoading(true);
      createUserSchema.parse(data);
      if (session.status === "authenticated") {
        await post("users", data, session.data);
        useToastDefault("Ok", "Registro realizado con éxito");
      }

      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al procesar el formulario");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-lg font-semibold">Registrar usuario</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="gap-2">
          <Label>Nombres completos</Label>
          <Input
            onChange={(e) => setData({ ...data, full_name: e.target.value })}
            type="text"
            required
          />
        </div>
        <div className="gap-2">
          <Label>DNI</Label>
          <Input
            onChange={(e) => setData({ ...data, dni: e.target.value })}
            type="text"
            required
          />
        </div>
        <div className="gap-2">
          <Label>Email</Label>
          <Input
            onChange={(e) => setData({ ...data, email: e.target.value })}
            type="email"
          />
        </div>
      </form>
    </div>
  );
}
export default Form;
