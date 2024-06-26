import prisma from "@/lib/prisma";
import { httpResponse } from "./response.service";
import { errorService } from "./errors.service";
import {
  createUserDTO,
  formatUserDTO,
  updateUserDTO,
} from "../schemas/user.dto";
import * as xlsx from "xlsx";

import bcrypt from "bcrypt";
import { formatSheduleDto } from "../schemas/shedule.dto";

class UserService {
  async findAll() {
    try {
      const users = await prisma.user.findMany();
      await prisma.$disconnect();
      return httpResponse.http200("Users found", users);
    } catch (error) {
      await prisma.$disconnect();
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findByDni(dni: string) {
    try {
      const user = await prisma.user.findFirst({ where: { dni } });
      await prisma.$disconnect();
      return httpResponse.http200("User found", user);
    } catch (error) {
      await prisma.$disconnect();
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findById(id: number) {
    try {
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) return httpResponse.http404("User not found");
      await prisma.$disconnect();
      return httpResponse.http200("User found", user);
    } catch (error) {
      await prisma.$disconnect();
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async findUserByUsername(username: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { username },
      });
      if (!user) return httpResponse.http400("User not found");
      await prisma.$disconnect();
      return httpResponse.http200("User found", user);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async createUser(data: any) {
    try {
      createUserDTO.parse(data);

      const password = bcrypt.hashSync(data.dni, 11);

      const dataSet = {
        full_name: data.full_name,
        dni: data.dni,
        email: data.email,
        password,
        username: data.dni,
        enabled: true,
        role: "user",
      };
      const created = await prisma.user.create({ data: dataSet });
      await prisma.$disconnect();
      return httpResponse.http201("User created ok!", created);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async updateUser(data: any, userId: number) {
    try {
      // updateUserDTO.parse(data);

      let updatedUser;

      if (data.password === "") {
        const { passowrd, ...allData } = data;
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: allData,
        });
      } else {
        const formatData = {
          ...data,
          password: bcrypt.hashSync(data.password, 11),
        };

        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: formatData,
        });
      }

      await prisma.$disconnect();
      return httpResponse.http200("User updated ok!", updatedUser);
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async deleteUser(userId: number) {
    try {
      const deleted = await prisma.user.delete({
        where: { id: userId },
      });
      await prisma.$disconnect();
      return httpResponse.http200("User deleted ok!");
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }

  async createAdmin(data: any) {
    try {
      const { validate } = data;
      if (validate === "1234abc") {
        const admin = {
          full_name: "REBECA BEATRIZ TUMBA PEREZ",
          dni: "72913930",
          email: "admin@gmail.com",
          password: bcrypt.hashSync("72913930", 11),
          username: "72913930",
          enabled: true,
          role: "admin",
        };

        const admin2 = {
          full_name: "JOSE FERNANDO ROJAS RUIZ",
          dni: "45843270",
          email: "admin@gmail.com",
          password: bcrypt.hashSync("45843270", 11),
          username: "45843270",
          enabled: true,
          role: "admin",
        };

        const superadmin = {
          full_name: "ELVA HONORIO ROJAS",
          dni: "10160437",
          email: "elva.honorio@digimax.pe",
          password: bcrypt.hashSync("10160437", 11),
          username: "10160437",
          enabled: true,
          role: "superadmin",
        };

        await prisma.user.create({ data: admin });
        await prisma.user.create({ data: admin2 });

        await prisma.user.create({ data: superadmin });
      }
      await prisma.$disconnect();
      return httpResponse.http201("Admins created");
    } catch (error) {
      await prisma.$disconnect();
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

      // formatUserDTO.parse(exampleData);

      await Promise.all(
        sheetToJson.map(async (item: any) => {
          const password = bcrypt.hashSync(String(item.dni), 11);
          const format = {
            full_name: item.nombres,
            dni: item.dni,
            phone: item.celular,
            email: item.correo,
            username: String(item.dni),
            password,
            role: item.rol,
            enabled: true,
          };

          await prisma.user.create({
            data: format,
          });
        })
      );
      await prisma.$disconnect();
      return httpResponse.http201("Users created");
    } catch (error) {
      await prisma.$disconnect();
      return errorService.handleErrorSchema(error);
    }
  }
}

export const userService = new UserService();
