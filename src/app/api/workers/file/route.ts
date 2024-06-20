import { NextRequest, NextResponse } from "next/server";
import { validationAuth, validationAuthV2 } from "../../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.formData();
    const file = body.get("file") as File;

    const response = await workerService.fileToRegisterMassive(file);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
