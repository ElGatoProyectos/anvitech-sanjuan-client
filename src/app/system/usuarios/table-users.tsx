"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { get, putId } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUpdatedStore } from "@/app/store/zustand";

function TableUser() {
  const { updatedAction, setUpdatedAction } = useUpdatedStore();

  const [users, setUsers] = useState<any[]>([]);

  const session = useSession();

  const [userSelected, setUserSelected] = useState({
    full_name: "",
    dni: "",
    email: "",
    phone: "",
    role: "",
    enabled: true,
  });

  const [idSelected, setIdSelected] = useState(0);

  function handleSelectUser(user: any) {
    setIdSelected(user.id);

    setUserSelected({
      ...userSelected,
      full_name: user.full_name,
      email: user.email,
      dni: user.dni,
      enabled: user.enabled,
      role: user.role,
      phone: user.phone,
    });
  }

  async function fetchDataUsers() {
    try {
      const response = await get("users", session.data);
      setUsers(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al traer la informacion");
    }
  }

  async function handleUpdate() {
    try {
      if (session.status === "authenticated") {
        console.log(session);
        console.log(userSelected);
        await putId("users", userSelected, idSelected, session.data);
        useToastDefault("Ok", "Modificación realizada con exito");
        setUpdatedAction();
      }
    } catch (error) {
      useToastDestructive("Error", "Error procesar la informacion");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataUsers();
    }
  }, [session.status, updatedAction]);

  return (
    <>
      <Dialog>
        <table className="w-full table-auto text-sm text-left">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Nombre</th>
              <th className="py-3 pr-6">DNI</th>
              <th className="py-3 pr-6">Rol</th>

              <th className="py-3 pr-6">Estado</th>

              <th className="py-3 pr-6">Usuario</th>
              <th className="py-3 pr-6">Correo</th>

              <th className="py-3 pr-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {users.map((item, idx) => (
              <tr key={idx}>
                <td className="pr-6 py-4 whitespace-nowrap">
                  {item.full_name}
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.role}</td>

                <td className="pr-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-xs ${
                      item.enabled
                        ? "text-green-600 bg-green-50"
                        : "text-red-600 bg-gray-200"
                    }`}
                  >
                    {item.enabled ? "HABILITADO" : "DESHABILITADO"}
                  </span>
                </td>

                <td className="pr-6 py-4 whitespace-nowrap font-semibold">
                  {item.username}
                </td>
                <td className="pr-6 py-4 whitespace-nowrap font-semibold">
                  {item.email}
                </td>
                <td className="text-left whitespace-nowrap">
                  {session.data?.user.role === "admin" &&
                  item.role !== "admin" ? (
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleSelectUser(item)}
                        variant={"outline"}
                      >
                        Configurar
                      </Button>
                    </DialogTrigger>
                  ) : session.data?.user.role === "admin" &&
                    item.role === "admin" &&
                    session.data?.user.username === item.username ? (
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleSelectUser(item)}
                        variant={"outline"}
                      >
                        Configurar
                      </Button>
                    </DialogTrigger>
                  ) : session.data?.user.role === "superadmin" ? (
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleSelectUser(item)}
                        variant={"outline"}
                      >
                        Configurar
                      </Button>
                    </DialogTrigger>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="gap-2">
              <Label>Nombres completos</Label>
              <Input
                onChange={(e) =>
                  setUserSelected({
                    ...userSelected,
                    full_name: e.target.value,
                  })
                }
                type="text"
                defaultValue={userSelected.full_name}
                required
              />
            </div>
            <div className="gap-2">
              <Label>DNI</Label>
              <Input
                onChange={(e) =>
                  setUserSelected({ ...userSelected, dni: e.target.value })
                }
                type="text"
                defaultValue={userSelected.dni}
                required
              />
            </div>
            <div className="gap-2">
              <Label>Email</Label>
              <Input
                onChange={(e) =>
                  setUserSelected({ ...userSelected, email: e.target.value })
                }
                defaultValue={userSelected.email}
                type="email"
              />
            </div>

            <div className="gap-2">
              <Label>Celular</Label>
              <Input
                onChange={(e) =>
                  setUserSelected({ ...userSelected, phone: e.target.value })
                }
                defaultValue={userSelected.phone}
                type="text"
              />
            </div>

            <div className="gap-2">
              <Label>Seleccione un rol</Label>
              <Select
                defaultValue={userSelected.role}
                onValueChange={(value) =>
                  setUserSelected({ ...userSelected, role: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="gap-2">
              <Label>Estado</Label>
              <Select
                defaultValue={userSelected.enabled ? "1" : "0"}
                onValueChange={(value) =>
                  setUserSelected({
                    ...userSelected,
                    enabled: value === "1",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    defaultValue={userSelected.enabled ? "1" : "0"}
                    placeholder={
                      userSelected.enabled ? "Habilitado" : "Deshabilitado"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectItem value="1">Habilitado</SelectItem>
                    <SelectItem value="0">Deshabilitado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button onClick={handleUpdate} type="submit">
                Modificar ahora
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TableUser;
