"use client";

import { useToastDefault, useToastDestructive } from "@/app/hooks/toast.hook";
import {
  deleteId,
  get,
  getId,
  post,
  postExcel,
  putId,
} from "@/app/http/api.http";
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
import { CalendarIcon, FileSpreadsheet, Rss, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import { format } from "date-fns";
import { headers } from "next/headers";
import { downloadExcel } from "./export";
import { Label } from "@/components/ui/label";

function TableData() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workersFiltered, setWorkersFiltered] = useState<any[]>([]);

  const [dataDetail, setDataDetail] = useState<any>({});
  const [dataTemporalHours, setDataTemporalHours] = useState<any>({});

  const [incidents, setIncidents] = useState<any[]>([]);

  const [incidentSelected, setIncidentSelected] = useState<any>();

  const [incidentsDetail, setIncidentsDetail] = useState<any[]>([]);

  // =======================================loadings

  const [loadingUpdateHours, setLoadingUpdateHours] = useState(false);

  const [actionActive, setActionActive] = useState(false);

  // modals =======================
  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  // modals =======================

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

  async function fetchReport() {
    try {
      let x = new Date();
      const day = x.getDate() - 1;
      const month = x.getMonth() + 1;
      const year = x.getFullYear();

      console.log(day, month, year);

      const response = await post(
        "reports/day",
        { day, month, year },
        session.data
      );

      console.log(response.data);

      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {
      useToastDestructive("Error", "Error al traer el reporte");
    }
  }

  async function fetDepartments() {
    try {
      const response = await get("workers/departments", session.data);
      setDepartments(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al solicitar los departamentos");
    }
  }

  async function fetchIncidents() {
    try {
      const response = await get("incidents", session.data);

      setIncidents(response.data);
    } catch (error) {
      useToastDestructive("Error", "Error al crear el archivo");
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

      console.log(x);
      const day = x.getDate() + 1;
      const month = x.getMonth() + 1;
      const year = x.getFullYear();

      setLoading(true);

      const response = await post(
        "reports/day",
        { day, month, year },
        session.data
      );

      console.log(response.data);
      setWorkers(response.data);
      setWorkersFiltered(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Error al solicitar los datos");
    }
  }

  // sobre el modal de detalle ==============================================================================

  function handleOpenModalPrev(item: any) {
    function resetTime(date: Date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const dayRegister = resetTime(new Date(item.fecha_reporte));
    const dayActually = resetTime(new Date());

    setDataDetail(item);

    setDataTemporalHours({
      hora_inicio: item.hora_inicio,
      hora_inicio_refrigerio: item.hora_inicio_refrigerio,
      hora_fin_refrigerio: item.hora_fin_refrigerio,
      hora_salida: item.hora_salida,
    });

    if (dayRegister < dayActually) {
      setOpenModalEdit(true);
    } else {
      setOpenModalAlert(true);
    }
  }

  async function handleUpdateHours() {
    try {
      setLoading(true);
      await putId(
        "detail-report",
        { dataTemporalHours, dataDetail },
        dataDetail.id,
        session.data
      );
      setLoading(false);
      setLoadingUpdateHours(!loadingUpdateHours);
    } catch (error) {
      setLoading(false);

      useToastDestructive("Error", "Error al modificar las horas");
    }
  }

  async function exportToExcel() {
    try {
      ("use server");
      downloadExcel(workers);
    } catch (error) {
      console.log(error);
      useToastDestructive("Error", "Error al crear el archivo");
    }
  }

  async function fetchIncidentsForDetail() {
    try {
      if (dataDetail.id) {
        const response = await getId(
          "reports/incident",
          dataDetail.id,
          session.data
        );
        setIncidentsDetail(response.data);
      }
    } catch (error) {
      useToastDestructive("Error", "Error al traer incidente");
    }
  }

  async function handleAddIncident() {
    // para que se vea visualemnete en tiempo real
    try {
      await post(
        "reports/incident",
        { detailReportId: dataDetail.id, incidentId: incidentSelected },
        session.data
      );
      // setIncidentSelected(incident);
      useToastDefault("Ok", "Incidente registrado!");
      setActionActive(!actionActive);
    } catch (error) {
      useToastDestructive("Error", "Error al registrar incidente");
    }
  }

  async function handleDeleteDetailIncident(detailIncidentId: number) {
    try {
      await deleteId("reports/incident", detailIncidentId, session.data);
      setActionActive(!actionActive);
    } catch (error) {
      useToastDestructive("Error", "Error al eliminar incidente");
    }
  }

  function formatDate(dateString: string) {
    return format(new Date(dateString), "yyyy-MM-dd");
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      useToastDefault("Aviso", "Este reporte es del dia anterior");
      fetchReport();
      fetDepartments();
      fetchIncidents();
    }
  }, [session.status, loadingUpdateHours]);

  useEffect(() => {
    fetchIncidentsForDetail();
  }, [openModalEdit, actionActive]);

  return (
    <div>
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
              <Input
                type="date"
                onChange={(e) => setDate(e.target.value)}
              ></Input>
            </div>
            <Button
              className="mt-0"
              onClick={handleChangeDay}
              disabled={loading}
            >
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
                <th className="py-3 pr-6">Fecha</th>
                <th className="py-3 pr-6">Hora inicio</th>
                <th className="py-3 pr-6">Inicio refrigerio</th>
                <th className="py-3 pr-6">Fin refrigerio</th>
                <th className="py-3 pr-6">Hora salida</th>
                <th className="py-3 pr-6">Tardanza</th>
                <th className="py-3 pr-6">Falta</th>
                <th className="py-3 pr-6">Descuento</th>

                <th className="py-3 pr-6">Acción</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {loading ? (
                <>
                  <tr>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className=" h-18"></Skeleton>
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className=" h-18"></Skeleton>
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className=" h-18"></Skeleton>
                    </td>
                    <th className="py-3 pr-6">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>

                    <td className=" whitespace-nowrap">
                      <Skeleton></Skeleton>
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className=" h-18"></Skeleton>
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className=" h-18"></Skeleton>
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <Skeleton className=" h-18"></Skeleton>
                    </td>
                    <th className="py-3 pr-6">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>
                    <th className="py-3 pr-6" align="center">
                      <Skeleton className=" h-18"></Skeleton>
                    </th>

                    <td className=" whitespace-nowrap">
                      <Skeleton></Skeleton>
                    </td>
                  </tr>
                </>
              ) : (
                currentWorkers.map((item: any, idx) => (
                  <tr
                    key={idx}
                    className={`${item.discount === 0 && "bg-green-100"} ${
                      item.discount === 5 && "bg-orange-100"
                    } ${item.discount === 10 && "bg-orange-100"} ${
                      item.discount === 20 && "bg-orange-100"
                    }  ${item.discount === 35 && "bg-red-100"}`}
                  >
                    <td className="pr-6 py-4 whitespace-nowrap">{item.dni}</td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      {item.nombre}
                    </td>

                    <th className="py-3 pr-6">
                      {formatDate(item.fecha_reporte)}
                    </th>
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

                    <th className="py-3 pr-6" align="center">
                      {item.discount}
                    </th>

                    <td className=" whitespace-nowrap">
                      <Button
                        variant="secondary"
                        onClick={() => handleOpenModalPrev(item)}
                      >
                        <Settings size={20} />
                      </Button>
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

      <Dialog
        open={openModalAlert}
        onOpenChange={() => setOpenModalAlert(false)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Aviso de sistema</DialogTitle>
          </DialogHeader>
          {/* Contenido personalizado del modal */}
          <div className="overflow-y-hidden">
            <span>
              Esta opcion no esta permitida, es un reporte del dia actual,
              espere al dia siguiente para poder editarlo
            </span>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModalEdit} onOpenChange={() => setOpenModalEdit(false)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dataDetail.nombre}</DialogTitle>
          </DialogHeader>
          {/* Contenido personalizado del modal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Hora de inicio</Label>
              <Input
                defaultValue={dataDetail.hora_inicio}
                onChange={(e) =>
                  setDataTemporalHours({
                    ...dataTemporalHours,
                    hora_inicio: e.target.value,
                  })
                }
              ></Input>
            </div>

            <div>
              <Label>Hora de salida</Label>
              <Input
                defaultValue={dataDetail.hora_salida}
                onChange={(e) =>
                  setDataTemporalHours({
                    ...dataTemporalHours,
                    hora_salida: e.target.value,
                  })
                }
              ></Input>
            </div>

            <div>
              <Label>Hora inicio refrigerio</Label>
              <Input
                defaultValue={dataDetail.hora_inicio_refrigerio}
                onChange={(e) =>
                  setDataTemporalHours({
                    ...dataTemporalHours,
                    hora_inicio_refrigerio: e.target.value,
                  })
                }
              ></Input>
            </div>
            <div>
              <Label>Hora fin refrigerio</Label>
              <Input
                defaultValue={dataDetail.hora_fin_refrigerio}
                onChange={(e) =>
                  setDataTemporalHours({
                    ...dataTemporalHours,
                    hora_fin_refrigerio: e.target.value,
                  })
                }
              ></Input>
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
                size={"sm"}
                onClick={handleUpdateHours}
                disabled={loading}
              >
                Guardar cambios
              </Button>
            </div>
            {/* se borro la opcion de agregar incidencias ya que esto se registrar en el detalle de trabajador */}
            {/* <hr className="col-span-2" /> */}

            {/* <div className="col-span-2">
              <Label>Seleccione un incidente</Label>
              <Select onValueChange={(e) => setIncidentSelected(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un incidente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {incidents.map((incident, idx) => (
                      <SelectItem value={incident.id} key={idx}>
                        {incident.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              {incidentsDetail.length && (
                <table className="text-sm text-left">
                  <thead>
                    <tr>
                      <th>Incidente</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentsDetail.map((incident, idx) => (
                      <tr key={idx}>
                        <td className="w-full">{incident.incident.title}</td>
                        <td>
                          <span
                            role="button"
                            className="text-red-500 underline"
                            onClick={() =>
                              handleDeleteDetailIncident(incident.id)
                            }
                          >
                            Eliminar
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="col-span-2 flex justify-end">
              <Button size={"sm"} onClick={handleAddIncident}>
                Registrar incidencia
              </Button>
            </div> */}
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

export default TableData;
