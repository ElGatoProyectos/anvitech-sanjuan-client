import { NextRequest, NextResponse } from "next/server";
import { validationAuth, validationAuthV2 } from "../../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";
import { incidentService } from "@/lib/core/service/incident.service";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await incidentService.findById(Number(context.params.id));

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const incident = await request.json();

    const responseUpdated = await incidentService.update(
      incident,
      Number(context.params.id)
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
