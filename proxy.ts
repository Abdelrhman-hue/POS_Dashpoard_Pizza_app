
import authConfig from "./auth.config"
import { NextResponse } from "next/server";
import NextAuth from "next-auth"

export const { auth: proxy } = NextAuth(authConfig)
const authRoutes =["/Auth/login","/Auth/register"]
const routessave =["/profile"]

export default proxy((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname
  const isloggedORnot:boolean = Boolean(req.auth) 
  if(authRoutes.includes(pathname) && isloggedORnot){
    return NextResponse.redirect(new URL("/profile",nextUrl))
  }
  if(routessave.includes(pathname) && !isloggedORnot){
    return NextResponse.redirect(new URL("/Auth/login",nextUrl))
  }
});

export const config = {
  matcher: ["/Auth/login","/Auth/register","/profile"],
};
