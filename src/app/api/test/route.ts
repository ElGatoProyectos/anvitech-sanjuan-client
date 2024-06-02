import { dataService } from "@/lib/core/service/data.service";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
    console.log(res);

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
