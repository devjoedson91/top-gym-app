import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("@topgym.token")?.value;

  const signURL = new URL("/", request.url);
  const menuURL = new URL("/screen-navigation", request.url);

  if (!token) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(signURL);
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(menuURL);
  }
}

export const config = {
  matcher: ["/", "/screen-navigation/:path*"],
};
