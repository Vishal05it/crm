import cloudiary from "@/app/lib/cloudinary";
import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import messageModel from "@/app/models/message.model";
import messagetrackerModel from "@/app/models/messagetracker.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    let formData = req.formData();
    let { projectId } = await context.params;
    const image = (await formData).get("image") as File;
    const message = (await formData).get("message") as String;
    const userId = (await formData).get("userId") as String;
    const companyId = (await formData).get("forCompany") as String;
    if (!image) {
      return NextResponse.json({
        message: "File not found",
        success: false,
      });
    }
    let bytes = await image.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let uploadResponse = await new Promise((resolve, reject) => {
      cloudiary.uploader
        .upload_stream({ folder: "crmUploads" }, (err, res) => {
          if (err) {
            reject(err);
          } else resolve(res);
        })
        .end(buffer);
    });
    const url = (uploadResponse as any).secure_url;
    const newMessage = await messageModel.create({
      message,
      url,
      forProject: projectId,
      sentBy: userId,
      addedMs: Date.now(),
      modifiedMs: Date.now(),
      forCompany: companyId,
      editBlock: Date.now() + 120000,
    });
    const sendMessage = await messageModel
      .findById(newMessage._id)
      .populate("sentBy");
    const allMembers = await memberModel.find({ forProject: projectId });
    await Promise.all(
      allMembers.map(async (member) => {
        if (member.user != userId) {
          const newTracker = await messagetrackerModel.create({
            forProject: projectId,
            messageId: newMessage._id,
            notReadBy: member.user,
            forCompany: companyId,
          });
        }
      }),
    );
    let delMsgs = await redis.del(
      `unreadMsgs:projectId:${projectId}:userId:${userId}`,
    );
    return NextResponse.json({
      message: "Photo sent successfully",
      success: true,
      newMessage: sendMessage,
    });
  } catch (error: any) {
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
