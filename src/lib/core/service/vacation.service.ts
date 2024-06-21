import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";
import * as xlsx from "xlsx";
import { reportService } from "./report.service";

class VacationService {
  async findAll() {
    try {
    } catch (error) {}
  }

  async findLasts(workerId: number) {
    try {
      const vacations = await prisma.vacation.findMany({
        where: { worker_id: workerId },
        orderBy: {
          id: "desc",
        },
        take: 5,
      });
      await prisma.$disconnect();
      return httpResponse.http200("Vacations", vacations);
    } catch (error) {
      await prisma.$disconnect();

      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findByWorker(workerId: number) {
    try {
      const vacations = await prisma.vacation.findMany({
        where: { worker_id: workerId },
      });
      await prisma.$disconnect();

      return httpResponse.http200("All vacations", vacations);
    } catch (error) {
      await prisma.$disconnect();

      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async create(data: any) {
    try {
      const formatData = {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
      };
      const vacations = await prisma.vacation.create({ data: formatData });
      await prisma.$disconnect();
      return httpResponse.http200("All vacations", vacations);
    } catch (error) {
      await prisma.$disconnect();
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async registerMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (row: any) => {
          const start_date = reportService.excelSerialDateToJSDate(
            row.fecha_inicio
          );
          const end_date = reportService.excelSerialDateToJSDate(row.fecha_fin);

          const worker = await prisma.worker.findFirst({
            where: { dni: String(row.dni) },
          });

          if (worker) {
            const formatData = {
              worker_id: worker.id,
              start_date,
              end_date,
              reason: row.motivo,
            };

            await prisma.vacation.create({ data: formatData });
          }
        })
      );

      await prisma.$disconnect();
      return httpResponse.http200("Register vacations ok");
    } catch (error) {
      await prisma.$disconnect();
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }
}

export const vacationService = new VacationService();
