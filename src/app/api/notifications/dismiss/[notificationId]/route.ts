import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import notificationModel from "@/app/models/notification.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ notificationId: string }> },
) {
  try {
    const { notificationId } = await context.params;
    const body = await req.json();
    await connectToDB();
    const deletedNotification =
      await notificationModel.findByIdAndDelete(notificationId);
    if (!deletedNotification) {
      return NextResponse.json({
        message: "Notification not found",
        success: false,
      });
    }
    await redis.del(`allNotifications:userId:${body.userId}`);
    return NextResponse.json({
      message: "Notification deleted",
      success: true,
      deletedNotification,
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
