import { NextRequest, NextResponse } from "next/server";
import { validationAuth } from "../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";
import { incidentService } from "@/lib/core/service/incident.service";

export async function GET(request: NextRequest) {
  try {
    const session = await validationAuth(request);

    if (!session.auth)
      return NextResponse.json(
        { message: "Error in authentication" },
        {
          status: 401,
        }
      );

    const responseValidations = await authService.validationUser(
      session.payload
    );
    if (!responseValidations.ok)
      return NextResponse.json(responseValidations.content, {
        status: responseValidations.statusCode,
      });

    // todo logic

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
    const session = await validationAuth(request);

    if (!session.auth)
      return NextResponse.json(
        { message: "Error in authentication" },
        {
          status: 401,
        }
      );
    // todo return error validation role
    const responseValidations = await authService.validationUser(
      session.payload
    );
    if (!responseValidations.ok)
      return NextResponse.json(responseValidations.content, {
        status: responseValidations.statusCode,
      });

    const { incident, password } = await request.json();

    const responseLogin = await authService.login({
      username: session.payload.user.username,
      password,
    });

    if (!responseLogin.ok)
      return NextResponse.json(responseLogin.content, {
        status: responseLogin.statusCode,
      });

    // todo proccess logic
    const responseCreate = await incidentService.create(incident);

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
