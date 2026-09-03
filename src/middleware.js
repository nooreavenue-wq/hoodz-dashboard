import { NextResponse } from "next/server";

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const { nextUrl } = request;

  const isLoggedIn = request.cookies.get("hoodz_Dahboard_token")?.value;

  const isAuthRoute =
    nextUrl.pathname === "/login" ||
    nextUrl.pathname === "/forgot-password" ||
    nextUrl.pathname === "/otp-verification" ||
    nextUrl.pathname === "/set-new-password";

  // Logged in users redirect from /login
  if (isLoggedIn && isAuthRoute)
    return NextResponse.redirect(new URL("/", request.url));

  // Not logged in users redirect from protected routes
  if (!isLoggedIn && !isAuthRoute)
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    // ✅ exclude firebase service worker
    "/((?!api|_next/static|_next/image|favicon.ico|firebase-messaging-sw.js|nouser.png).*)",
    "/admin/:path*",
  ],
};
