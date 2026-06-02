import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import notificationModel from "@/app/models/notification.model";
import projectModel from "@/app/models/project.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
userModel;
projectModel;
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const allNotificationsCache = await redis.get(
      `allNotifications:userId:${userId}`,
    );
    if (allNotificationsCache)
      return NextResponse.json(JSON.parse(allNotificationsCache));

    await connectToDB();
    let countUnread = await notificationModel.countDocuments({
      forUser: userId,
      isRead: false,
    });
    let allNotifications = await notificationModel
      .find({
        forUser: userId,
      })
      .populate("byUser")
      .populate("forProject");
    await redis.set(
      `allNotifications:userId:${userId}`,
      JSON.stringify({
        message:
          countUnread > 0
            ? `You have new notifications`
            : `No new notifications`,
        success: true,
        allNotifications,
        countUnread,
      }),
    );
    return NextResponse.json({
      message:
        countUnread > 0 ? `You have new notifications` : `No new notifications`,
      success: true,
      allNotifications,
      countUnread,
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
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    const readAllNotifications = await notificationModel.updateMany(
      { forUser: userId, isRead: false },
      { isRead: true },
    );
    if (!readAllNotifications) {
      return NextResponse.json({
        message: "All notifications already viewed",
        success: false,
      });
    }
    const modifiedNots = await notificationModel
      .find({ forUser: userId })
      .populate("byUser")
      .populate("forProject");
    await redis.set(
      `allNotifications:userId:${userId}`,
      JSON.stringify({
        message: "All unread notifications viewed",
        success: true,
        allNotifications: modifiedNots,
        countUnread: 0,
      }),
    );

    return NextResponse.json({
      message: "All unread notifications viewed",
      success: true,
      readAllNotifications,
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
