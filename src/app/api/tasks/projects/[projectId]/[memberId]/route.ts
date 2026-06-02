import { redis } from "@/app/lib/redis";
import memberModel from "@/app/models/member.model";
import taskModel from "@/app/models/task.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ memberId: string; projectId: string }> },
) {
  try {
    const { projectId, memberId } = await context.params;
    let cachedTasks = await redis.get(`allTasks:projectId:${projectId}`);
    if (cachedTasks) return NextResponse.json(JSON.parse(cachedTasks));

    let taskArr = [];
    const allTasks = await taskModel
      .find({
        forProject: projectId,
      })
      .populate("assignedTo")
      .populate("assignedBy");
    const finishedTasks = await taskModel.countDocuments({
      forProject: projectId,
      assignedTo: memberId,
      isDone: true,
    });
    const unFinishedTasks = await taskModel.countDocuments({
      forProject: projectId,
      assignedTo: memberId,
      isDone: false,
    });
    if (allTasks.length > 0) {
      taskArr = await Promise.all(
        allTasks.map(async (task) => {
          const assignedBy = await memberModel
            .findById(task.assignedBy._id)
            .populate("user");
          const assignedTo = await memberModel
            .findById(task.assignedTo._id)
            .populate("user");
          return {
            ...task,
            assignedBy,
            assignedTo,
          };
        }),
      );
    }
    const setCachedTasks = await redis.set(
      `allTasks:projectId:${projectId}`,
      JSON.stringify({
        message: "All your tasks found from Redis",
        success: true,
        tasks: taskArr,
        finishedTasks,
        unFinishedTasks,
      }),
    );
    return NextResponse.json({
      message: "All your tasks found",
      success: true,
      tasks: taskArr,
      finishedTasks,
      unFinishedTasks,
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
