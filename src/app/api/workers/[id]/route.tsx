import { NextRequest, NextResponse } from "next/server";
import { validationAuth } from "../../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { workerService } from "@/lib/core/service/worker.service";

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

    const response = await workerService.findById(Number(context.params.id));

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
