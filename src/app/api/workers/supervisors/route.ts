import { NextRequest, NextResponse } from "next/server";
import { validationAuthV2 } from "../../utils/handleValidation";
import { workerService } from "@/lib/core/service/worker.service";

export async function GET(request: NextRequest) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await workerService.findAllSupervisor();

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
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const body = await request.json();

    const response = await workerService.createSupervisor(body);

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
