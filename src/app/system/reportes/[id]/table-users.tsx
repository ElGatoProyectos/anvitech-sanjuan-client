"use client";

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
import { Label } from "@/components/ui/label";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ModalDetailReport from "./modal-detail";
import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import { get, getId } from "@/app/http/api.http";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

/// esto debería iterar todos los trabajadores
function TableUser({ id }: { id: string }) {
  /// define states
  const session = useSession();
  const [workers, setWorkers] = useState([]);
  const [worker, setWorker] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [workersFiltered, setWorkersFiltered] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(10);

  // Get current workers
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = workersFiltered.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function fetchDetailReport() {
    try {
      setLoading(true);
      const response = await getId("reports", Number(id), session.data);
      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al capturar la información");
      setLoading(false);
    }
  }

  async function fetchWorkers() {
    try {
      setLoading(true);
      const response = await get("workers", session.data);
      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al capturar la información");
      setLoading(false);
    }
  }

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setWorkersFiltered(workers);
    } else {
      const filtered = workers.filter((item: any) => item.dni.includes(value));
      setWorkersFiltered(filtered);
    }
    setCurrentPage(1);
  }

  function handleSelectDetail(item: any) {
    setWorker(item);
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchWorkers();
    }
  }, [session.status]);

  const [isClosing, setIsClosing] = useState(false);

  return (
    <Dialog
      onOpenChange={() => {
        setIsClosing(!isClosing);
      }}
    >
      <div className=" flex flex-col">
        <div className="flex p-2 gap-4">
          <Input
            placeholder="Buscar por DNI"
            onChange={handleChangeInput}
          ></Input>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Seleccione uno</SelectLabel>
                <SelectItem value="Corregir">Corregir</SelectItem>
                <SelectItem value="Verificado">Verificado</SelectItem>
                <SelectItem value="Corregido">Corregido</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-2">
          <table className="w-full table-auto text-sm text-left ">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">DNI</th>
                <th className="py-3 pr-6">Departamento</th>
                <th className="py-3 pr-6">Nombres</th>

                <th className="py-3 pr-6">Acción</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y text-xs">
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
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-8" />
                    </td>
                  </tr>
                </>
              ) : (
                currentWorkers.map((item: any, idx) => (
                  <tr key={idx}>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      {item.department}
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      {item.full_name}
                    </td>

                    <td className=" whitespace-nowrap">
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size={"sm"}
                          onClick={() => handleSelectDetail(item)}
                        >
                          Detalle
                        </Button>
                      </DialogTrigger>
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

      {worker && (
        <ModalDetailReport
          worker={worker}
          reportId={id}
          isClosing={isClosing}
        ></ModalDetailReport>
      )}
    </Dialog>
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

  for (let i = 1; i <= Math.ceil(totalWorkers / workersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="w-full flex justify-end">
      <ul className="pagination flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item mx-1 ${
              number === currentPage ? "font-bold" : ""
            }`}
          >
            <button
              onClick={() => paginate(number)}
              className="page-link px-2 py-1 border rounded cursor-pointer"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableUser;
