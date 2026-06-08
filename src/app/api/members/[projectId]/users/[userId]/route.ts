import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";
import projectModel from "@/app/models/project.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
projectModel;
type Member = {
  forProject: string;
  user: string;
  isAdmin: boolean;
  designation: string;
};
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string; projectId: string }> },
) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, projectId } = await context.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({
        messahe: "User not found",
        success: false,
      });
    }
    const refMember: Member = {
      forProject: projectId,
      user: userId,
      designation: body.designation,
      isAdmin: body.isAdmin,
    };
    let newMember = await memberModel.create(refMember);
    const sendMember = await memberModel
      .findById(newMember._id)
      .populate("user");
    const newNotification = await notificationModel.create({
      byUser: body.byUser,
      forProject: projectId,
      action: "Add",
      on: "Member",
      isRead: false,
      addedMs: body.addedMs,
      forUser: userId,
    });
    console.log("New notification : ", newNotification);
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${newMember.forProject}:companyId:${user.companyId}`,
    );
    let sendNotification = await notificationModel
      .findById(newNotification._id)
      .populate("forProject")
      .populate("byUser");
    const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    await fetch(`${NEXT_PUBLIC_SOCKET_URL}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "member-added",
        userId: userId,
        payload: sendNotification,
      }),
    });
    return NextResponse.json({
      message: "New member created",
      success: true,
      member: sendMember,
      newNotification,
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
