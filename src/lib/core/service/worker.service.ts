import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

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
}

export const workerService = new WorkerService();
