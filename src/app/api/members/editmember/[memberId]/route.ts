import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ memberId: string }> },
) {
  try {
    await connectToDB();
    const { memberId } = await context.params;
    const member = await memberModel.findById(memberId);
    const body = await req.json();
    const updatedMember = await memberModel.findByIdAndUpdate(
      memberId,
      {
        designation: body.designation,
      },
      { new: true },
    );
    if (!updatedMember) {
      return NextResponse.json({
        message: "Member not found",
        success: false,
      });
    }
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${member.forProject}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: "Member updated successfully",
      success: true,
      member: updatedMember,
    });
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
