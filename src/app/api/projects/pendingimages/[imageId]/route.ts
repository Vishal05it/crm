import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import notificationModel from "@/app/models/notification.model";
import pendingimageModel from "@/app/models/pendingimage.model";
import projectimageModel from "@/app/models/projectimage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ imageId: string }> },
) {
  try {
    await connectToDB();
    const { imageId } = await context.params;
    const body = await req.json();
    const pendingImage = await pendingimageModel.findById(imageId);
    if (!pendingImage) {
      return NextResponse.json({
        message: "Pending image not found",
        success: false,
      });
    }
    const newProjectImg = await projectimageModel.create({
      forProject: body.forProject,
      url: pendingImage.url,
    });
    const deletePending = await pendingimageModel.findByIdAndDelete(imageId);
    console.log(
      `POST : From body : ${body.forUser} for ${pendingImage.byUser}`,
    );
    if (body.forUser != pendingImage.byUser) {
      const newNotification = await notificationModel.create({
        forUser: body.forUser,
        byUser: body.byUser,
        addedMs: body.addedMs,
        forProject: body.forProject,
        on: "Image",
        action: "Add",
      });
      console.log("New img notification : ", newNotification);
    }
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${body.forProject}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: "Image approved",
      success: true,
      deletePending,
      image: newProjectImg,
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
  context: { params: Promise<{ imageId: string }> },
) {
  try {
    await connectToDB();
    const { imageId } = await context.params;
    const body = await req.json();
    const deletePending = await pendingimageModel.findByIdAndDelete(imageId);
    if (!deletePending) {
      return NextResponse.json({
        message: "Pending image not found or already deleted",
        success: false,
      });
    }
    console.log(`DELETE : From body : ${body.forUser} for ${body.byUser}`);
    if (body.forUser != body.byUser) {
      const newNotification = await notificationModel.create({
        forUser: body.forUser,
        byUser: body.byUser,
        forProject: body.forProject,
        addedMs: body.addedMs,
        on: "Image",
        action: "Remove",
      });
      console.log("New img notification : ", newNotification);
    }
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${body.forProject}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: "Image rejected",
      success: true,
      deletePending,
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
