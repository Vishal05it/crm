import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import messagetrackerModel from "@/app/models/messagetracker.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string; userId: string }> },
) {
  try {
    await connectToDB();
    const { projectId, userId } = await context.params;
    const cacheUnread = await redis.get(
      `unreadMsgs:projectId:${projectId}:userId:${userId}`,
    );
    if (cacheUnread) return NextResponse.json(JSON.parse(cacheUnread));
    const unReadMessageCount = await messagetrackerModel.countDocuments({
      forProject: projectId,
      notReadBy: userId,
    });
    await redis.set(
      `unreadMsgs:projectId:${projectId}:userId:${userId}`,
      JSON.stringify({
        message: "Unread messages found",
        success: true,
        unread: unReadMessageCount,
      }),
    );
    return NextResponse.json({
      message: "Unread messages found",
      success: true,
      unread: unReadMessageCount,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      let messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({
        message: messages[0],
        success: false,
      });
    }
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ projectId: string; userId: string }> },
) {
  try {
    await connectToDB();
    const { userId, projectId } = await context.params;
    const readAllMessage = await messagetrackerModel.deleteMany({
      forProject: projectId,
      notReadBy: userId,
    });
    await redis.del(`unreadMsgs:projectId:${projectId}:userId:${userId}`);
    return NextResponse.json({
      message: "All messages read",
      success: true,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      let messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({
        message: messages[0],
        success: false,
      });
    }
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
