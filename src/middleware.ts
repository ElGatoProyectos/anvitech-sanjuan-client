import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export default async function middleware(
  request: NextRequest,
  response: NextResponse
) {
  const { pathname } = request.nextUrl;

  const dev = true;

  const initial = "next-auth.session-token";
  const valorToken = dev ? initial : "__Secure-next-auth.session-token";

  let cookie = request.cookies.get(valorToken)?.value;

  const session = await decode({
    token: cookie,
    secret: process.env.NEXT_AUTH_SECRET || "",
  });

  if (pathname.startsWith("/system") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/system", request.url));
  }

  // if (pathname.startsWith('/intranet/admin')) {
  //     try {

  //         const dataHeader = { token:session.content.token, dni: session.content.dni }

  //         const headers = { 'Content-Type': 'application/json', 'Authorization': JSON.stringify(dataHeader) }

  //         const res = await fetch('https://app-intranet.vercel.app/api/admin/validate',{headers});

  //         if(res.statusText!=='OK'){
  //             return NextResponse.redirect(new URL("/intranet/login", request.url));
  //         }
  //     } catch (error) {
  //         return NextResponse.redirect(new URL("/intranet/login", request.url));
  //     }

  // }

  // if (pathname.startsWith('/intranet/alumno')) {

  //     try {

  //         const dataHeader = { token:session.content.token, dni: session.content.dni }

  //         const headers = { 'Content-Type': 'application/json', 'Authorization': JSON.stringify(dataHeader) }

  //         const res = await fetch('https://app-intranet.vercel.app/api/students/validate',{headers});

  //         if(res.statusText!=='OK'){
  //             return NextResponse.redirect(new URL("/intranet/login", request.url));
  //         }
  //     } catch (error) {
  //         return NextResponse.redirect(new URL("/intranet/login", request.url));
  //     }

  // }

  // if (pathname.startsWith('/intranet/tutor')) {

  //     try {

  //         const dataHeader = { token:session.content.token, dni: session.content.dni }

  //         const headers = { 'Content-Type': 'application/json', 'Authorization': JSON.stringify(dataHeader) }

  //         const res = await fetch('https://app-intranet.vercel.app/api/tutors/validate',{headers});

  //         if(res.statusText!=='OK'){
  //             return NextResponse.redirect(new URL("/intranet/login", request.url));
  //         }
  //     } catch (error) {
  //         return NextResponse.redirect(new URL("/intranet/login", request.url));
  //     }
  // }
}
