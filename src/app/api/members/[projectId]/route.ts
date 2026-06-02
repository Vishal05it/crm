import { connectToDB } from "@/app/lib/connectToDB";
import memberModel from "@/app/models/member.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;
    const allMembers = await memberModel.find({ forProject: projectId });

    return NextResponse.json({
      message: "All project members found",
      success: true,
      allMembers,
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
