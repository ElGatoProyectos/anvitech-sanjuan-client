import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { incidentService } from "@/lib/core/service/incident.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await incidentService.deleteIncidentAbsolute(
      Number(context.params.id)
    );

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
