"use client";

import { useToastDestructive } from "@/app/hooks/toast.hook";
import { get, post, postExcel } from "@/app/http/api.http";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon, FileSpreadsheet, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import { format } from "date-fns";
import { headers } from "next/headers";

function TableData() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [workersFiltered, setWorkersFiltered] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(20);

  const [date, setDate] = useState<any>();

  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = workersFiltered.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function fetchWorkers() {
    try {
      setLoading(true);

      const response = await get("reports/day", session.data);
      console.log(response.data);
      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {}
  }

  async function fetDepartments() {
    try {
      const response = await get("workers/departments", session.data);
      setDepartments(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al solicitar los departamentos");
    }
  }

  function handleSelectDepartment(value: string) {
    if (value === "all") {
      setWorkersFiltered(workers);
    } else {
      const filtered = workers.filter((item) => item.sede === value);
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

  async function handleChangeDay() {
    try {
      let x = new Date(date);
      const day = x.getDate();
      const month = x.getMonth() + 1;
      const year = x.getFullYear();

      setLoading(true);

      const response = await post(
        "reports/day",
        { day, month, year },
        session.data
      );
      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Error al solicitar los datos");
    }
  }

  async function exportToExcel() {
    try {
      const response = (await postExcel(
        "reports/export",
        workers,
        session.data
      )) as any;
      const blob = new Blob([response.content], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.log(error);
      useToastDestructive("Error", "Error al crear el archivo");
    }
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchWorkers();
      fetDepartments();
    }
  }, [session.status]);

  return (
    <div>
      {loading || session.status !== "authenticated" ? (
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
            Generando reporte diario, no cambie de pagina o se cancelara el
            proceso
          </span>
        </div>
      ) : (
        <div className=" flex flex-col ">
          <div className="grid grid-cols-3  gap-8  ">
            <div className="flex gap-4 p-2 border rounded-lg">
              <Input
                placeholder="Buscar por DNI"
                onChange={handleChangeInput}
              ></Input>
              <Select onValueChange={(e) => handleSelectDepartment(e)}>
                <SelectTrigger className="min-w-[50%]">
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
            </div>
            <div className="flex gap-4 p-2 border rounded-lg">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] justify-start text-left font-normal ${
                        !date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="mt-0" onClick={handleChangeDay}>
                Aplicar fecha
              </Button>
            </div>

            <div className="flex justify-end gap-4 p-2 border rounded-lg">
              <Button onClick={exportToExcel}>
                Exportar reporte <FileSpreadsheet className="ml-2" size={20} />
              </Button>
            </div>
          </div>
          <div className="p-2">
            <table className="w-full table-auto text-xs text-left ">
              <thead className="text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 pr-6">DNI</th>
                  <th className="py-3 pr-6">Nombres</th>
                  <th className="py-3 pr-6">Departamento</th>
                  <th className="py-3 pr-6">Fecha</th>
                  <th className="py-3 pr-6">Hora inicio</th>
                  <th className="py-3 pr-6">Inicio refrigerio</th>
                  <th className="py-3 pr-6">Fin refrigerio</th>
                  <th className="py-3 pr-6">Hora salida</th>
                  <th className="py-3 pr-6">Tardanza</th>
                  <th className="py-3 pr-6">Falta</th>

                  <th className="py-3 pr-6">Acción</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {currentWorkers.map((item: any, idx) => (
                  <tr key={idx}>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      {item.nombre}
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.sede}</td>
                    <th className="py-3 pr-6">{item.fecha_reporte}</th>
                    <th className="py-3 pr-6" align="center">
                      {item.hora_inicio}
                    </th>
                    <th className="py-3 pr-6" align="center">
                      {item.hora_inicio_refrigerio}
                    </th>
                    <th className="py-3 pr-6" align="center">
                      {item.hora_fin_refrigerio}
                    </th>
                    <th className="py-3 pr-6" align="center">
                      {item.hora_salida}
                    </th>
                    <th className="py-3 pr-6" align="center">
                      {item.tardanza}
                    </th>
                    <th className="py-3 pr-6" align="center">
                      {item.falta}
                    </th>

                    <td className=" whitespace-nowrap">
                      <Button
                        variant="secondary"
                        onClick={() => setOpenModal(true)}
                      >
                        <Settings size={20} />
                      </Button>
                    </td>
                  </tr>
                ))}
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
      )}

      <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Aviso de sistema</DialogTitle>
          </DialogHeader>
          {/* Contenido personalizado del modal */}
          <div className="overflow-y-hidden">
            <span>
              Esta opcion no esta permitida, por favor visite la seccion{" "}
              <Link
                className="underline text-blue-500"
                href={"/system/reportes/semanal"}
              >
                reportes semanales
              </Link>{" "}
              para poder modificar un dia en especifico
            </span>
          </div>
        </DialogContent>
      </Dialog>
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

export default TableData;
