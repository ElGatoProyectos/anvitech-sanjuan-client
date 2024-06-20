import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";
import { workerService } from "@/lib/core/service/worker.service";
import { scheduleService } from "@/lib/core/service/schedule.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.formData();
    const file = body.get("file") as File;

    const response = await scheduleService.registerMassive(file);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
