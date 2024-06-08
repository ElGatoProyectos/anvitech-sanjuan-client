import { dataService } from "@/lib/core/service/data.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    console.log(currentDay, currentMonth, currentYear);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    const response = await dataService.instanceDataInit(
      Number(body.day),
      Number(body.day),
      Number(body.year),
      Number(body.month),
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
