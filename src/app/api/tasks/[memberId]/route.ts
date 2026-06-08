import { connectToDB } from "@/app/lib/connectToDB";
import memberModel from "@/app/models/member.model";
import notificationModel from "@/app/models/notification.model";
import taskModel from "@/app/models/task.model";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
userModel;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ memberId: string }> },
) {
  try {
    await connectToDB();
    const { memberId } = await context.params;
    const body = await req.json();
    const member = await memberModel.findById(memberId).populate("user");
    if (!member) {
      return NextResponse.json({
        message: "Member not found",
        success: false,
      });
    }
    const newTask = await taskModel.create({
      task: body.task,
      isDone: false,
      assignedTo: memberId,
      assignedBy: body.assignedBy,
      forProject: body.forProject,
      addedAt: Date.now(),
    });
    const sendTask = await taskModel
      .findById(newTask._id)
      .populate("assignedTo")
      .populate("assignedBy");
    const assignedTo = await memberModel
      .findById(sendTask.assignedTo._id)
      .populate("user");
    const assignedBy = await memberModel
      .findById(sendTask.assignedBy._id)
      .populate("user");
    console.log(`For user = ${body.forUser} & By User = ${body.byUser}`);
    if (body.forUser != body.byUser) {
      const newNotification = await notificationModel.create({
        byUser: body.byUser,
        forUser: body.forUser,
        forProject: body.forProject,
        addedMs: Date.now(),
        on: "Task",
        action: "Add",
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
          event: "task-assigned",
          userId: body.forUser,
          payload: sendNotification,
        }),
      });
    }

    return NextResponse.json({
      message: "New task created",
      success: true,
      newTask: sendTask,
      assignedBy,
      assignedTo,
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
