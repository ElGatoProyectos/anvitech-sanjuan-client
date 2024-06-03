import { NextRequest, NextResponse } from "next/server";
import { validationAuth } from "../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";

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

    const response = await workerService.findAll();

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

export async function POST(request: NextRequest) {
  try {
    /// validation auth
    const session = await validationAuth(request);

    if (!session.auth)
      return NextResponse.json(
        { message: "Error in authentication" },
        {
          status: 401,
        }
      );

    /// todo return error validation role
    const responseValidations = await authService.validationAdmin(
      session.payload
    );

    if (!responseValidations.ok)
      return NextResponse.json(responseValidations.content, {
        status: responseValidations.statusCode,
      });

    /// capture data from body

    const body = await request.json();

    /// validation for password
    const responseLogin = await authService.login({
      username: session.payload.user.username,
      password: body.password,
    });
    if (!responseLogin.ok)
      return NextResponse.json(responseLogin.content, {
        status: responseLogin.statusCode,
      });

    /// upload file

    const response = await workerService.create(body.dataWorker);

    return NextResponse.json(response.content, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
