"use client";

import { useUpdatedStore } from "@/app/store/zustand";

function TableManagements() {
  const { setUpdatedAction, updatedAction } = useUpdatedStore();
  return (
    <div className="md:col-span-2 col-span-1">
      <table className="w-full table-auto text-sm text-left ">
        <thead className="text-gray-600 font-medium border-b">
          <tr>
            <th className="py-3 pr-6">Descripcion</th>
            <th className="py-3 pr-6">Fecha</th>
            <th className="py-3 pr-6">Eliminar</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 "></tbody>
      </table>
    </div>
  );
}

export default TableManagements;
