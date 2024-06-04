import { NextRequest, NextResponse } from "next/server";
import { validationAuth, validationAuthV2 } from "../../utils/handleValidation";
import { reportService } from "@/lib/core/service/report.service";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const responseDetail = await reportService.findDetailReport(
      Number(context.params.id)
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
