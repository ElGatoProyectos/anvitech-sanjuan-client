import { reportService } from "@/lib/core/service/report.service";
import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;
    const body = await request.json();

    const response = await reportService.dataForExportNormal(
      new Date(body.min),
      new Date(body.max)
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
