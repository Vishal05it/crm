import { redis } from "@/app/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ userId: string; projectId: string }> },
) {
  try {
    const { userId, projectId } = await context.params;
    await redis.del(`unreadMsgs:projectId:${projectId}:userId:${userId}`);
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
