import { connectToDB } from "@/app/lib/connectToDB";
import { transport } from "@/app/lib/nodemailer";
import companyModel from "@/app/models/company.model";
import notificationModel from "@/app/models/notification.model";
import pendinguserModel from "@/app/models/pendinguser.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
companyModel;
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    const body = await req.json();
    let dummyUser = await pendinguserModel.findById(userId);
    if (!dummyUser) {
      return NextResponse.json({
        message: "User not found!",
        success: false,
      });
    }
    let newUser = await userModel.create(body);
    let sendUser = await userModel.findById(newUser._id);
    let deletePending = await pendinguserModel.findByIdAndDelete(dummyUser._id);
    let newNotification = await notificationModel.create({
      byUser: body.managerId,
      forUser: newUser._id,
      on: "Account",
      action: "Add",
      isRead: false,
      addedMs: body.addedMs,
    });
    let sendNotification = await notificationModel
      .findById(newNotification._id)
      .populate("byUser");

    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "account-approved",
        userId: newUser._id,
        payload: sendNotification,
      }),
    });
    transport.sendMail({
      from: process.env.EMAIL,
      to: newUser.email,
      subject: `Your Ease Work Account Has Been Approved`,
      text: `Hello ${newUser.name},

Your account request has been approved successfully.

You can now log in to Ease Work and start accessing your company workspace, projects, tasks, and team collaboration features.

We’re excited to have you onboard.

Thank you,
Ease Work Team`,
    });
    return NextResponse.json({
      message: "Account approved",
      success: true,
      user: sendUser,
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
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    await connectToDB();
    let dummyUser = await pendinguserModel.findById(userId);
    if (!dummyUser) {
      return NextResponse.json({
        message: "User not found!",
        success: false,
      });
    }
    let deletedUser = await pendinguserModel.findByIdAndDelete(userId);
    return NextResponse.json({
      message: "Account creation rejected",
      success: true,
      deletedUser,
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
