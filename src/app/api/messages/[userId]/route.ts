import { connectToDB } from "@/app/lib/connectToDB";
import memberModel from "@/app/models/member.model";
import messageModel from "@/app/models/message.model";
import messagetrackerModel from "@/app/models/messagetracker.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
userModel;
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    const body = await req.json();
    const currMember = await memberModel.findOne({
      forProject: body.forProject,
      user: userId,
    });

    if (!currMember) {
      return NextResponse.json({
        message: "Sender is not a member of the project",
        success: false,
      });
    }
    const allMembers = await memberModel.find({ forProject: body.forProject });
    const newMessage = await messageModel.create({
      forProject: body.forProject,
      sentBy: userId,
      addedMs: Date.now(),
      modifiedMs: Date.now(),
      message: body.message,
      editBlock: Date.now() + 120000,
      forCompany: body.forCompany,
    });
    const sendMessage = await messageModel
      .findById(newMessage._id)
      .populate("sentBy");
    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "new-message",
        projectId: body.forProject,
        payload: sendMessage,
      }),
    });

    await Promise.all(
      allMembers.map(async (member) => {
        if (member.user != userId) {
          const trackNewMessage = await messagetrackerModel.create({
            forProject: body.forProject,
            messageId: newMessage._id,
            notReadBy: member.user,
            forCompany: body.forCompany,
          });
          const unReadMessageCount = await messagetrackerModel.countDocuments({
            forProject: body.forProject,
            notReadBy: member.user,
          });
          await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/count-unread`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: member.user,
                event: "new-unread-count",
                payload: unReadMessageCount,
              }),
            },
          );
        }
      }),
    );

    return NextResponse.json({
      message: "Message Sent",
      success: true,
      newMessage: sendMessage,
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
