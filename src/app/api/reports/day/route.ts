import { dataService } from "@/lib/core/service/data.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
