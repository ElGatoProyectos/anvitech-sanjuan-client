import * as XLSX from "xlsx";

export const downloadExcel = (data: any) => {
  const date = new Date();

  const dataGeneral = data.map((item: any) => {
    const formatData = {
      DNI: item.dni,
      NOMBRES: item.nombre,
      FECHA: item.fecha_reporte,
      "HORA INICIO": item.hora_inicio,
      "HORA INICIO REFRIGERIO": item.hora_inicio_refrigerio,
      "HORA FIN REFRIGERIO": item.hora_fin_refrigerio,
      "HORA SALIDA": item.hora_salida,
      DESCUENTO: item.discount,
    };
    return formatData;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataGeneral);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(
    workbook,
    `Reporte${date.getFullYear()} - ${
      date.getMonth() + 1
    } - ${date.getDay()}.xlsx`
  );
};

export const downloadReportWorker = (data: any, worker: any) => {
  const date = new Date();

  const dataGeneral = data.map((item: any) => {
    const formatData = {
      DNI: item.dni,
      NOMBRES: worker.full_name,
      FECHA: item.fecha_reporte,
      "HORA INICIO": item.hora_inicio,
      "HORA INICIO REFRIGERIO": item.hora_inicio_refrigerio,
      "HORA FIN REFRIGERIO": item.hora_fin_refrigerio,
      "HORA SALIDA": item.hora_salida,
      FALTA: item.falta === "si" ? "F" : "-",
      TARDANZA: item.tardanza === "si" ? "T" : "-",
      DESCUENTO: item.discount,
    };
    return formatData;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataGeneral);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(
    workbook,
    `reporte-trabajador - ${date.getFullYear()} - ${
      date.getMonth() + 1
    } - ${date.getDay()}.xlsx`
  );
};
