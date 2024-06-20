import { dataService } from "@/lib/core/service/data.service";
import { reportService } from "@/lib/core/service/report.service";
import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";

export async function GET(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const response = await dataService.instanceDataInit(
      currentDay,
      currentDay,
      currentYear,
      currentMonth,
      false
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const dayBody = Number(body.day);
    const monthBody = Number(body.month) - 1;
    const yearBody = Number(body.year);

    const dateBody = new Date(yearBody, monthBody, dayBody);

    const currentDate = new Date();
    const currentDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (dateBody < currentDateOnly) {
      const response = await reportService.generateReportForDayNoToday(
        dayBody,
        monthBody + 1,
        yearBody
      );
      return NextResponse.json(response.content, {
        status: response.statusCode,
      });
    } else {
      const response = await dataService.instanceDataInit(
        dayBody,
        dayBody,
        yearBody,
        monthBody + 1,
        false
      );
      return NextResponse.json(response.content, {
        status: response.statusCode,
      });
    }
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
