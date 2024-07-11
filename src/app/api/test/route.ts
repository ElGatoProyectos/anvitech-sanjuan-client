import { dataService } from "@/lib/core/service/data.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const date = new Date();
    // date.getDate() - 1,
    //   date.getDate() - 1,
    const response = await dataService.instanceDataInit(19, 19, 2024, 6);
    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
