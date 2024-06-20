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
import { reportService } from "./report.service";

class WorkerService {
  async findAll() {
    try {
      const workers = await prisma.worker.findMany({
        where: { enabled: "si" },
      });
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

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          const hireDate = excelSerialDateToJSDate(item.fecha_contratacion);
          const formatData = {
            full_name: item.nombres,
            type_contract: item.tipo_contrato,
            dni: item.dni.toString(),
            type_dni: item.tipo_documento,
            department: item.departamento ? item.departamento : "No definido",
            position: item.posicion ? item.posicion : "No definido",
            enabled: item.estado === "ACTIVO" ? "si" : "no",
            hire_date: hireDate.toISOString(),
            supervisor:
              item.supervisor === "" ? "No definido" : item.supervisor,
            coordinator:
              item.coordinador === "" ? "No definido" : item.coordinador,
            management:
              item.gestor_comercial === ""
                ? "No definido"
                : item.gestor_comercial,
          };

          await prisma.worker.create({ data: formatData });
        })
      );

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
      return httpResponse.http201("Workers created");
    } catch (error) {
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
      return errorService.handleErrorSchema(error);
    }
  }

  // ==============================

  // async findAllSupervisor() {
  //   try {
  //     const data = await prisma.supervisor.findMany();
  //     return httpResponse.http200("All supervisors", data);
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }
  // async createSupervisor(data: any) {
  //   try {
  //     const created = await prisma.supervisor.create({ data });
  //     return httpResponse.http201("Supervisor created", created);
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }

  // async findAllCoordinator() {
  //   try {
  //     const data = await prisma.coordinator.findMany();
  //     return httpResponse.http200("All coordinators", data);
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }
  // async createCoordinator(data: any) {
  //   try {
  //     const created = await prisma.coordinator.create({ data });
  //     return httpResponse.http201("Supervisor created", created);
  //   } catch (error) {
  //
  //     return errorService.handleErrorSchema(error);
  //   }
  // }

  // async findAllManagement() {
  //   try {
  //     const data = await prisma.management.findMany();
  //     return httpResponse.http200("All managements", data);
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }

  // async createManagement(data: any) {
  //   try {
  //     const created = await prisma.management.create({ data });
  //     return httpResponse.http201("Supervisor created", created);
  //   } catch (error) {
  //     return errorService.handleErrorSchema(error);
  //   }
  // }

  async updateWorker(data: any, workerId: number) {
    try {
      const { hire_date, id, ...restData } = data;

      const formatData = {
        ...restData,
        hire_date: new Date(hire_date),
      };
      const updated = await prisma.worker.update({
        where: { id: workerId },
        data: formatData,
      });
      return httpResponse.http200("Worker updated", updated);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async registerTerminationMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          const dateFormat = excelSerialDateToJSDate(item.fecha_cese);

          if (item.dni === "" || item.fecha_cese === "")
            throw new Error("Error in service");

          await prisma.worker.update({
            where: { dni: String(item.dni) },
            data: {
              termination_date: dateFormat,
              reason: item.motivo,
              enabled: "no",
            },
          });
        })
      );
      return httpResponse.http200("Updated");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async updateSupervisorMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          if (item.dni === "") throw new Error("Error in service");

          await prisma.worker.update({
            where: { dni: String(item.dni) },
            data: {
              supervisor: item.supervisor,
              coordinator: item.coordinador,
              management: item.generate_comercial,
            },
          });
        })
      );
      return httpResponse.http200("Updated");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async registerVacationMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          if (
            item.dni === "" ||
            item.fecha_inicio === "" ||
            item.fecha_fin === ""
          )
            throw new Error("Error in service");
          const worker = await workerService.findByDNI(String(item.dni));
          await prisma.vacation.create({
            data: {
              worker_id: worker.content.id,
              start_date: reportService.excelSerialDateToJSDate(
                item.fecha_inicio
              ),
              end_date: reportService.excelSerialDateToJSDate(item.fecha_fin),
              reason: item.contexto,
            },
          });
        })
      );
      return httpResponse.http200("Register vacation successfull!");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async registerLincensesMasive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          if (
            item.dni === "" ||
            item.fecha_inicio === "" ||
            item.fecha_fin === ""
          )
            throw new Error("Error in service");
          const worker = await workerService.findByDNI(String(item.dni));
          await prisma.licence.create({
            data: {
              worker_id: worker.content.id,
              start_date: reportService.excelSerialDateToJSDate(
                item.fecha_inicio
              ),
              end_date: reportService.excelSerialDateToJSDate(item.fecha_fin),
              reason: item.contexto,
            },
          });
        })
      );
      return httpResponse.http200("Register vacation successfull!");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async registerMedicalRestMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          if (
            item.dni === "" ||
            item.fecha_inicio === "" ||
            item.fecha_fin === ""
          )
            throw new Error("Error in service");
          const worker = await workerService.findByDNI(String(item.dni));
          await prisma.medicalRest.create({
            data: {
              worker_id: worker.content.id,
              start_date: reportService.excelSerialDateToJSDate(
                item.fecha_inicio
              ),
              end_date: reportService.excelSerialDateToJSDate(item.fecha_fin),
              reason: item.contexto,
            },
          });
        })
      );
      return httpResponse.http200("Register vacation successfull!");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async registerPermissionsMassive(file: File) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          if (
            item.dni === "" ||
            item.fecha_inicio === "" ||
            item.fecha_fin === ""
          )
            throw new Error("Error in service");
          const worker = await workerService.findByDNI(String(item.dni));
          await prisma.permissions.create({
            data: {
              worker_id: worker.content.id,
              start_date: reportService.excelSerialDateToJSDate(
                item.fecha_inicio
              ),
              end_date: reportService.excelSerialDateToJSDate(item.fecha_fin),
              reason: item.contexto,
            },
          });
        })
      );
      return httpResponse.http200("Register vacation successfull!");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findSupervisors() {
    try {
      const workers = await prisma.worker.findMany();

      return httpResponse.http200("All workers", workers);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }
}

export const workerService = new WorkerService();
