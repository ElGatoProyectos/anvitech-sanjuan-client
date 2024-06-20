import { dataService } from "@/lib/core/service/data.service";
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
      await dataService.instanceDataInit(
        date.getDate() - 1,
        date.getDate() - 1,
        2024,
        6
      );
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
