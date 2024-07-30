import { NextRequest, NextResponse } from "next/server";
import { validationAuth, validationAuthV2 } from "../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";
import { incidentService } from "@/lib/core/service/incident.service";

export async function GET(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await incidentService.findAll();

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;

    const incident = await request.json();

    const responseCreate = await incidentService.create(incident);

    return NextResponse.json(responseCreate.content, {
      status: responseCreate.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
