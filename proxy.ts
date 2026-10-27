import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const authRoutes = [
  "/Auth/login",
  "/Auth/register",
  "/forget-password",
  "/verify",
  "/reset-password",
];
const protectedRoutes = ["/profile", "/profile/edit-profile"];

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = Boolean(req.auth);
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;

  // Logged-in users visiting auth pages (login, register, etc.) -> redirect to profile
  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/profile", nextUrl));
  }

  // Protected user routes
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/Auth/login", nextUrl));
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/Auth/login", nextUrl));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: [
    "/Auth/login",
    "/Auth/register",
    "/profile/:path*",
    "/forget-password",
    "/verify",
    "/reset-password",
    "/admin/:path*",
  ],
};
