import { NextApiRequest } from "next";
import { validationAuthV2 } from "../../utils/handleValidation";
import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/core/service/user.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.formData();
    const file = body.get("file") as File;

    const response = await userService.registerMassive(file);
    console.log(response);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
