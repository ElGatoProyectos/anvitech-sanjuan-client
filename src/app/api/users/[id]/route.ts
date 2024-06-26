import { userService } from "@/lib/core/service/user.service";
import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    /// call service action
    const responseUser = await userService.findById(context.params.id);
    return NextResponse.json(responseUser.content, {
      status: responseUser.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;
    const body = await request.json();

    /// call service action
    const responseUser = await userService.updateUser(
      body,
      Number(context.params.id)
    );
    return NextResponse.json(responseUser.content, {
      status: responseUser.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await userService.deleteUser(Number(context.params.id));

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
