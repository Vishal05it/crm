import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import userModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  await redis.del(`isLogin:userId:${userId}`);
  const response = NextResponse.json({
    message: "Logged out successfully",
    success: true,
  });
  response.cookies.delete("authToken");
  return response;
}
