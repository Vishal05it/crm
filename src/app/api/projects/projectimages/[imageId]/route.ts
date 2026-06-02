import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import projectimageModel from "@/app/models/projectimage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ imageId: string }> },
) {
  try {
    await connectToDB();
    const { imageId } = await context.params;
    const body = await req.json();
    const deletedImage = await projectimageModel.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return NextResponse.json({
        message: "Image not found or already deleted",
        success: false,
      });
    }
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${body.forProject}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: "Image deleted successfully",
      success: true,
      deletedImage,
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
