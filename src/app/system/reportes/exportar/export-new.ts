import * as XLSX from "xlsx";

// new
export function reportStartSoftForWorker(data: any, worker: any) {
  const schedule = data.schedule;

  const dataGeneral = data.reportes.map((row: any) => {
    let minutosAcumulados = 0;

    const hora_inicio = row.hora_inicio; // 7:34
    try {
      if (hora_inicio && hora_inicio !== "00:00") {
        const [hora, minutos] = hora_inicio.split(":").map(Number);
        const minutosInicio = hora * 60 + minutos;
        const minutosReferencia = 7 * 60 + 30; // 7:30 en minutos

        if (minutosInicio > minutosReferencia) {
          const minutosTardanza = minutosInicio - minutosReferencia;
          minutosAcumulados += minutosTardanza;
        }
      }
    } catch (error) {
      console.log(error);
    }

    // tardanza

    const totalFaltas = data.reportes.filter((i: any) => i.falta === "si");
    const totalTardanzas = data.reportes.filter(
      (i: any) => i.tardanza === "si"
    );
    let horasExtras = {
      first: 0,
      second: 0,
    };

    // horas extras
    const [horaSalidaMarcacion, minutoSalidaMarcacion] = row.hora_salida
      .split(":")
      .map(Number);

    if (row.extra_hours === "y") {
      const [horaSalidaHorario, minutoSalidaHorario] = schedule[row.dia]
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

    const tiempoRefrigerio = calculateMin(
      row.hora_inicio_refrigerio,
      row.hora_fin_refrigerio
    );
    const horas_trabajadas = calculateWorkHours(
      row.hora_inicio,
      row.hora_salida,
      tiempoRefrigerio
    );

    if (row.falta === "si") {
      return {
        EMPRESA: worker.company,
        DEPARTAMENTO: worker.department,
        "NOMBRE Y APELLIDOS": worker.full_name,
        DNI: worker.dni,
        "FECHA DE MARCACION":
          row.dia.slice(0, 3) + " " + row.fecha_reporte.split("T")[0],
        "HORA PROGRAMADA": data.schedule[row.dia],
        ENTRADA: "INASISTENCIA",
        "INICIO DE REGRIGERIO": "INASISTENCIA",
        "FIN DE REFRIGERIO": "INASISTENCIA",
        SALIDA: "INASISTENCIA",
        "SUMA DE HORAS TRABAJADAS": "",
        "TOTAL REFRIGERIO": "",
        "LA SUMA DE TARDANZAS": minutosAcumulados,
        FALTAS: "SI",
        "HORAS EXTRAS 25%": "",
        "HORAS EXTRAS 35%": "",
        VACACIONES: "",
      };
    } else {
      // validar si la fecha de reporte esta en algun rango de vacaciones o descanso licensia
      //- esto esta por verse deberia ser cada uno, o en general DESCANSO
      let valorTemporal = "";

      if (isRangeLicense(worker.id, row.fecha_reporte, data.licencias)) {
        valorTemporal = "LICENCIA";
      }

      if (isRangePermission(worker.id, row.fecha_reporte, data.permisos)) {
        valorTemporal = "PERMISO";
      }

      if (
        isRangeMedicalRest(worker.id, row.fecha_reporte, data.descansos_medico)
      ) {
        valorTemporal = "DESCANSO MEDICO";
      }

      if (isRangeVacation(worker.id, row.fecha_reporte, data.vacaciones)) {
        valorTemporal = "VACACIONES";
      }

      return {
        EMPRESA: worker.company,
        DEPARTAMENTO: worker.department,
        "NOMBRE Y APELLIDOS": worker.full_name,
        DNI: worker.dni,
        "FECHA DE MARCACION":
          row.dia.slice(0, 3) + " " + row.fecha_reporte.split("T")[0],
        "HORA PROGRAMADA": data.schedule[row.dia],
        ENTRADA: valorTemporal === "" ? row.hora_inicio : valorTemporal,
        "INICIO DE REGRIGERIO":
          valorTemporal === "" ? row.hora_inicio_refrigerio : valorTemporal,
        "FIN DE REFRIGERIO":
          valorTemporal === "" ? row.hora_fin_refrigerio : valorTemporal,
        SALIDA: valorTemporal === "" ? row.hora_salida : valorTemporal,
        "SUMA DE HORAS TRABAJADAS":
          horas_trabajadas.hours + ":" + horas_trabajadas.minutes,
        "TOTAL REFRIGERIO": tiempoRefrigerio,
        "LA SUMA DE TARDANZAS": minutosAcumulados,
        FALTAS: "",
        "HORAS EXTRAS 25%": horasExtras.first,
        "HORAS EXTRAS 35%": horasExtras.second,
        VACACIONES: data.vacaciones.length,
      };
    }
  });
  const worksheet = XLSX.utils.json_to_sheet(dataGeneral);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "reporte-basico.xlsx");
}

