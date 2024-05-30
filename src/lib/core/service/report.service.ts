import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

class ReportService {
  async generateReport() {
    try {
      const lastReport = (await this.findLast()) as any;
      let numberPos;
      if (lastReport !== null) {
        const nameSepare = lastReport.name.split(" ");
        numberPos = Number(nameSepare[1]) + 1;
      } else numberPos = 1;

      const dataSet = {
        state: "default",
        name: "Report " + numberPos,
      };
      const report = await prisma.report.create({ data: dataSet });
      return httpResponse.http200("Report created ok", report);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async generateReportDetail(dataGeneralAniz: any[], reportId: number) {
    // todo mapeo de la informacion y registro de la misma en base al id del reporte
  }

  async findAll() {
    try {
      const reports = await prisma.report.findMany();
      return httpResponse.http200("All reports", reports);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  private async findLast() {
    return await prisma.report.findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const reportService = new ReportService();
