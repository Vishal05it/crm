import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import notificationModel from "@/app/models/notification.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ notificationId: string }> },
) {
  try {
    const body = await req.json();
    await connectToDB();
    const { notificationId } = await context.params;
    let readNotification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
    if (!readNotification) {
      return NextResponse.json({
        message: "Notification not found or already read",
        success: false,
      });
    }
    await redis.del(`allNotifications:userId:${body.userId}`);
    return NextResponse.json({
      message: "Notification read",
      success: true,
      readNotification,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
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
