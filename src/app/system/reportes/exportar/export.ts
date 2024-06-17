import { reportService } from "@/lib/core/service/report.service";
import * as XLSX from "xlsx";

//- esta funcion se filtra por mes, debemos recibir el numero del mes donde estamos
export function exportStartSoft(content: any) {
  const { workers, data, incidents } = content;

  console.log(incidents);

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
  try {
  } catch (error) {}
}
