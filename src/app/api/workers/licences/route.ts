import { NextRequest, NextResponse } from "next/server";
import { workerService } from "@/lib/core/service/worker.service";
import { validationAuthV2 } from "../../utils/handleValidation";
import { licenceService } from "@/lib/core/service/licence.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.json();

    const response = await licenceService.registerLicence(body);

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
