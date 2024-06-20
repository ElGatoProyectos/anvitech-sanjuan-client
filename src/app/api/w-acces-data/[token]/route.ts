import { dataService } from "@/lib/core/service/data.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { token: string } }
) {
  try {
    const date = new Date();
    await dataService.instanceDataInit(
      date.getDate() - 1,
      date.getDate() - 1,
      2024,
      6
    );
    return NextResponse.json(
      { message: "Api executed successfull" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
