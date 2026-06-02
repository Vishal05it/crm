import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import userModel from "@/app/models/user.model";
import { connectToDB } from "@/app/lib/connectToDB";
import companyModel from "@/app/models/company.model";
import pendinguserModel from "@/app/models/pendinguser.model";
import mongoose from "mongoose";
type User = {
  email: string;
  password: string;
  name: string;
  profilepic: string;
  companyId: string;
  isManager: boolean;
  allowed: boolean;
  paymentStatus: string;
};
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    let body = await req.json();
    let userExist = await userModel.findOne({ email: body.email });
    if (userExist) {
      return NextResponse.json({
        message: "Email already registered",
        success: false,
      });
    }
    let refUser: User = {
      name: body.name,
      email: body.email,
      password: body.password,
      profilepic: body.profilepic
        ? body.profilepic
        : "https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80",
      companyId: "",
      isManager: false,
      allowed: false,
      paymentStatus: "pending",
    };
    let salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(body.password, salt);
    refUser.password = newPassword;
    if (body.companyId) {
      let companyExist = await companyModel.findById(body.companyId);
      if (!companyExist) {
        return NextResponse.json({
          message: "Company not found!",
          success: false,
        });
      }
      refUser.companyId = body.companyId;
      refUser.allowed = true;
      refUser.paymentStatus = "pending";
      let newUser = await pendinguserModel.create(refUser);
      let sendUser = await userModel
        .findById(newUser._id)
        .select("-password -allowed");
      return NextResponse.json({
        message: "Dummy account created, waiting for approval",
        success: true,
        user: sendUser,
      });
    } else {
      let newCompany = await companyModel.create({
        companyName: body.companyName,
        companyPic: body.companyPic,
      });
      refUser.companyId = newCompany._id;
      refUser.isManager = true;
      refUser.paymentStatus = "pending";
      let newUser = await userModel.create(refUser);
      let sendUser = await userModel
        .findById(newUser._id)
        .select("-password -allowed");
      return NextResponse.json({
        message: "Account created successfuly!",
        success: true,
        user: sendUser,
      });
    }
  } catch (error: any) {
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
