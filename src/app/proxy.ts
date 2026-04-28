import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    let cookieStore = req.cookies;
    let authToken = cookieStore.get("authToken")?.value;
    if (!SECRET_KEY) throw new Error("Secret Key not found!");
    if (!authToken) return NextResponse.redirect(new URL("/login", req.url));
    if ((authToken && req.nextUrl.pathname == "/login") || "/signup")
      return NextResponse.redirect(new URL("/", req.url));
    const decode = jwt.verify(authToken, SECRET_KEY);
    if (!decode) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: ["/", "/profile"],
};
