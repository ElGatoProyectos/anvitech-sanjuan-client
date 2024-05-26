import { userService } from "@/lib/core/service/user.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await userService.findAll();

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(
      { mesage: "Error in code" },
      {
        status: 500,
      }
    );
  }
}
