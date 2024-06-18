import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";
import { workerService } from "@/lib/core/service/worker.service";
import { medicalRestService } from "@/lib/core/service/medical-rest.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.json();

    const response = await medicalRestService.registerMedicalRest(body);

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
