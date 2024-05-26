import { pool } from "@/lib/database/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = (await pool.query("SELECT *from dam")) as any;
    console.log(result);
    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" });
  }
}
