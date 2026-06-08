import cloudiary from "@/app/lib/cloudinary";
import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";
import pendingimageModel from "@/app/models/pendingimage.model";
import projectimageModel from "@/app/models/projectimage.model";
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
    const user = (await formData).get("user") as string;
    const companyId = (await formData).get("companyId") as string;
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
    let newImage = await pendingimageModel.create({
      forProject: projectId,
      url,
      byUser: user,
    });
    const allAdmins = await memberModel.find({
      forProject: projectId,
      isAdmin: true,
    });
    allAdmins.map(async (elm) => {
      if (elm.user != user) {
        const newNotification = await notificationModel.create({
          forProject: projectId,
          byUser: user,
          forUser: elm.user,
          addedMs: Date.now(),
          on: "ImageApproval",
          action: "Add",
        });
        const sendNotification = await notificationModel
          .findById(newNotification._id)
          .populate("forProject")
          .populate("byUser");

        await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/emit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "image-uploaded",
            userId: elm.user,
            payload: sendNotification,
          }),
        });
        // console.log("Image approval notification", newNotification);
      }
    });
    const sendImage = await pendingimageModel
      .findById(newImage._id)
      .populate("byUser");
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
    );
    return NextResponse.json({
      message: "File uploaded successfully",
      success: true,
      url,
      newImgDoc: sendImage,
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
      message: "Image uploading failed",
      success: false,
    });
  }
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    let formData = req.formData();
    let { projectId } = await context.params;
    const image = (await formData).get("image") as File;
    const companyId = (await formData).get("companyId") as String;

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
    let newImage = await projectimageModel.create({
      forProject: projectId,
      url,
    });
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
    );
    return NextResponse.json({
      message: "File uploaded successfully",
      success: true,
      url,
      newImgDoc: newImage,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Image uploading failed",
      success: false,
    });
  }
}
