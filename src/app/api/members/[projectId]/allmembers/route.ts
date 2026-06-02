import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import messageModel from "@/app/models/message.model";
import projectModel from "@/app/models/project.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
userModel;
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;
    const project = await projectModel.findById(projectId);
    const allMembers = await memberModel
      .find({ forProject: projectId })
      .populate("user");
    if (allMembers.length == 0) {
      return NextResponse.json({
        message: "No members found",
        success: false,
      });
    }
    const getChatData = await redis.get(`chatData:projectId:${projectId}`);
    if (getChatData) return NextResponse.json(JSON.parse(getChatData));
    const allMessages = await messageModel
      .find({ forProject: projectId })
      .populate("sentBy");
    const chatData = await redis.set(
      `chatData:projectId:${projectId}`,
      JSON.stringify({
        message: "All members and messages found from Redis",
        success: true,
        members: allMembers,
        project,
        messages: allMessages,
      }),
    );
    return NextResponse.json({
      message: "All members and messages found",
      success: true,
      members: allMembers,
      project,
      messages: allMessages,
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      let messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({
        message: messages[0],
        success: false,
      });
    }
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
