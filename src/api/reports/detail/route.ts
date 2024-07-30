import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";
import { reportService } from "@/lib/core/service/report.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;
    const body = await request.json();
    const responseDetail = await reportService.findReportByWorker(
      Number(body.reportId),
      String(body.dni)
    );

    return NextResponse.json(responseDetail.content, {
      status: responseDetail.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
