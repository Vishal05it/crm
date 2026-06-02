import cloudiary from "@/app/lib/cloudinary";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    let formData = req.formData();
    const image = (await formData).get("image") as File;
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
    return NextResponse.json({
      message: "File uploaded successfully",
      success: true,
      url: (uploadResponse as any).secure_url,
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
