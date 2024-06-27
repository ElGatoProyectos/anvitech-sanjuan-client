import { dataService } from "@/lib/core/service/data.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const date = new Date();
    // date.getDate() - 1,
    //   date.getDate() - 1,
    console.log("in method api");
    const response = await dataService.instanceDataInit(20, 20, 2024, 6);
    console.log(response);
    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
