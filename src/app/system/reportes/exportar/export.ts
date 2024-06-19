import { reportService } from "@/lib/core/service/report.service";
import * as XLSX from "xlsx";

//- esta funcion se filtra por mes, debemos recibir el numero del mes donde estamos
export function exportStartSoft(content: any) {
  const { workers, data, incidents } = content;

  const dataGeneral = workers.map((worker: any) => {
    const workerDataFiltered = data.filter(
      (item: any) => item.dni === worker.dni && item.falta === "si"
    );
    const formatData = {
      CODTRABA: worker.dni,
      NOMBRES: worker.full_name,
      CCOSTO: "",
      DDESCMED: "",
      DFALTAS: workerDataFiltered.length,
      DIASTRAB: "",
      DLICSGO: "",
      DLICCGO: "",
      DSUBENF: "",
      DSUBMAT: "",
      DVAC: "",
    };
    return formatData;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataGeneral);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "reporte-startsoft.xlsx");
}

export function exportNormal(content: any) {
  const dataGeneral = content.map((row: any) => {
    const formatData = {
      FECHA: row.fecha_reporte,
      TRABAJADOR: row.nombre,
      DNI: row.dni,
      FALTA: row.falta,
      "HORA INICIO": row.hora_inicio,
      "HORA INICIO REFRIGERIO": row.hora_inicio_refrigerio,
      "HORA FIN REFRIGERIO": row.hora_fin_refrigerio,
      "HORA SALIDA": row.hora_salida,
      DESCUENTO: row.discount,
    };
    return formatData;
  });
  const worksheet = XLSX.utils.json_to_sheet(dataGeneral);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "reporte-basico.xlsx");
}
