import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";
import * as xlsx from "xlsx";

class WorkerService {
  async findAll() {
    try {
      const workers = await prisma.worker.findMany();
      return httpResponse.http200("All workers", workers);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findById(id: number) {
    try {
      const worker = await prisma.worker.findFirst({ where: { id } });
      if (!worker) return httpResponse.http404("Worker not found");
      return httpResponse.http200("Worker found", worker);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async fileToRegisterMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      const convertedArray = sheetToJson.map((item: any) => {
        const hireDate = excelSerialDateToJSDate(item["Hire Date"]);
        const hireDateTimestamp = formatDateForPrisma(hireDate);

        return {
          full_name: `${item["First Name"]} ${item["Last Name"]}`,
          dni: item["Employee No."].toString(),
          department: item.Department,
          position: item.Position,
          hire_date: hireDateTimestamp,
        };
      });

      await prisma.worker.createMany({ data: convertedArray });
    } catch (error) {}
  }
}

export const workerService = new WorkerService();
