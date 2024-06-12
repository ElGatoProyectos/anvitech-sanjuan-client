import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";
import * as xlsx from "xlsx";
import {
  excelSerialDateToJSDate,
  formatDateForPrisma,
} from "../functions/date-transform";
import { createWorkerDTO } from "../schemas/worker.dto";
import { scheduleService } from "./schedule.service";

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

  /// registros masivos ok, deben evitarse ingresar registros duplicados en el excel si no ninguno se registrara
  async fileToRegisterMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      //- pendiente la validacion de esquemas con zod

      const convertedArray = sheetToJson.map((item: any) => {
        const hireDate = excelSerialDateToJSDate(item.fecha_contratacion);
        const hireDateTimestamp = formatDateForPrisma(hireDate);

        return {
          full_name: item.nombres,
          dni: item.dni.toString(),
          department: item.departamento ? "No definido" : item.departamento,
          position: item.posicion ? "No definido" : "No definido",
          enabled: item.estado === "ACTIVO" ? "si" : "no",
          hire_date: hireDateTimestamp,

          coordinator: item.coordinador ? "Definido" : "No definido",
        };
      });

      const created = await prisma.worker.createMany({ data: convertedArray });

      /// registrar los horarios por defecto
      const formatSchedule = {
        lunes: "09:00-18:00",
        martes: "09:00-18:00",
        miercoles: "09:00-18:00",
        jueves: "09:00-18:00",
        viernes: "09:00-18:00",
        sabado: "09:00-18:00",
        domingo: "",
        type: "default",
      };

      const { content: workers } = await this.findAll();
      workers.map(async (w: any) => {
        const wFormat = {
          ...formatSchedule,
          worker_id: w.id,
        };
        await scheduleService.createScheduleMassive(wFormat);
      });
      return httpResponse.http201("Workers created", created);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async create(data: any) {
    try {
      createWorkerDTO.parse(data);
      const formatData = {
        ...data,
        hire_date: formatDateForPrisma(data.hire_date),
      };
      const created = await prisma.worker.create({ data: formatData });
      return httpResponse.http201("Worker created", created);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findDepartmentDistinct() {
    try {
      const departments = await prisma.worker.findMany({
        distinct: ["department"],
        select: {
          department: true,
        },
      });

      console.log(departments);

      return httpResponse.http200("Departments distinct", departments);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findByDNI(dni: string) {
    try {
      const worker = await prisma.worker.findFirst({
        where: { dni },
      });

      return httpResponse.http200("Departments distinct", worker);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async updateTerminationDate(data: any, workerId: number) {
    try {
      if (data.restore) {
        const worker = await prisma.worker.update({
          where: { id: workerId },
          data: {
            termination_date: null,
            reason: "",
            enabled: "si",
          },
        });

        return httpResponse.http200("Worker updated", worker);
      } else {
        const worker = await prisma.worker.update({
          where: { id: workerId },
          data: {
            termination_date: new Date(data.termination_date),
            reason: data.reason,
            enabled: "no",
          },
        });

        return httpResponse.http200("Worker updated", worker);
      }
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }
}

export const workerService = new WorkerService();
