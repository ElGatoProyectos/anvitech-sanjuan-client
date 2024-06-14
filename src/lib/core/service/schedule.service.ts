import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";
import * as xlsx from "xlsx";
import { formatSheduleDto } from "../schemas/shedule.dto";
import { workerService } from "./worker.service";

class ScheduleService {
  async findAll() {
    try {
      const schedules = await prisma.schedule.findMany({
        include: {
          worker: true,
        },
      });
      return httpResponse.http200("All schedules", schedules);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findScheduleForWorker(workerId: number) {
    try {
      const schedule = await prisma.schedule.findFirst({
        where: { worker_id: workerId },
      });

      if (!schedule) return httpResponse.http404("Schedule not found");
      return httpResponse.http200("Schedule worker", schedule);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async createScheduleMassive(data: any) {
    try {
      const created = await prisma.schedule.create({ data });
      return httpResponse.http200("Schedule created", created);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async createScheduleForWorker(data: any) {
    try {
      const dataSet = {
        worker_id: Number(data.workerId),
        lunes: data.schedule[0].hours.start + "-" + data.schedule[0].hours.end,
        martes: data.schedule[1].hours.start + "-" + data.schedule[1].hours.end,
        miercoles:
          data.schedule[2].hours.start + "-" + data.schedule[2].hours.end,
        jueves: data.schedule[3].hours.start + "-" + data.schedule[3].hours.end,
        viernes:
          data.schedule[4].hours.start + "-" + data.schedule[4].hours.end,
        sabado: data.schedule[5].hours.start + "-" + data.schedule[5].hours.end,
        domingo: "",
        comments: data.comments,
      };

      const scheduleResponse = await this.findScheduleForWorker(
        Number(data.workerId)
      );
      if (!scheduleResponse.ok) {
        console.log("Creando........");
        const created = await prisma.schedule.create({ data: dataSet });
        return httpResponse.http201("Schedule created", created);
      } else {
        console.log("Modificando........");

        const updated = await prisma.schedule.update({
          where: { worker_id: Number(data.workerId) },
          data: dataSet,
        });
        return httpResponse.http201("Schedule updated", updated);
      }
    } catch (error) {
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

      const exampleData = sheetToJson[0];

      formatSheduleDto.parse(exampleData);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          const worker = await workerService.findByDNI(item.dni);

          const format = {
            worker_id: worker.content.id,
            lunes: item.lunes,
            martes: item.martes,
            miercoles: item.miercoles,
            jueves: item.juves,
            viernes: item.viernes,
            sabado: item.sabado,
            domingo: item.domingo,
            comments: "",
            type: "default",
          };

          await prisma.schedule.update({
            where: { worker_id: worker.content.id },
            data: format,
          });
        })
      );

      return httpResponse.http201("Workers updated");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  // =================

  async findTypeSchedule() {
    try {
      const typesSchedules = await prisma.typeSchedule.findMany();
      return httpResponse.http200("All types schedules", typesSchedules);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async createTypeSchedule(data: any) {
    try {
      console.log(data);
      const created = await prisma.typeSchedule.create({ data });
      return httpResponse.http200("Type schedule creayed", created);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async updateTypeSchedule(typScheduleId: number, data: any) {
    try {
      const updatedTypeSchedule = await prisma.typeSchedule.update({
        where: { id: typScheduleId },
        data,
      });
      return httpResponse.http200("Type schedule updated", updatedTypeSchedule);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }
}

export const scheduleService = new ScheduleService();
