import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../utils/handleValidation";
import { vacationService } from "@/lib/core/service/vacation.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.json();

    const response = await vacationService.create(body);

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
