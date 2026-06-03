import cloudiary from "@/app/lib/cloudinary";
import { connectToDB } from "@/app/lib/connectToDB";
import { transport } from "@/app/lib/nodemailer";
import { redis } from "@/app/lib/redis";
import companyModel from "@/app/models/company.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    let { userId } = await context.params;
    await connectToDB();
    const user = await userModel.findById(userId);
    if (!user.isManager) {
      return NextResponse.json({
        message: "Only manager can change company details",
        success: false,
      });
    }
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
    const company = await companyModel.findByIdAndUpdate(
      user.companyId,
      { companyPic: (uploadResponse as any).secure_url },
      { new: true },
    );
    if (!company) {
      return NextResponse.json({
        message: "Something went wrong",
        success: false,
      });
    }
    const allUsers = await userModel.find({ companyId: user.companyId });
    await Promise.all(
      allUsers.map(async (userElm) => {
        await redis.del(`profileData:userId:${userElm._id}`);
        if (userElm._id != user._id) {
          transport.sendMail({
            from: process.env.EMAIL,
            to: userElm.email,
            subject:
              "Important: Please Log Out and Log In Again to View Updated Company Branding",
            text: `Dear ${userElm.name},

We would like to inform you that your organization's manager has recently updated the company branding, including the company name and/or logo.

To ensure these changes are reflected correctly in your account, please log out of EaseWork and log back in once at your earliest convenience.

This refresh will allow the latest company information and branding updates to be loaded properly within the application.

Action Required:

Log out of your EaseWork account.
Log back in using your existing credentials.

We apologize for any inconvenience and appreciate your cooperation.

If you experience any issues after logging back in, please contact your administrator or support team.

Best Regards,
${user.name}
Manager - ${company.companyName}`,
          });
        }
      }),
    );
    const newUser = await userModel
      .findById(user._id)
      .select("-password -allowed")
      .populate("companyId");
    return NextResponse.json({
      message: "Company Photo changed",
      success: true,
      user: newUser,
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
