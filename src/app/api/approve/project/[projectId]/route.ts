import { connectToDB } from "@/app/lib/connectToDB";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";

import pendingimageModel from "@/app/models/pendingimage.model";
import pendingprojectModel from "@/app/models/pendingproject.model";
import projectModel from "@/app/models/project.model";
import projectimageModel from "@/app/models/projectimage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{ projectId: string }>;
  },
) {
  try {
    await connectToDB();
    let { projectId } = await context.params;
    const body = await req.json();
    let pendingProject = await pendingprojectModel.findById(projectId);
    if (!pendingProject) {
      return NextResponse.json({
        message: "Project doesn't exist",
        success: false,
      });
    }
    const project = await projectModel.create({
      title: body.title,
      description: body.description,
      createdMs: body.createdMs,
      createdBy: body.createdBy,
      isFailed: body.isFailed,
      isDone: body.isDone,
      deadline: body.deadline,
      deadlineDate: body.deadlineDate,
      designation: body.designation,
      addedMs: body.addedMs,
      forCompany: body.forCompany,
      required: body.required,
    });
    let newMember = await memberModel.create({
      user: pendingProject.createdBy,
      forProject: project._id,
      isAdmin: true,
      designation: pendingProject.designation,
    });
    let memberNotification = await notificationModel.create({
      byUser: body.managerId,
      forUser: body.createdBy,
      isRead: false,
      on: "Member",
      action: "Add",
      forProject: project._id,
      addedMs: body.addedMs,
    });
    const sendMemberNotification = await notificationModel
      .findById(memberNotification._id)
      .populate("forProject")
      .populate("byUser");

    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "member-added",
        userId: body.createdBy,
        payload: sendMemberNotification,
      }),
    });
    let allPendingImagesArray = await pendingimageModel.find({
      forProject: pendingProject._id,
    });
    let allPendingImagesObjects = allPendingImagesArray.map((elm) => {
      return {
        forProject: project._id,
        url: elm.url,
      };
    });
    let projectImages = await projectimageModel.create(allPendingImagesObjects);
    let deletePendingImages = await pendingimageModel.deleteMany({
      forProject: projectId,
    });
    let deletePending = await pendingprojectModel.findByIdAndDelete(projectId);
    let notification = await notificationModel.create({
      byUser: body.managerId,
      forUser: body.createdBy,
      isRead: false,
      on: "Approval",
      action: "Add",
      forProject: project._id,
      addedMs: body.addedMs,
    });
    const sendNotification = await notificationModel
      .findById(notification._id)
      .populate("forProject")
      .populate("byUser");
    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "project-approved",
        userId: body.createdBy,
        payload: sendNotification,
      }),
    });
    return NextResponse.json({
      message: "Project is approved",
      success: true,
      project: project,
      projectImages,
      firstAdmin: newMember,
      notification,
      memberNotification,
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
  context: {
    params: Promise<{ projectId: string }>;
  },
) {
  try {
    await connectToDB();
    let { projectId } = await context.params;
    const body = await req.json();
    let pendingProject = await pendingprojectModel.findById(projectId);
    if (!pendingProject) {
      return NextResponse.json({
        message: "Project doesn't exist",
        success: false,
      });
    }
    const deletePendingImages = await pendingimageModel.deleteMany({
      forProject: projectId,
    });
    let notification = await notificationModel.create({
      byUser: body.byUser,
      forUser: body.forUser,
      isRead: false,
      on: "Approval",
      action: "Remove",
      forProject: pendingProject._id,
      addedMs: body.addedMs,
      title: pendingProject.title,
    });
    let sendNotification = await notificationModel
      .findById(notification._id)
      .populate("byUser");
    const deleteProject =
      await pendingprojectModel.findByIdAndDelete(projectId);

    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "project-rejected",
        userId: body.forUser,
        payload: sendNotification,
      }),
    });
    return NextResponse.json({
      message: "Project rejected",
      success: true,
      deletedProject: deleteProject,
      notification,
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
