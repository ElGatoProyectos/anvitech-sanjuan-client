import { NextRequest, NextResponse } from "next/server";
import { validationAuth } from "../utils/handleValidation";
import { authService } from "@/lib/core/service/auth.service";
import { anvizService } from "@/lib/core/service/anviz.service";
import { dataService } from "@/lib/core/service/data.service";
import { reportService } from "@/lib/core/service/report.service";

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
    const responseValidations = await authService.validationAdmin(
      session.payload
    );
    if (!responseValidations.ok)
      return NextResponse.json(responseValidations.content, {
        status: responseValidations.statusCode,
      });

    // todo proccess logic ===================================
    const body = await request.json();

    console.log("body==================", body);

    const responseAuth = await authService.login(body);

    if (!responseAuth.ok)
      return NextResponse.json(responseAuth.content, {
        status: responseAuth.statusCode,
      });

    // todo generate report ==================================
    // todo this method is slow
    const responseData = await dataService.instanceDataInit();
    return NextResponse.json(responseData, {
      status: responseData.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

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
    // todo return error validation role
    const responseValidations = await authService.validationUser(
      session.payload
    );
    if (!responseValidations.ok)
      return NextResponse.json(responseValidations.content, {
        status: responseValidations.statusCode,
      });

    const responseReports = await reportService.findAll();

    return NextResponse.json(responseReports.content, {
      status: responseReports.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
