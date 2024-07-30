import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { vacationService } from "@/lib/core/service/vacation.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await vacationService.findLasts(Number(context.params.id));

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
