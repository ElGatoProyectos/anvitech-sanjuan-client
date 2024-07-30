import { userService } from "@/lib/core/service/user.service";
import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/core/service/auth.service";
import { validationAuth, validationAuthV2 } from "../utils/handleValidation";

export async function GET(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const responseUser = await userService.findAll();

    return NextResponse.json(responseUser.content, {
      status: responseUser.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.json();

    const responseUser = await userService.createUser(body);

    return NextResponse.json(responseUser.content, {
      status: responseUser.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
