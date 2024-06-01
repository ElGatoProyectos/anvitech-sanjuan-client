import prisma from "@/lib/prisma";
import { httpResponse } from "./response.service";
import { errorService } from "./errors.service";

class IncidentService {
  async findAll() {
    try {
      const incidents = await prisma.incident.findMany();
      return httpResponse.http200("All incidents", incidents);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findById(id: number) {
    try {
      const incident = await prisma.incident.findFirst({ where: { id } });
      if (!incident) return httpResponse.http404("Incident not found");
      return httpResponse.http200("Incident found", incident);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async create(data: any) {
    try {
      console.log("======", data);
      const created = await prisma.incident.create({ data });
      console.log(created);
      return httpResponse.http201("Incidente created", created);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }

  async update(data: any, id: number) {
    try {
      const updated = await prisma.incident.update({ where: { id }, data });
      return httpResponse.http200("Incident updated", updated);
    } catch (error) {
      console.log(error);
      return errorService.handleErrorSchema(error);
    }
  }
}

export const incidentService = new IncidentService();
