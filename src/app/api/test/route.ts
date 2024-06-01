import { dataService } from "@/lib/core/service/data.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await dataService.captureDataForDay("", 31, 12, 2024);

    return NextResponse.json(
      { message: "ok" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
