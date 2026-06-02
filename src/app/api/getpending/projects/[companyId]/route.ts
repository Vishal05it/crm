import { connectToDB } from "@/app/lib/connectToDB";
import pendingprojectModel from "@/app/models/pendingproject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> },
) {
  try {
    await connectToDB();
    const { companyId } = await context.params;
    let pendingProjects = await pendingprojectModel
      .find({
        forCompany: companyId,
      })
      .populate("createdBy forCompany");
    let pendingProjectsCount = await pendingprojectModel.countDocuments({
      forCompany: companyId,
    });
    return NextResponse.json({
      message: "All pending projects found",
      success: true,
      pendingProjects,
      pendingProjectsCount,
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
