import { dataService } from "@/lib/core/service/data.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { token: string } }
) {
  try {
    // validar token

    const date = new Date();
    const response = await dataService.instanceDataInit(
      date.getDate() - 1,
      date.getDate() - 1,
      2024,
      6
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
