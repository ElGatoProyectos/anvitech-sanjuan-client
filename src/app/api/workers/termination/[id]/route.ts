import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { workerService } from "@/lib/core/service/worker.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.json();

    const response = await workerService.updateTerminationDate(
      body,
      Number(context.params.id)
    );

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
