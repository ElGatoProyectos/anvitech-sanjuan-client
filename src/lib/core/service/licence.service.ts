import prisma from "@/lib/prisma";
import { httpResponse } from "./response.service";
import { errorService } from "./errors.service";

class LicenceService {
  async registerLicence(data: any) {
    try {
      const formatData = {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
      };
      const created = await prisma.licence.create({ data: formatData });
      await prisma.$disconnect();
      return httpResponse.http201("Lincence created", created);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findLasts(workerId: number) {
    try {
      const data = await prisma.licence.findMany({
        where: { worker_id: workerId },
        orderBy: {
          id: "desc",
        },
        take: 5,
      });
      await prisma.$disconnect();
      return httpResponse.http200("Licences", data);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findByWorker(workerId: number) {
    try {
      const data = await prisma.permissions.findMany({
        where: { worker_id: workerId },
      });
      await prisma.$disconnect();
      return httpResponse.http200("All licences", data);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }
}

export const licenceService = new LicenceService();
