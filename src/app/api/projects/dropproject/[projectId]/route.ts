import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import droppedprojectModel from "@/app/models/droppedproject.model";
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
    let { projectId } = await context.params;
    const droppedProject = await droppedprojectModel.findOne({ projectId });
    if (!droppedProject) {
      return NextResponse.json({
        message: "No such dropped project",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Dropped Project found successfully",
      success: true,
      droppedProject,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
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
    let { projectId } = await context.params;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return NextResponse.json({
        message: "Project not found",
        success: false,
      });
    }
    const body = await req.json();
    let droppedProject = await droppedprojectModel.create({
      projectId,
      reason: body.reason,
    });
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { isFailed: true },
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
          on: "Project",
          action: "Remove",
        });
      }
    });
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: `Project ${project.title} has been dropped`,
      success: true,
      droppedProject,
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
      message: "Internal Server Error",
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
    const droppedProject = await droppedprojectModel.findOne({ projectId });
    if (!droppedProject) {
      return NextResponse.json({
        message: "No such dropped project",
        success: false,
      });
    }
    const restartedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { isFailed: false },
      { new: true },
    );
    const deleteDropped = await droppedprojectModel.deleteOne({ projectId });
    const allMembers = await memberModel.find({ forProject: projectId });
    allMembers.map(async (elm) => {
      if (elm.user != body.byUser) {
        const newNotification = await notificationModel.create({
          byUser: body.byUser,
          forUser: elm.user,
          forProject: projectId,
          on: "Project",
          addedMs: body.addedMs,
          action: "Add",
        });
        console.log("A notification in backend : ", newNotification);
      }
    });
    let deleteProjectDetails = await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${body.companyId}`,
    );
    return NextResponse.json({
      message: "Project restarted successfully",
      success: true,
      restartedProject,
      deleteDropped,
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
