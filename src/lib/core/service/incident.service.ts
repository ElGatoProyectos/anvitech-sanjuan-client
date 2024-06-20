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
      const formatData = {
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
      };
      const created = await prisma.incident.create({ data: formatData });

      return httpResponse.http201("Incidente created", created);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async update(data: any, id: number) {
    try {
      const formatData = {
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
      };
      const updated = await prisma.incident.update({
        where: { id },
        data: formatData,
      });
      return httpResponse.http200("Incident updated", updated);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async findIncidentesAbsolute() {
    try {
      const incidents = await prisma.incidentAbsolute.findMany();

      return httpResponse.http200("Incidentes found", incidents);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async createIncidenteAbsolute(data: any) {
    try {
      const formatData = {
        description: data.description,
        date: new Date(data.date).toISOString(),
      };

      const created = await prisma.incidentAbsolute.create({
        data: formatData,
      });

      return httpResponse.http201("Incidente created", created);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async deleteIncidentAbsolute(id: number) {
    try {
      const deleted = await prisma.incidentAbsolute.delete({
        where: { id },
      });

      return httpResponse.http201("Incidente deleted", deleted);
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }
}

export const incidentService = new IncidentService();
