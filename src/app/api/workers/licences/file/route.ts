import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { workerService } from "@/lib/core/service/worker.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.formData();
    const file = body.get("file") as File;

    const response = await workerService.registerLincensesMasive(file);

    return NextResponse.json(response, {
      status: response.statusCode,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
