import { NextResponse } from "next/server";

export async function GET() {
  try {
    setTimeout(() => {}, 3600 * 1000);
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
