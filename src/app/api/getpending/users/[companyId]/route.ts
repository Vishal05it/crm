import { connectToDB } from "@/app/lib/connectToDB";
import companyModel from "@/app/models/company.model";
import pendinguserModel from "@/app/models/pendinguser.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
companyModel;
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> },
) {
  try {
    await connectToDB();
    const { companyId } = await context.params;
    if (!companyId) {
      return NextResponse.json({
        message: "Company ID not found",
        success: false,
        companyId: companyId,
      });
    }
    let pendingUsers = await pendinguserModel.find({ companyId });
    const numbersPending = await pendinguserModel.countDocuments({ companyId });
    return NextResponse.json({
      message: "All pending users found",
      success: true,
      pendingUsers,
      numbersPending,
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
