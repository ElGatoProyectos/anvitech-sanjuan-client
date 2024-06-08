import { reportService } from "@/lib/core/service/report.service";

async function exportStartSoft() {
  try {
    // esto sale de la base de datos, no de la api
    const response = await reportService.dataForStartSoft();
  } catch (error) {}
}
