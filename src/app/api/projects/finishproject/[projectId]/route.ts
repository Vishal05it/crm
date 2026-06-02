import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import completeprojectModel from "@/app/models/completeproject.model";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";
import projectModel from "@/app/models/project.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;

    const finishedProject = await completeprojectModel.findOne({
      projectId,
    });

    if (!finishedProject) {
      return NextResponse.json({
        message: "Finished Project not found",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Finished Project found",
      success: true,
      project: finishedProject,
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
      message: "Internal Sever Error",
      success: false,
    });
  }
}
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;
    const body = await req.json();
    const project = await projectModel.findById(projectId);
    if (!project) {
      return NextResponse.json({
        message: "Project not found",
        success: false,
      });
    }

    const finishedProject = await completeprojectModel.create({
      projectId,
    });
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { isDone: true },
      { new: true },
    );
    const allMembers = await memberModel.find({ forProject: projectId });
    allMembers.map(async (elm) => {
      if (elm.user != body.byUser) {
        const newNotification = await notificationModel.create({
          byUser: body.byUser,
          forUser: elm.user,
          forProject: projectId,
          addedMs: body.addedMs,
          on: "Complete",
          action: "Add",
        });
      }
    });
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: `Project ${project.title} completed successfully`,
      success: true,
      finishedProject,
      updatedProject,
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
      message: "Internal Sever Error",
      success: false,
    });
  }
}
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;
    const body = await req.json();
    const completedProject = await completeprojectModel
      .deleteOne({
        projectId,
      })
      .populate("project");
    if (!completedProject) {
      return NextResponse.json({
        message: "Completed project not found",
        success: false,
      });
    }
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { isDone: false },
      { new: true },
    );
    const allMembers = await memberModel.find({ forProject: projectId });
    allMembers.map(async (elm) => {
      if (elm.user != body.byUser) {
        const newNotification = await notificationModel.create({
          addedMs: body.addedMs,
          byUser: body.byUser,
          forProject: projectId,
          forUser: elm.user,
          on: "Complete",
          action: "Remove",
        });
      }
    });

    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: `Project ${updatedProject.title} has been restarted `,
      success: true,
      completedProject,
      updatedProject,
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
      message: "Internal Sever Error",
      success: false,
    });
  }
}
