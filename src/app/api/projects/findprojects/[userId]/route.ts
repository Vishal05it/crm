import { connectToDB } from "@/app/lib/connectToDB";
import { redis } from "@/app/lib/redis";
import completeprojectModel from "@/app/models/completeproject.model";
import memberModel from "@/app/models/member.model";
import pendingprojectModel from "@/app/models/pendingproject.model";
import projectModel from "@/app/models/project.model";
import projectimageModel from "@/app/models/projectimage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type Error = {
  errors: string[];
};
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    let body = await req.json();
    const refProject = {
      title: "",
      description: "",
      createdMs: 0,
      deadline: 0,
      deadlineDate: "",
      addedMs: 0,
      isFailed: false,
      createdBy: "",
      designation: "",
      forCompany: "",
      required: 0,
    };
    let existProject = await projectModel.findOne({ title: body.title });
    if (existProject) {
      return NextResponse.json({
        message: "Cannot create 2 projects with same name",
        success: false,
      });
    }
    refProject.title = body.title;
    refProject.description = body.description;
    refProject.createdMs = body.createdMs;
    refProject.deadline = body.deadline;
    refProject.deadlineDate = body.deadlineDate;
    refProject.addedMs = body.addedMs;
    refProject.createdBy = body.createdBy;
    refProject.designation = body.designation;
    refProject.forCompany = body.forCompany;
    refProject.required = body.required;
    let newProject = await pendingprojectModel.create(refProject);

    return NextResponse.json({
      message: "Dummy Project created successfully, waiting for approval",
      success: true,
      pendingProject: newProject,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    let { userId } = await context.params;
    let allProjectsCache = await redis.get(`allProjects:userId:${userId}`);
    if (allProjectsCache)
      return NextResponse.json(JSON.parse(allProjectsCache));
    await connectToDB();
    let workingOn = await memberModel
      .find({ user: userId })
      .populate("forProject")
      .populate("user");
    if (workingOn.length == 0) {
      return NextResponse.json({
        message: "No Projects found",
        success: false,
      });
    }

    let allProjects = [];
    allProjects = await Promise.all(
      workingOn.map(async (elm) => {
        const thumbnail = await projectimageModel.findOne({
          forProject: elm.forProject._id,
        });
        console.log("Thumbnail : ", thumbnail);
        return {
          thumbnail,
          project: elm.forProject,
        };
      }),
    );
    let acitve = 0;
    let complete = 0;
    workingOn.map((member) => {
      if (member.forProject.isDone) {
        complete++;
      } else acitve++;
    });

    let activeCount = acitve;
    let completeCount = complete;
    await redis.set(
      `allProjects:userId:${userId}`,
      JSON.stringify({
        message: "All your projects found from Redis",
        workingOn,
        success: true,
        allProjects,
        activeCount: acitve,
        completeCount: complete,
      }),
    );
    return NextResponse.json({
      message: "All your projects found",
      workingOn,
      success: true,
      allProjects,
      activeCount: acitve,
      completeCount: complete,
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
