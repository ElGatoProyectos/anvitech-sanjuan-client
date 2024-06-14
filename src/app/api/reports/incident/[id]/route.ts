import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { reportService } from "@/lib/core/service/report.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    console.log("hereeeeeeee");
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;
    const responseDetail = await reportService.findIncidentsForDetail(
      Number(context.params.id)
    );

    return NextResponse.json(responseDetail.content, {
      status: responseDetail.statusCode,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "user");
    if (responseAuth.status !== 200) return responseAuth;
    const responseDetail = await reportService.deleteIncident(
      Number(context.params.id)
    );

    return NextResponse.json(responseDetail.content, {
      status: responseDetail.statusCode,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
