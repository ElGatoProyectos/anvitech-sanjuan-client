import { dataService } from "@/lib/core/service/data.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const day = date.getDay();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (hour === 23 && minute > 25) {
      //exute function
    }

    const response = await dataService.instanceDataInit(11, 11, 2024, 6);
    return NextResponse.json(response.content, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
