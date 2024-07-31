import { reportService } from "@/lib/core/service/report.service";
import * as XLSX from "xlsx";

//- esta funcion se filtra por mes, debemos recibir el numero del mes donde estamos
//- el starsoft es el recuento de todo
export function exportStartSoft(content: any, dateMin: Date, dateMax: Date) {
  const { dataGeneral, incidents } = content;

  const response = dataGeneral.map((row: any) => {
    const schedule = row.schedule;
    const worker = row.worker;

    const faltas = row.reportes.filter((r: any) => r.falta === "si");
    // se podria hacer lo mismo para las licencias, colocarle un nombre,pero habria una gestion de licencias
    const incidentsFeriado = incidents.filter(
      (item: any) => item.title === "FERIADO"
    );

    // calculo de minutos de tardanza
    let minutosTardanza = 0;
    const rowsT = row.reportes.filter((r: any) => r.tardanza === "si");
    rowsT.map((i: any) => {
      minutosTardanza = Number(i.hora_inicio.split(":")[1]);
    });

    // calculo de horas por 25% 35%

    let horasExtras = {
      first: 0,
      second: 0,
    };
    row.reportes.map((r: any) => {
      const [horaSalidaMarcacion, minutoSalidaMarcacion] = r.hora_salida
        .split(":")
        .map(Number);

      if (horaSalidaMarcacion) {
        if (r.extra_hours === "y") {
          const [horaSalidaHorario, minutoSalidaHorario] = schedule[r.dia]
            .split("-")[1]
            .split(":")
            .map(Number);

          const diferencia = horaSalidaMarcacion - horaSalidaHorario;
          if (diferencia === 1) {
            if (horasExtras.first === 2) {
              horasExtras.second += 1;
            } else {
              horasExtras.first += 1;
            }
          }
          if (diferencia === 2) {
            if (horasExtras.first > 0) {
              horasExtras.second += 2;
            } else {
              horasExtras.first += 2;
            }
          }
          if (diferencia > 2) {
            horasExtras.second += diferencia;
          }
        }
      }
    });

    // calculo para las horas trabajadas en dia de descanso, falta testear

    let horasTrabajadasDescanso = 0;

    row.reportes.map((r: any) => {
      if (
        isRangeLicense(worker.id, r.fecha_reporte, row.licencias) ||
        isRangeMedicalRest(worker.id, r.fecha_reporte, row.descansos_medico) ||
        isRangePermission(worker.id, r.fecha_reporte, row.permisos) ||
        isRangeVacation(worker.id, r.fecha_reporte, row.vacaciones)
      ) {
        horasTrabajadasDescanso =
          horasTrabajadasDescanso + horasExtras.first + horasExtras.second;
        horasExtras.first = 0;
        horasExtras.second = 0;
      }
    });

    //calculo para las horas extras en dia de feriado
    let horasExtrasFeriado = 0;
    row.reportes.map((r: any) => {
      if (validateIsHoliday(r.fecha_reporte, incidents)) {
        const [horaSalidaMarcacion, minutoSalidaMarcacion] = r.hora_salida
          .split(":")
          .map(Number);
        if (r.extra_hours === "y") {
          const [horaSalidaHorario, minutoSalidaHorario] = schedule[r.dia]
            .split("-")[1]
            .split(":")
            .map(Number);

          const diferencia = horaSalidaMarcacion - horaSalidaHorario;
          horasExtrasFeriado += diferencia;
        }
      }
    });

    const formatData = {
      CODTRABA: row.worker.dni,
      NOMBRES: row.worker.full_name,
      CCOSTO: "",
      DDESCMED: calculateDaysInRange(row.descansos_medico, dateMin, dateMax)-1,
      DFALTAS: faltas.length,
      DFERI: incidentsFeriado.length,
      DIASTRAB: row.reportes.length - faltas.length,
      DIFHORAS: "-",
      DLICSGO: calculateDaysInRange(row.vacaciones, dateMin, dateMax)-1,
      DLICCGO: calculateDaysInRange(row.licencias, dateMin, dateMax)-1,
      DSUBENF: "-",
      DSUBMAT: "-",
      DSUBPATE: "-",
      HE100: horasTrabajadasDescanso,
      HE25: horasExtras.first,
      HE35: horasExtras.second,
      HLACTANC: "",
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

function isDateInRange(dateToCheck: any, startDate: any, endDate: any) {
  return (
    new Date(dateToCheck) >= new Date(startDate) &&
    new Date(dateToCheck) <= new Date(endDate)
  );
}

function isRangeLicense(workerId: number, date: string, dataLicenses: any[]) {
  const datesfiltered = dataLicenses.filter((i) => i.worker_id === workerId);
  let response = false;
  if (datesfiltered.length > 0) {
    datesfiltered.map((record) => {
      if (isDateInRange(date, record.start_date, record.end_date))
        response = true;
      else response = false;
    });
  } else {
    response = false;
  }
  return response;
}

function isRangePermission(
  workerId: number,
  date: string,
  dataPermissions: any[]
) {
  const datesfiltered = dataPermissions.filter((i) => i.worker_id === workerId);

  let response = false;
  if (datesfiltered.length > 0) {
    datesfiltered.map((record) => {
      if (isDateInRange(date, record.start_date, record.end_date))
        response = true;
      else response = false;
    });
  } else {
    response = false;
  }
  return response;
}

function isRangeVacation(workerId: number, date: string, dataVacations: any[]) {
  const datesfiltered = dataVacations.filter((i) => i.worker_id === workerId);

  let response = false;
  if (datesfiltered.length > 0) {
    datesfiltered.map((record) => {
      if (isDateInRange(date, record.start_date, record.end_date))
        response = true;
      else response = false;
    });
  } else {
    response = false;
  }
  return response;
}

function isRangeMedicalRest(
  workerId: number,
  date: string,
  dataMedicalRests: any[]
) {
  const datesfiltered = dataMedicalRests.filter(
    (i) => i.worker_id === workerId
  );

  let response = false;
  if (datesfiltered.length > 0) {
    datesfiltered.map((record) => {
      if (isDateInRange(date, record.start_date, record.end_date))
        response = true;
      else response = false;
    });
  } else {
    response = false;
  }
  return response;
}

function validateIsHoliday(date: string, incidents: any[]) {
  return incidents.some((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.toISOString().split("T")[0] ===
      new Date(date).toISOString().split("T")[0]
    );
  });
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
  return Math.floor(totalDays + 1);
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
