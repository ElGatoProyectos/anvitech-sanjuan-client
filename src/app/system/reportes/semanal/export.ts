import * as XLSX from "xlsx";

export const downloadExcel = (data: any[]) => {
  const date = new Date();

  const dataGeneral = data.map((item: any) => {
    const worker = item.worker;

    // Filtrar los objetos por worker.id
    const filteredData = data.filter(
      (item) => item.worker && item.worker.id === worker.id
    );

    // Contar las faltas por días específicos
    let totalFaltas = 0;
    let totalTardanzas = 0;

    filteredData.map((item) => {
      if (item.lunes) {
        if (item.lunes.falta === "si" && item.lunes.tardanza === "no")
          totalFaltas++;
        if (item.lunes.tardanza === "si") totalTardanzas++;
      }
      if (item.martes) {
        if (item.martes.falta === "si" && item.martes.tardanza === "no")
          totalFaltas++;
        if (item.martes.tardanza === "si") totalTardanzas++;
      }
      if (item.miercoles) {
        if (item.miercoles.falta === "si" && item.miercoles.tardanza === "no")
          totalFaltas++;
        if (item.miercoles.tardanza === "si") totalTardanzas++;
      }
      if (item.jueves) {
        if (item.jueves.falta === "si" && item.jueves.tardanza === "no")
          totalFaltas++;
        if (item.jueves.tardanza === "si") totalTardanzas++;
      }
      if (item.viernes) {
        if (item.viernes.falta === "si" && item.viernes.tardanza === "no")
          totalFaltas++;
        if (item.viernes.tardanza === "si") totalTardanzas++;
      }
      if (item.sabado) {
        if (item.sabado.falta === "si" && item.sabado.tardanza === "no")
          totalFaltas++;
        if (item.sabado.tardanza === "si") totalTardanzas++;
      }
    });

    const formatData = {
      DNI: item.worker.dni,
      NOMBRES: item.worker.full_name,
      // SABADO: !item.sabado
      //   ? "-"
      //   : item.sabado.tardanza === "si"
      //   ? "T"
      //   : item.sabado.falta === "si"
      //   ? "F"
      //   : "-",
      // LUNES: !item.lunes
      //   ? "-"
      //   : item.lunes.tardanza === "si"
      //   ? "T"
      //   : item.lunes.falta === "si"
      //   ? "F"
      //   : "-",
      // MARTES: !item.martes
      //   ? "-"
      //   : item.martes.tardanza === "si"
      //   ? "T"
      //   : item.martes.falta === "si"
      //   ? "F"
      //   : "-",
      // MIERCOLES: !item.miercoles
      //   ? "-"
      //   : item.miercoles.tardanza === "si"
      //   ? "T"
      //   : item.miercoles.falta === "si"
      //   ? "F"
      //   : "-",
      // JUEVES: !item.jueves
      //   ? "-"
      //   : item.jueves.tardanza === "si"
      //   ? "T"
      //   : item.jueves.falta === "si"
      //   ? "F"
      //   : "-",
      // VIERNES: !item.viernes
      //   ? "-"
      //   : item.viernes.tardanza === "si"
      //   ? "T"
      //   : item.viernes.falta === "si"
      //   ? "F"
      //   : "-",
      SABADO: !item.sabado ? "-" : item.sabado.discount,
      LUNES: !item.lunes ? "-" : item.lunes.discount,
      MARTES: !item.martes ? "-" : item.martes.discount,
      MIERCOLES: !item.miercoles ? "-" : item.miercoles.discount,
      JUEVES: !item.jueves ? "-" : item.jueves.discount,
      VIERNES: !item.viernes ? "-" : item.viernes.discount,
      "TOTAL DE TARDANZA": totalTardanzas,
      "TOTAL DE FALTAS": totalFaltas,
      "TOTAL DESCUENTO":
        (item.lunes ? item.lunes.discount : 0) +
        (item.martes ? item.martes.discount : 0) +
        (item.miercoles ? item.miercoles.discount : 0) +
        (item.jueves ? item.jueves.discount : 0) +
        (item.viernes ? item.viernes.discount : 0) +
        (item.sabado ? item.sabado.discount : 0),
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
