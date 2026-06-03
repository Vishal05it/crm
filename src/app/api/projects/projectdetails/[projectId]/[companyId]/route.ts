// Find project for project ID
// Find members for project ID
// Find images for project ID
// Find tasks for project ID
// Find pending images for project ID

import userModel from "@/app/models/user.model";
void userModel;
import { connectToDB } from "@/app/lib/connectToDB";
import memberModel from "@/app/models/member.model";
import pendingimageModel from "@/app/models/pendingimage.model";
import projectModel from "@/app/models/project.model";
import projectimageModel from "@/app/models/projectimage.model";
import taskModel from "@/app/models/task.model";
import { NextRequest, NextResponse } from "next/server";
import { deadLineCalc } from "@/app/utils/DeadlineCalc";
import { transport } from "@/app/lib/nodemailer";
import mongoose from "mongoose";
import messagetrackerModel from "@/app/models/messagetracker.model";
import { redis } from "@/app/lib/redis";
type Members = {
  _id: string;
  user: User;
  name: string;
  forProject: string;
  isAdmin: boolean;
  designation: string;
};
type User = {
  _id: string;
  email: string;
  name: string;
  profilepic: string;
  companyId: string;
  isManager: boolean;
};
type Project = {
  title: string;
  description: string;
  isFailed: boolean;
  deadlineDate: string;
  isDone: boolean;
  deadline: number;
  addedMs: number;
};
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string; companyId: string }> },
) {
  try {
    await connectToDB();
    let { projectId } = await context.params;
    let { companyId } = await context.params;
    let projectDetails = await redis.get(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
    );
    console.log("Cache project : ", projectDetails);
    if (projectDetails) {
      return NextResponse.json(JSON.parse(projectDetails));
    }
    let project = await projectModel.findById(projectId).populate("createdBy");
    if (!project) {
      return NextResponse.json({
        message: "Project not found",
        success: false,
      });
    }
    let members = await memberModel
      .find({ forProject: projectId })
      .populate("user");
    let allMembers = await userModel.find({ companyId });
    let tempFilter: any[] = [];
    for (let i = 0; i < allMembers.length; i++) {
      let flag = false;
      for (let j = 0; j < members.length; j++) {
        if (allMembers[i]._id.toString() == members[j].user._id.toString()) {
          flag = true;
          break;
        }
      }
      if (!flag) tempFilter[i] = allMembers[i];
    }

    let images = await projectimageModel.find({ forProject: projectId });
    let pendingImages = await pendingimageModel
      .find({ forProject: projectId })
      .populate("byUser");

    if (
      deadLineCalc(project.deadlineDate) == 10 &&
      !project.isDone &&
      !project.isFailed
    ) {
      members.map((elm) => {
        transport.sendMail({
          from: process.env.EMAIL,
          to: elm.user.email,
          subject: `Project Deadline Reminder – ${project.title}`,
          text: `Hello ${elm.user.name},

This is a reminder that the deadline for the project titled "${project.title}" is in 10 days.

Please make sure all pending tasks, uploads, and reviews are completed before the deadline. Coordinate with your team members and update your progress regularly.

Thank you,
Ease Work Team`,
        });
      });
    }
    if (
      deadLineCalc(project.deadlineDate) == 1 &&
      !project.isDone &&
      !project.isFailed
    ) {
      members.map((elm) => {
        transport.sendMail({
          from: process.env.EMAIL,
          to: elm.user.email,
          subject: `Project Deadline Reminder – ${project.title}`,
          text: `Hello ${elm.user.name},

This is a reminder that the deadline for the project titled "${project.title}" is tomorrow.

Please make sure all pending tasks, uploads, and reviews are completed before the deadline. Coordinate with your team members and update your progress regularly.

Thank you,
Ease Work Team`,
        });
      });
    }
    await redis.set(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
      JSON.stringify({
        message: "Project details found successfully from cache",
        success: true,
        members,
        allMembers: tempFilter,
        project,
        images,
        pendingImages,
      }),
    );
    return NextResponse.json({
      message: "Project details found successfully",
      success: true,
      members,
      allMembers: tempFilter,
      project,
      images,
      pendingImages,
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
  context: { params: Promise<{ projectId: string; companyId: string }> },
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;
    const { companyId } = await context.params;
    const body = await req.json();
    const project = await projectModel.findById(projectId);
    if (!project) {
      return NextResponse.json({
        message: "Project not found",
        success: false,
      });
    }
    const refProject: Project = {
      title: project.title,
      description: project.description,
      deadlineDate: project.deadlineDate,
      deadline: project.deadline,
      addedMs: project.addedMs,
      isFailed: project.isFailed,
      isDone: project.isDone,
    };
    if (body.title) refProject.title = body.title;
    if (body.description) refProject.description = body.description;
    if (body.deadlineDate) {
      refProject.deadlineDate = body.deadlineDate;
      refProject.deadline = deadLineCalc(body.deadlineDate);
    }
    if (body.isFailed) refProject.isFailed = true;
    if (body.isDone) refProject.isDone = body.isDone;
    if (body.addedMs) refProject.addedMs = body.addedMs;
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      refProject,
      { new: true },
    );
    await redis.del(`allProjects:userId:${body.userId}`);
    let tempCache = await redis.get(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
    );
    console.log("Temp cache before update : ", tempCache);
    await redis.del(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
    );
    let tempCacheNow = await redis.get(
      `projectDetails:projectId:${projectId}:companyId:${companyId}`,
    );
    console.log("Temp cache after update : ", tempCacheNow);
    return NextResponse.json({
      message: "Project updated successfully",
      success: true,
      project: updatedProject,
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
