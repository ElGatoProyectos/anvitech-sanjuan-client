import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { reportService } from "@/lib/core/service/report.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;
    const body = await request.json();

    const response = await reportService.updateHours(
      Number(context.params.id),
      body
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
