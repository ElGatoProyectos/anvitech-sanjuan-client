import * as XLSX from "xlsx";

export const downloadExcel = (data: any) => {
  const date = new Date();

  const dataGeneral = data.map((item: any) => {
    const formatData = {
      DNI: "",
      NOMBRES: "",
      FECHA: "",
      "HORA INICIO": "",
      "HORA INICIO REFRIGERIO": "",
      "HORA FIN REFRIGERIO": "",
      "HORA SALIDA": "",
      DESCUENTO: "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(
    workbook,
    `Reporte${date.getFullYear()} - ${
      date.getMonth() + 1
    } - ${date.getDay()}.xlsx`
  );
};
