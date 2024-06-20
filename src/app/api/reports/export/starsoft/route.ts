import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { reportService } from "@/lib/core/service/report.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;
    const body = await request.json();
    const { month } = body;
    const year = new Date().getFullYear();

    const response = await reportService.dataForStartSoft(Number(month), year);
    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
