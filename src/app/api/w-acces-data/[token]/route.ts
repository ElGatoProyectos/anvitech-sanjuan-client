import { dataService } from "@/lib/core/service/data.service";
import { reportService } from "@/lib/core/service/report.service";
import { userService } from "@/lib/core/service/user.service";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { token: string } }
) {
  try {
    const token = jwt.verify(
      context.params.token,
      process.env.VRF_TOKEN_VALIDATION as string
    ) as any;

    const response = await userService.findByDni(token.dni);

    if (response.ok && response.content.role === "superadmin") {
      const date = new Date();
      const daysOfWeek = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];

      const dia = date.getDay();
      const dayString = daysOfWeek[dia];

      if (dayString !== "domingo") {
        await dataService.instanceDataInit(
          date.getDate() - 1,
          date.getDate() - 1,
          date.getMonth() + 1,
          date.getDate()
        );
      }

      return NextResponse.json(
        { message: "Api executed successfull" },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { message: "Error" },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
