import { redis } from "@/app/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    let isLogin = await redis.get(`isLogin:userId:${userId}`);
    if (isLogin) {
      return NextResponse.json({
        message: "User is logged in",
        success: true,
      });
    } else return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
