import * as XLSX from "xlsx";

export const downloadExcel = (data: any) => {
  const date = new Date();

  const dataGeneral = data.map((item: any) => {
    const formatData = {
      DNI: item.worker.full_name,
      NOMBRES: "",
      SABADO: "",
      LUNES: "",
      MARTES: "",
      MIERCOLES: "",
      JUEVES: "",
      VIERNES: "",
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
