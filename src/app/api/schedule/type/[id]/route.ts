import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { scheduleService } from "@/lib/core/service/schedule.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const data = await request.json();

    const responseUpdated = await scheduleService.updateTypeSchedule(
      Number(context.params.id),
      data
    );

    return NextResponse.json(responseUpdated.content, {
      status: responseUpdated.statusCode,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
