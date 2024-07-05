import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname !== "/login") {
    const isTokenExist = request.cookies.has("ckWebAuthToken");

    if (!isTokenExist) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname === "/login") {
    const isTokenExist = request.cookies.has("ckWebAuthToken");

    if (isTokenExist) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
