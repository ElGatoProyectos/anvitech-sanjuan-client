import { validationAuthV2 } from "@/app/api/utils/handleValidation";
import { licenceService } from "@/lib/core/service/licence.service";
import { medicalRestService } from "@/lib/core/service/medical-rest.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const responseAuth = await validationAuthV2(request, "admin");
    if (responseAuth.status !== 200) return responseAuth;

    const response = await medicalRestService.findLasts(
      Number(context.params.id)
    );

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
