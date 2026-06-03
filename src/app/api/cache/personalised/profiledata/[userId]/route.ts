import { redis } from "@/app/lib/redis";
import userModel from "@/app/models/user.model";
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
    else {
      let userFromDB = await userModel
        .findById(userId)
        .populate("companyId")
        .select("-password _allowed");
      await redis.set(
        `profileData:userId:${userId}`,
        JSON.stringify({
          message: "User found successfully from Redis",
          success: true,
          user: userFromDB,
        }),
      );
      return NextResponse.json({
        message: "User found successfully",
        success: true,
        user: userFromDB,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
