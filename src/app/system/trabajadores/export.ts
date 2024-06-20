import * as XLSX from "xlsx";

export function exportAllWorkers(content: any) {
  try {
    const dataGeneral = content.map((worker: any) => {
      const formatData = {
        DNI: worker.dni,
        NOMBRES: worker.full_name,
        DEPARTAMENTO: worker.department,
        POSICION: worker.position,
        "FECHA INGRESO": worker.hire_date,
        ESTADO: worker.enabled ? "ACTIVO" : "NO ACTIVO",
        "FECHA DE CESE": worker.termination_date,
      };
      return formatData;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataGeneral);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "reporte-total-trabajadores.xlsx");
  } catch (error) {}
}
