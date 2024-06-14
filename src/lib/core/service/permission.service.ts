import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

class PermissionService {
  async findAll() {
    try {
    } catch (error) {}
  }

  async findLasts(workerId: number) {
    try {
      const vacations = await prisma.permissions.findMany({
        where: { worker_id: workerId },
        orderBy: {
          id: "desc",
        },
        take: 5,
      });

      return httpResponse.http200("Permissions", vacations);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findByWorker(workerId: number) {
    try {
      const vacations = await prisma.permissions.findMany({
        where: { worker_id: workerId },
      });
      return httpResponse.http200("All permissions", vacations);
    } catch (error) {
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
      const vacations = await prisma.permissions.create({ data: formatData });
      return httpResponse.http200("Permission created", vacations);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }
}

export const permissionService = new PermissionService();
