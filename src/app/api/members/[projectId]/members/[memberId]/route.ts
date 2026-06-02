import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";
import pendingimageModel from "@/app/models/pendingimage.model";
import projectModel from "@/app/models/project.model";
import projectimageModel from "@/app/models/projectimage.model";
import taskModel from "@/app/models/task.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ memberId: string; projectId: string }> },
) {
  try {
    await connectToDB();
    const { memberId } = await context.params;
    const member = await memberModel.findById(memberId);
    if (!member) {
      return NextResponse.json({
        message: "Member not found",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Member found successfully",
      success: true,
      member,
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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ memberId: string; projectId: string }> },
) {
  try {
    await connectToDB();
    const { memberId, projectId } = await context.params;
    const member = await memberModel.findById(memberId).populate("user");
    if (!member) {
      return NextResponse.json({
        message: "Member not found",
        success: false,
      });
    }
    const body = await req.json();
    if (!body.isAdmin) {
      const remaining = await memberModel.countDocuments({
        forProject: projectId,
        isAdmin: true,
      });
      if (remaining <= 1) {
        return NextResponse.json({
          message:
            "At least 1 admin is required for a project, leave the project to remove yourself as admin",
          success: false,
        });
      }
    }
    const updatedMember = await memberModel.findByIdAndUpdate(
      memberId,
      { isAdmin: body.isAdmin },
      { new: true },
    );
    if (!updatedMember) {
      return NextResponse.json({
        message: "Member updation failed",
        success: false,
      });
    }
    if (body.isAdmin) {
      const newNotification = await notificationModel.create({
        forProject: projectId,
        byUser: body.byUser,
        forUser: member.user,
        addedMs: Date.now(),
        on: "Admin",
        action: "Add",
      });
      let deleteProjectDetails = await redis.del(
        `projectDetails:projectId:${member.forProject}:companyId:${member.user.companyId}`,
      );
      return NextResponse.json({
        message: "Member is now admin",
        success: true,
        member: updatedMember,
        newNotification,
      });
    } else {
      const newNotification = await notificationModel.create({
        forProject: projectId,
        byUser: body.byUser,
        forUser: member.user,
        addedMs: Date.now(),
        on: "Admin",
        action: "Remove",
      });
      let deleteProjectDetails = await redis.del(
        `projectDetails:projectId:${body.forProject}:companyId:${body.companyId}`,
      );
      return NextResponse.json({
        message: "Member removed as admin",
        success: true,
        member: updatedMember,
        newNotification,
      });
    }
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
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ memberId: string; projectId: string }> },
) {
  try {
    await connectToDB();
    const { projectId, memberId } = await context.params;
    const body = await req.json();
    const deletedMember = await memberModel.findByIdAndDelete(memberId);
    if (!deletedMember) {
      return NextResponse.json({
        message: "Member not found",
        success: false,
      });
    }
    const remaining = await memberModel.countDocuments({
      forProject: projectId,
      isAdmin: true,
    });
    if (remaining == 0) {
      const deletePendingImages = await pendingimageModel.deleteMany({
        forProject: projectId,
      });
      const deletedNotifications = await notificationModel.deleteMany({
        forProject: projectId,
      });
      const deleteProjectImages = await projectimageModel.deleteMany({
        forProject: projectId,
      });
      const deleteTasks = await taskModel.deleteMany({ forProject: projectId });
      const deletedProject = await projectModel.findByIdAndDelete(projectId);
      return NextResponse.json({
        message: "Last member left, project is deleted",
        success: true,
        code: 401,
        member: deletedMember,
        project: deletedProject,
      });
    }
    if (body.byUser != deletedMember.user) {
      const newNotification = await notificationModel.create({
        forProject: projectId,
        byUser: body.byUser,
        forUser: deletedMember.user,
        on: "Member",
        action: "Remove",
        addedMs: Date.now(),
      });
    }
    let deleteMemberTasks = await taskModel.deleteMany({
      assignedTo: memberId,
    });
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${body.forProject}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: "Member removed successfully",
      success: true,
      member: deletedMember,
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
