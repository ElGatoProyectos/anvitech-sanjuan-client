import { NextRequest, NextResponse } from "next/server";
import { validationAuth } from "../../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";
import { incidentService } from "@/lib/core/service/incident.service";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
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

    const response = await incidentService.findById(Number(context.params.id));

    console.log(response);

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
    const session = await validationAuth(request);

    if (!session.auth)
      return NextResponse.json(
        { message: "Error in authentication" },
        {
          status: 401,
        }
      );

    // todo return error validation role
    const responseValidations = await authService.validationAdmin(
      session.payload
    );

    if (!responseValidations.ok)
      return NextResponse.json(responseValidations.content, {
        status: responseValidations.statusCode,
      });

    const { incident, password } = await request.json();

    // todo validation admin=============================================================

    const responseLogin = await authService.login({
      username: session.payload.user.username,
      password,
    });
    if (!responseLogin.ok)
      return NextResponse.json(responseLogin.content, {
        status: responseLogin.statusCode,
      });

    // todo proccess logic
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
