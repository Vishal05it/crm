type OTP = {
  email: string;
  otp: string;
  requestedAt: number;
  expiringAt: number;
  sent: boolean;
};
import { connectToDB } from "@/app/lib/connectToDB";
import { transport } from "@/app/lib/nodemailer";

import userModel from "@/app/models/user.model";
import { timeCalc } from "@/app/utils/TimeCalculator";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { redis } from "@/app/lib/redis";
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ email: string }> },
) {
  try {
    const { email } = await context.params;
    await connectToDB();
    const user = await userModel.findOne({ email });
    const body = await req.json();
    if (!user) {
      return NextResponse.json({
        message: "Account does not exist",
        success: false,
      });
    }
    let otpDoc: OTP = {
      email: "",
      otp: "",
      requestedAt: 0,
      expiringAt: 0,
      sent: false,
    };
    let tempDoc = await redis.get(`passReset:${email}`);
    if (tempDoc) otpDoc = JSON.parse(tempDoc) as OTP;
    if (otpDoc.email && body.sendingAt <= otpDoc.requestedAt + 120000) {
      const timeLeft = await redis.ttl(`passReset:${email}`);
      return NextResponse.json({
        message: `Please wait ${timeLeft} seconds before requesting new OTP`,
        success: false,
        code: 402,
        timeLeft,
      });
    } else if (
      !otpDoc.email ||
      (otpDoc.email && body.sendingAt > otpDoc.requestedAt + 120000)
    ) {
      let newOtp =
        Math.ceil(Math.random() * 10) * 10000 +
        Math.ceil(Math.random() * 10) * 1000 +
        Math.ceil(Math.random() * 10) * 100 +
        Math.ceil(Math.random() * 10) * 10 +
        Math.ceil(Math.random() * 10);
      let salt = await bcrypt.genSalt(10);
      let encodedOTP = await bcrypt.hash(newOtp.toString(), salt);

      const newOtpDoc = await redis.set(
        `passReset:${email}`,
        JSON.stringify({
          email,
          otp: encodedOTP,
          requestedAt: body.sendingAt,
          expiringAt: body.sendingAt + 120000,
          sent: true,
        }),
        { EX: 120 },
      );
      transport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "OTP for resetting password",
        text: `Hello ${user.name}, I hope you are doing well.

The OTP for resetting your account password is ${newOtp}. Please note that this OTP is valid for 2 minutes only. If not requested by you, contact us immediately.

Thank You
Team Ease Work`,
      });

      return NextResponse.json({
        message: "OTP sent at registered email",
        success: true,
      });
    }
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
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ email: string }> },
) {
  try {
    await connectToDB();
    const { email } = await context.params;
    const body = await req.json();
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "Account does not exist",
        success: false,
      });
    }
    let otpDoc: OTP = {
      email: "",
      otp: "",
      requestedAt: 0,
      expiringAt: 0,
      sent: false,
    };
    let tempDoc = await redis.get(`passReset:${email}`);
    if (tempDoc) otpDoc = JSON.parse(tempDoc) as OTP;
    if (!otpDoc.email) {
      return NextResponse.json({
        message: "OTP expired, request a new one",
        success: false,
      });
    } else if (body.sendingAt > otpDoc.requestedAt + 120000) {
      return NextResponse.json({
        message: "OTP expired, request a new one",
        success: false,
      });
    }

    const attempts = await redis.incr(`resetPassAttempts:${email}`);
    if (attempts == 5) {
      await redis.set(`resetPassAttempts:${email}`, 5, { EX: 300 });
    } else if (attempts > 5) {
      const attemptsTTL = await redis.ttl(`resetPassAttempts:${email}`);
      return NextResponse.json({
        message: `Too many attempts. Please try after ${attemptsTTL} seconds`,
        success: false,
      });
    }

    let decodedOTP = await bcrypt.compare(body.otpUser.toString(), otpDoc.otp);
    if (decodedOTP) {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(body.password, salt);
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { password: newPassword },
        { new: true },
      );
      await redis.del(`passReset:${email}`);
      await redis.del(`resetPassAttempts:${email}`);

      return NextResponse.json({
        message: "Password updated successfully",
        success: true,
      });
    } else {
      return NextResponse.json({
        message: `Invalid OTP, ${5 - attempts} attemps left`,
        success: false,
      });
    }
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
