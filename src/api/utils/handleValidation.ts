import { authService } from "@/lib/core/service/auth.service";
import { decode } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function validationAuth(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")?.value as any;

  if (!token) return { auth: false, payload: null };

  const sessionCookie = await decode({
    token,
    secret: process.env.NEXT_AUTH_SECRET || "",
  });

  // todo session headers

  const headersList = headers();
  const sessionHeaderString = headersList.get("session") as any;

  if (!sessionHeaderString) return { auth: false, payload: null };
  const sessionJson = JSON.parse(sessionHeaderString);

  return { auth: true, payload: sessionJson };
}

export async function validationAuthV2(request: NextRequest, role: string) {
  try {
    /// validation cookies
    const token = request.cookies.get("next-auth.session-token")?.value as any;

    if (!token)
      return NextResponse.json(
        { message: "Error in authorization " },
        {
          status: 401,
        }
      );

    const sessionCookie = await decode({
      token,
      secret: process.env.NEXT_AUTH_SECRET || "",
    });

    /// session headers

    const headersList = headers();
    const sessionHeaderString = headersList.get("session") as any;

    if (!sessionHeaderString)
      return NextResponse.json(
        { message: "Error in authorization " },
        {
          status: 401,
        }
      );
    const sessionJson = JSON.parse(sessionHeaderString);

    /// validation role

    if (role === "admin") {
      const responseValidations = await authService.validationAdmin(
        sessionJson
      );
      if (!responseValidations.ok)
        return NextResponse.json(responseValidations.content, {
          status: responseValidations.statusCode,
        });
    } else if (role === "user") {
      const responseValidations = await authService.validationUser(sessionJson);
      if (!responseValidations.ok)
        return NextResponse.json(responseValidations.content, {
          status: responseValidations.statusCode,
        });
    } else {
      return NextResponse.json(
        { message: "Error in authorization " },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(sessionJson, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
