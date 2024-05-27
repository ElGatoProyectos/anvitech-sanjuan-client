"use client";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const users = [
  {
    id: 1,
    fullName: "Usuario 1",
    reporte: "Reporte 1",
  },
  {
    id: 2,
    fullName: "Usuario 2",
    reporte: "Reporte 1",
  },
  {
    id: 3,
    fullName: "Usuario 3",
    reporte: "Reporte 1",
  },
  {
    id: 4,
    fullName: "Usuario 4",
    reporte: "Reporte 1",
  },
  {
    id: 5,
    fullName: "Usuario 5",
    reporte: "Reporte 1",
  },
  {
    id: 6,
    fullName: "Usuario 6",
    reporte: "Reporte 1",
  },
  {
    id: 7,
    fullName: "Usuario 7",
    reporte: "Reporte 1",
  },
  {
    id: 8,
    fullName: "Usuario 8",
    reporte: "Reporte 1",
  },
  {
    id: 9,
    fullName: "Usuario 9",
    reporte: "Reporte 1",
  },
  {
    id: 10,
    fullName: "Usuario 10",
    reporte: "Reporte 1",
  },
];

function TableUser() {
  return (
    <div className=" flex flex-col">
      <div className="flex p-2 gap-4">
        <Input></Input>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Seleccione uno</SelectLabel>
              <SelectItem value="apple">Corregir</SelectItem>
              <SelectItem value="banana">Verificado</SelectItem>
              <SelectItem value="blueberry">Corregido</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="p-2">
        <table className="w-full table-auto text-sm text-left ">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Nombres</th>
              <th className="py-3 pr-6">Reporte</th>
              <th className="py-3 pr-6">Estado</th>

              <th className="py-3 pr-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {users.map((item, idx) => (
              <tr key={idx}>
                <td className="pr-6 py-4 whitespace-nowrap">{item.fullName}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.reporte}</td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-xs ${
                      item.id % 2 === 0
                        ? "text-green-600 bg-green-50"
                        : "text-blue-600 bg-blue-50"
                    }`}
                  >
                    {item.id % 2 === 0 ? "Verificado" : "Corregir"}
                  </span>
                </td>

                <td className="text-right whitespace-nowrap">
                  <a className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg">
                    Detalle
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableUser;
