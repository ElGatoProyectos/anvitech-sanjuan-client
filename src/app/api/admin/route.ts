import { userService } from "@/lib/core/service/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Here admin api");
    const data = await request.json();
    const response = await userService.createAdmin(data);

    console.log(response);

    return NextResponse.json(response, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
