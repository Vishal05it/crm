import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import companyModel from "@/app/models/company.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
companyModel;
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  try {
    await connectToDB();
    let currUser = await userModel.findById(userId);
    if (!currUser) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }
    let body = await req.json();
    if (body.name) {
      currUser.name = body.name;
    }
    if (body.profilepic) {
      currUser.profilepic = body.profilepic;
    }
    let newUser = await currUser.save();
    let sendUser = await userModel
      .findById(newUser._id)
      .select("-password -allowed")
      .populate("companyId");
    return NextResponse.json({
      message: "Profile updated successfully",
      user: sendUser,
      success: true,
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
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    const cachedUserData = await redis.get(`profileData:userId:${userId}`);
    if (cachedUserData) return NextResponse.json(JSON.parse(cachedUserData));
    let sendUser = await userModel
      .findById(userId)
      .select("-password -allowed");
    if (!sendUser) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }
    await redis.set(
      `profileData:userId:${userId}`,
      JSON.stringify({
        message: "User found successfully from Redis",
        success: true,
        user: sendUser,
      }),
    );
    return NextResponse.json({
      message: "User found successfully",
      success: true,
      user: sendUser,
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
