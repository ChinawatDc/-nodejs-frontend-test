import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const ignorePaths = ["/auth", "/login", "/bypass"];
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (ignorePaths.includes(pathname)) {
    return NextResponse.next();
  }
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
