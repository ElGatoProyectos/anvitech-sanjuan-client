"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get } from "@/app/http/api.http";
import { useUpdatedStore } from "@/app/store/zustand";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

function TableWorkers() {
  /// define states
  const [loading, setLoading] = useState(false);
  const { updatedAction } = useUpdatedStore();
  const [workers, setWorkers] = useState<any[]>([]);
  const [workersFiltered, setWorkersFiltered] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const session = useSession();

  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(50);

  // Get current workers
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = workersFiltered.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  /// define functions

  async function fetchDataWorkers() {
    try {
      setLoading(true);
      const response = await get("workers", session.data);
      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Hubo un error al traer la información");
      setLoading(false);
    }
  }

  async function fetchDepartments() {
    try {
      const response = await get("workers/departments", session.data);
      console.log(response.data);
      setDepartments(response.data);
    } catch (error) {
      useToastDestructive("Error", "Hubo un error al traer la información");
    }
  }

  function handleSelectDepartment(value: string) {
    if (value === "all") {
      setWorkersFiltered(workers);
    } else {
      const filtered = workers.filter((item) => item.department === value);
      setWorkersFiltered(filtered);
    }
    setCurrentPage(1);
  }

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setWorkersFiltered(workers);
    } else {
      const filtered = workers.filter((item) => item.dni.includes(value));
      setWorkersFiltered(filtered);
    }
    setCurrentPage(1);
  }

  function handleChangeSelectEnbabled(value: string) {
    console.log(value);
    if (value === "1") {
      const filtered = workers.filter((item) => item.enabled === "si");
      setWorkersFiltered(filtered);
    } else if (value === "0") {
      const filtered = workers.filter((item) => item.enabled === "no");
      setWorkersFiltered(filtered);
    }
    setCurrentPage(1);
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchDataWorkers();
      fetchDepartments();
    }
  }, [session.status, updatedAction]);

  return (
    <div className=" w-full flex flex-col mt-4">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por DNI"
          onChange={handleChangeInput}
        ></Input>
        <Select onValueChange={(e) => handleSelectDepartment(e)}>
          <SelectTrigger className="w-[50%]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos</SelectItem>
              {session.status === "authenticated" || loading ? (
                departments.map((item, index) => (
                  <SelectItem value={item.department} key={index}>
                    {item.department}
                  </SelectItem>
                ))
              ) : (
                <SelectLabel>Cargando...</SelectLabel>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={handleChangeSelectEnbabled}>
          <SelectTrigger className="w-[50%]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">Habilitado</SelectItem>
              <SelectItem value="0">Deshabilitado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="p-2 overflow-y-scroll ]">
        <table className="w-full text-xs text-left ">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">DNI</th>
              <th className="py-3 pr-6">Departamento</th>
              <th className="py-3 pr-6">Nombres</th>
              <th className="py-3 pr-6">Tipo</th>
              <th className="py-3 pr-6">Estado</th>
              <th className="py-3 pr-6">Detalle</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {loading || session.status !== "authenticated" ? (
              <>
                <tr>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                </tr>
                <tr>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                </tr>
                <tr>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-8" />
                  </td>
                </tr>
              </>
            ) : (
              currentWorkers.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.department}
                  </td>

                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.full_name}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.type_contract}
                  </td>
                  <td> {item.enabled ? "HABILITADO" : "DESHABILITADO"}</td>

                  <td className="pr-6 py-4 whitespace-nowrap">
                    <Link
                      className="bg-black rounded-md  outline-none "
                      href={`/system/trabajadores/` + item.id}
                    >
                      <Settings size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          workersPerPage={workersPerPage}
          totalWorkers={workersFiltered.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

interface PaginationProps {
  workersPerPage: number;
  totalWorkers: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  workersPerPage,
  totalWorkers,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalWorkers / workersPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const pagesToShow = [];

    if (totalPages <= 6) {
      // Show all pages if the total is 6 or less
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      if (currentPage > 3) {
        pagesToShow.push(1, 2, 3, "...");
      } else {
        for (let i = 1; i <= 3; i++) {
          pagesToShow.push(i);
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        pagesToShow.push(currentPage);
      }

      if (currentPage < totalPages - 2) {
        pagesToShow.push("...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pagesToShow.push(i);
        }
      }
    }

    return pagesToShow.map((number, index) => (
      <li
        key={index}
        className={`page-item mx-1 ${
          number === currentPage ? "font-bold" : ""
        }`}
      >
        {number === "..." ? (
          <span className="page-link px-2 py-1">...</span>
        ) : (
          <button
            onClick={() => paginate(number as number)}
            className="page-link px-2 py-1 border rounded cursor-pointer"
          >
            {number}
          </button>
        )}
      </li>
    ));
  };

  return (
    <nav className="w-full flex justify-start">
      <ul className="pagination flex justify-center mt-4">
        <li className={`page-item mx-1 ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            className="page-link px-2 py-1 border rounded cursor-pointer"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
        </li>
        {renderPageNumbers()}
        <li
          className={`page-item mx-1 ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            className="page-link px-2 py-1 border rounded cursor-pointer"
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TableWorkers;
