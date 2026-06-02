import { connectToDB } from "@/app/lib/connectToDB";
import messageModel from "@/app/models/message.model";
import messagetrackerModel from "@/app/models/messagetracker.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ messageId: string }> },
) {
  try {
    await connectToDB();
    const { messageId } = await context.params;
    const message = await messageModel.findById(messageId);

    if (!message) {
      return NextResponse.json({
        message: "Message not found",
        success: false,
      });
    }
    const body = await req.json();
    if (body.sentBy != message.sentBy) {
      return NextResponse.json({
        message: "Cannot edit other's message",
        success: false,
      });
    }
    if (Date.now() > message.addedMs + 120000) {
      return NextResponse.json({
        message: "Cannot edit message after 2 minutes of sending",
        success: false,
      });
    }

    const updatedMessage = await messageModel.findByIdAndUpdate(
      messageId,
      {
        message: body.message,
        modifiedMs: Date.now(),
        isModified: true,
      },
      { new: true },
    );
    return NextResponse.json({
      message: "Message edited",
      success: true,
      newMessage: updatedMessage,
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
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ messageId: string }> },
) {
  try {
    await connectToDB();
    const { messageId } = await context.params;
    const deletedMessage = await messageModel.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return NextResponse.json({
        message: "Message not found or already deleted",
        success: false,
      });
    }
    const deleteTrackedMessages = await messagetrackerModel.deleteMany({
      messageId,
    });
    return NextResponse.json({
      message: "Message deleted",
      success: true,
      deletedMessage,
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
