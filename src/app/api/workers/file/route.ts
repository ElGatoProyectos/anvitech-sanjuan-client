import { NextRequest, NextResponse } from "next/server";
import { validationAuth } from "../../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";

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

    const body = await request.formData();
    const file = body.get("file") as File;
    const password = body.get("password") as string;

    /// validation for password
    const responseLogin = await authService.login({
      username: session.payload.user.username,
      password,
    });
    if (!responseLogin.ok)
      return NextResponse.json(responseLogin.content, {
        status: responseLogin.statusCode,
      });

    /// upload file

    const response = await workerService.fileToRegisterMassive(file);

    return NextResponse.json(
      { message: "ok" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
