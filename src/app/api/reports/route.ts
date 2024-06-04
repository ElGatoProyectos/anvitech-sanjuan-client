import { NextRequest, NextResponse } from "next/server";
import { validationAuth, validationAuthV2 } from "../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { anvizService } from "@/lib/core/service/anviz.service";
import { dataService } from "@/lib/core/service/data.service";
import { reportService } from "@/lib/core/service/report.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const responseData = await dataService.instanceDataInit();

    return NextResponse.json(responseData, {
      status: responseData.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const responseReports = await reportService.findAll();

    return NextResponse.json(responseReports.content, {
      status: responseReports.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
