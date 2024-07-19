import { reportService } from "@/lib/core/service/report.service";
import * as XLSX from "xlsx";

//- esta funcion se filtra por mes, debemos recibir el numero del mes donde estamos
export function exportStartSoft(content: any, dateMin: Date, dateMax: Date) {
  const { dataGeneral, incidents } = content;

  const response = dataGeneral.map((row: any) => {
    const faltas = row.reportes.filter((r: any) => r.falta === "si");
    // se podria hacer lo mismo para las licencias, colocarle un nombre,pero habria una gestion de licencias
    const incidentsFeriado = incidents.filter(
      (item: any) => item.title === "FERIADO"
    );

    let minutosTardanza = 0;

    const rowsT = row.reportes.filter((r: any) => r.tardanza === "si");

    rowsT.map((i: any) => {
      minutosTardanza = Number(i.hora_inicio.split(":")[1]);
    });

    const formatData = {
      CODTRABA: row.worker.dni,
      NOMBRES: row.worker.full_name,
      CCOSTO: "",
      DDESCMED: calculateDaysInRange(row.descansos_medico, dateMin, dateMax),
      DFALTAS: faltas.length,
      DFERI: incidentsFeriado.length,
      DIASTRAB: row.reportes.length - faltas.length,
      DIFHORAS: "CAMBIO DE LOGICA",
      DLICSGO: calculateDaysInRange(row.vacaciones, dateMin, dateMax),
      DLICCGO: calculateDaysInRange(row.licencias, dateMin, dateMax),
      DSUBENF: "-",
      DSUBMAT: "-",
      DSUBPATE: "-",
      HE100: "CAMBIO DE LOGICA",
      HE25: "CAMBIO DE LOGICA",
      HE35: "CAMBIO DE LOGICA",
      HLACTANC: "CAMBIO DE LOGICA",
      HORASTRA: (row.reportes.length - faltas.length) * 8,
      MAYO1ERO: "",
      MTAR: minutosTardanza,
      DVAC: calculateDaysInRange(row.vacaciones, dateMin, dateMax),
    };
    return formatData;
  });

  const worksheet = XLSX.utils.json_to_sheet(response);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "reporte-startsoft.xlsx");
}

function calculateDaysInRange(dataArr: any[], dateMin: Date, dateMax: Date) {
  let totalDays = 0;

  dataArr.forEach((vacation: any) => {
    const vacationStart = new Date(vacation.start_date);
    const vacationEnd = new Date(vacation.end_date);

    const start = vacationStart > dateMin ? vacationStart : dateMin;
    const end = vacationEnd < dateMax ? vacationEnd : dateMax;

    const startTime = start.getTime();
    const endTime = end.getTime();

    if (startTime <= endTime) {
      const daysInRange = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1;
      totalDays += daysInRange;
    }
  });
  return totalDays;
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