// new

export function reportNewSchema(data: any[]) {
  // Estructura para almacenar los datos planos
  const dataGeneral: any[] = [];
  const fechas = new Set<string>();

  // Primero recolectamos todas las fechas
  data.forEach((item: any) => {
    const { report } = item;
    const fecha_reporte = report.fecha_reporte.split("T")[0];
    fechas.add(fecha_reporte);
  });

  // Inicializamos la cabecera con las filas necesarias
  const headerRow1: any[] = ["cod", "apellidos y nombres", "dni"];
  const headerRow2: any[] = ["", "", ""];

  fechas.forEach((fecha: string) => {
    headerRow1.push(fecha, "", "", "");
    headerRow2.push("Ent", "INICIO REFRI", "FIN REFRI", "Sali");
  });

  // Transformamos los datos
  data.forEach((item: any) => {
    const { report, worker } = item;
    const fecha_reporte = report.fecha_reporte.split("T")[0];

    let existingItem = dataGeneral.find((d) => d.cod === worker.content.dni);

    if (!existingItem) {
      existingItem = {
        cod: worker.content.dni,
        "apellidos y nombres": worker.content.full_name,
        dni: worker.content.dni,
      };
      dataGeneral.push(existingItem);
    }

    existingItem[`${fecha_reporte} Ent`] = report.hora_inicio || "";
    existingItem[`${fecha_reporte} INICIO REFRI`] =
      report.hora_inicio_refrigerio || "";
    existingItem[`${fecha_reporte} FIN REFRI`] =
      report.hora_fin_refrigerio || "";
    existingItem[`${fecha_reporte} Sali`] = report.hora_salida || "";
  });

  // Convertimos la estructura a un formato plano
  const dataFlattened: any[] = dataGeneral.map((item: any) => {
    const flattened: any = {
      cod: item.cod,
      "apellidos y nombres": item["apellidos y nombres"],
      dni: item.dni,
    };

    fechas.forEach((fecha: string) => {
      flattened[`${fecha} Ent`] = item[`${fecha} Ent`] || "";
      flattened[`${fecha} INICIO REFRI`] = item[`${fecha} INICIO REFRI`] || "";
      flattened[`${fecha} FIN REFRI`] = item[`${fecha} FIN REFRI`] || "";
      flattened[`${fecha} Sali`] = item[`${fecha} Sali`] || "";
    });

    return flattened;
  });

  // Creamos la hoja de cálculo con las cabeceras
  const worksheet: any = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [headerRow1, headerRow2], {
    origin: "A1",
  });
  XLSX.utils.sheet_add_json(worksheet, dataFlattened, {
    origin: "A3",
    skipHeader: true,
  });

  const workbook: any = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "reporte-nuevo-formato.xlsx");
}

function calculateMin(startTime: string, endTime: string) {
  if (startTime !== "" && endTime !== "") {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const differenceInMinutes = endTotalMinutes - startTotalMinutes;

    return differenceInMinutes;
  } else {
    return 0;
  }
}

function calculateWorkHours(
  startTime: string,
  endTime: string,
  breakTime: number
) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  let totalMinutesWorked = endTotalMinutes - startTotalMinutes;

  if (breakTime) {
    totalMinutesWorked -= breakTime;
  } else {
    totalMinutesWorked -= 59;
  }

  const workedHours = Math.floor(totalMinutesWorked / 60);
  const workedMinutes = totalMinutesWorked % 60;

  return {
    hours: workedHours,
    minutes: workedMinutes,
  };
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
