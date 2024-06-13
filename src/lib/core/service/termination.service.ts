import prisma from "@/lib/prisma";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

class TerminationService {
  async findAll() {
    try {
      const terminations = await prisma.typeTermination.findMany();
      return httpResponse.http200("All terminations", terminations);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async create(data: any) {
    try {
      const terminations = await prisma.typeTermination.create({ data });
      return httpResponse.http200("Termination created", terminations);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async update(data: any, terminationId: number) {
    try {
      const terminations = await prisma.typeTermination.update({
        where: { id: terminationId },
        data,
      });
      return httpResponse.http200("Update termination", terminations);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }
}

export const terminationService = new TerminationService();
