import { connectToDB } from "@/app/lib/connectToDB";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";
import taskModel from "@/app/models/task.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
memberModel;
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> },
) {
  try {
    await connectToDB();
    const { taskId } = await context.params;
    const body = await req.json();
    const updatedTask = await taskModel
      .findByIdAndUpdate(taskId, { isDone: true }, { new: true })
      .populate("assignedTo")
      .populate("assignedBy");
    if (!updatedTask) {
      return NextResponse.json({
        message: "Task not found",
        success: false,
      });
    }
    if (body.byUser != body.forUser) {
      const newNotification = await notificationModel.create({
        forUser: body.forUser,
        byUser: body.byUser,
        forProject: body.forProject,
        addedMs: Date.now(),
        on: "Task",
        action: "Complete",
      });
      const sendNotification = await notificationModel
        .findById(newNotification._id)
        .populate("forProject")
        .populate("byUser");

      await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/emit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "task-completed",
          userId: body.forUser,
          payload: sendNotification,
        }),
      });
      // console.log("Task finish notification : ", newNotification);
    }
    return NextResponse.json({
      message: "Task completed",
      success: true,
      task: updatedTask,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      let messages = Object.values(error.errors).map((err) => err.message);
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
  context: { params: Promise<{ taskId: string }> },
) {
  try {
    await connectToDB();
    const { taskId } = await context.params;
    const deletedTask = await taskModel.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return NextResponse.json({
        message: "Task not found",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Task deleted",
      success: true,
      deletedTask,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      let messages = Object.values(error.errors).map((err) => err.message);
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
