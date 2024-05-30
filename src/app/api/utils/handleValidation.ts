import { decode } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

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
