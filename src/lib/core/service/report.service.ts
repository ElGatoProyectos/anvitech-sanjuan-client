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

  // async createReportDetail(dataDetail: any, reportId: number, day: string) {
  //   try {
  //     const dataTemporal = {
  //       uuid: "65638685461972376eb766c4261406cfc5f320272dee536c7c0ee8fc94768d71",
  //       checktype: 0,
  //       checktime: "2024-02-07T18:51:46+00:00",
  //       device: {
  //         serial_number: "0300100024030014",
  //         name: "014-MARIACOBOS-LIMANORTE",
  //       },
  //       employee: {
  //         first_name: "ANDERSON ",
  //         last_name: "GALVEZ TICLLACURI",
  //         workno: "70976827",
  //         department: "INTEGRAL PRO SAC - SEDE LIMA NORTE",
  //         job_title: "ASESOR DE VENTAS CAMPO",
  //       },
  //     };

  //     await prisma.detailReport.create({ data: dataDetail });
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }

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

  async findDetailReport(id: number) {
    try {
      const details = await prisma.detailReport.findMany({
        where: { report_id: id },
      });
      return httpResponse.http200("All details report", details);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async findReportByWorker(reportId: number, workerDNI: string) {
    try {
      const detail = await prisma.detailReport.findMany({
        where: { report_id: reportId, dni: workerDNI },
      });
      return httpResponse.http200("All details report", detail);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }
}

export const reportService = new ReportService();
