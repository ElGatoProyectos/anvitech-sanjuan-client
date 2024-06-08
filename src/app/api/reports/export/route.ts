import { reportService } from "@/lib/core/service/report.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await reportService.exportToExcel(body);

    return NextResponse.json(response.content, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=report.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
