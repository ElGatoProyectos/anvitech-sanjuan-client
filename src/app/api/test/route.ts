import { anvizService } from "@/lib/core/service/anviz.service";
import { dataService } from "@/lib/core/service/data.service";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await dataService.instanceDataInit(30, 30, 2024, 5);
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
