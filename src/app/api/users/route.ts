import { httpResponse } from "@/lib/core/service/response.service";
import { userService } from "@/lib/core/service/user.service";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextApiRequest) {
  try {
    const session = await getServerSession(request);
    console.log(session);
  } catch (error) {}
}

export async function POST(request: any) {
  try {
    const session = await getServerSession(request);
    // if(session?.user.role==="admin"){

    // }else{

    // }
    const data = await request.json();
    console.log(data);
    // const response = await userService.createUser(data);
    const response = httpResponse.http200();
    return NextResponse.json(response, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
