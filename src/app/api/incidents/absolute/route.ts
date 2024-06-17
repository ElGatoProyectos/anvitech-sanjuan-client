import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";
import { incidentService } from "@/lib/core/service/incident.service";

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const incident = await request.json();

    const responseCreate = await incidentService.createIncidenteAbsolute(
      incident
    );

    return NextResponse.json(responseCreate.content, {
      status: responseCreate.statusCode,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await incidentService.findIncidentesAbsolute();

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
