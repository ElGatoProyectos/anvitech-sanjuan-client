import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

class ScheduleService {
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
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }
}

export const scheduleService = new ScheduleService();
