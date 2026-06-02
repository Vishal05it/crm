import { redis } from "@/app/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    await redis.del(`profileData:userId:${userId}`);
    return NextResponse.json({
      message: "Cache updated",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    let userData = await redis.get(`profileData:userId:${userId}`);
    if (userData) return NextResponse.json(JSON.parse(userData));
    else
      NextResponse.json({
        message: "User data not found, fetch fresh data",
        success: false,
      });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
