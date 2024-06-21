import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

class MedicalRestService {
  async registerMedicalRest(data: any) {
    try {
      const formatData = {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
      };
      const created = await prisma.medicalRest.create({ data: formatData });
      await prisma.$disconnect();
      return httpResponse.http201("Medical rest created", created);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findLasts(workerId: number) {
    try {
      const data = await prisma.medicalRest.findMany({
        where: { worker_id: workerId },
        orderBy: {
          id: "desc",
        },
        take: 5,
      });
      await prisma.$disconnect();
      return httpResponse.http200("Medical rest ", data);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findByWorker(workerId: number) {
    try {
      const data = await prisma.medicalRest.findMany({
        where: { worker_id: workerId },
      });
      await prisma.$disconnect();
      return httpResponse.http200("All Medical rest ", data);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }
}

export const medicalRestService = new MedicalRestService();
