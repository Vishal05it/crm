import { connectToDB } from "@/app/lib/connectToDB";
import userModel from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import companyModel from "@/app/models/company.model";

import pendinguserModel from "@/app/models/pendinguser.model";
import pendingprojectModel from "@/app/models/pendingproject.model";
import taskModel from "@/app/models/task.model";
import memberModel from "@/app/models/member.model";
import pendingimageModel from "@/app/models/pendingimage.model";
import projectimageModel from "@/app/models/projectimage.model";
import projectModel from "@/app/models/project.model";
import notificationModel from "@/app/models/notification.model";
import completeprojectModel from "@/app/models/completeproject.model";
import droppedprojectModel from "@/app/models/droppedproject.model";
import messageModel from "@/app/models/message.model";
import messagetrackerModel from "@/app/models/messagetracker.model";
import { redis } from "@/app/lib/redis";
companyModel;
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    let currUser = await userModel.findById(userId);
    if (!currUser) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }
    let body = await req.json();
    const userExist = await userModel.findOne({ email: body.email });
    if (userExist) {
      return NextResponse.json({
        message: "Email already registered",
        success: false,
      });
    }
    let matchPass = await bcrypt.compare(body.password, currUser.password);
    if (!matchPass) {
      return NextResponse.json({
        message: "Incorrect Password",
        success: false,
      });
    }
    let updatedUser = await userModel
      .findByIdAndUpdate(userId, { email: body.email }, { new: true })
      .select("-password -allowed")
      .populate("companyId");
    return NextResponse.json({
      message: "Email changed successfully",
      success: true,
      user: updatedUser,
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
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    let currUser = await userModel.findById(userId);
    if (!currUser) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }
    let body = await req.json();
    let matchPass = await bcrypt.compare(body.currPass, currUser.password);
    if (!matchPass) {
      return NextResponse.json({
        message: "Incorrect Password",
        success: false,
      });
    }
    let salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(body.newPass, salt);
    let updatedUser = await userModel
      .findByIdAndUpdate(userId, { password: newPassword }, { new: true })
      .populate("companyId")
      .select("-password -allowed");
    if (updatedUser) {
      return NextResponse.json({
        message: "Password updated successfully",
        success: true,
        user: updatedUser,
      });
    } else
      return NextResponse.json({
        message: "Something went wrong, please try again",
        success: false,
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
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({
        message: "Account not found or already deleted",
        success: false,
      });
    }
    // Delete OTPs :
    let allUsers = [];
    if (user.isManager) {
      allUsers = await userModel.find({ companyId: user.companyId });
    }
    // Delete Message Trackers :
    let allMessages: any = [];
    let allUserMessages = [];
    if (user.isManager) {
      const deleteTrackers = await messagetrackerModel.deleteMany({
        forCompany: user.companyId,
      });
    } //else {
    //   let allUserMessages = await messageModel.find({ sentBy: userId });
    //   await Promise.all(
    //     allUserMessages.map(async (msg) => {
    //       const deleteTrackers = await messagetrackerModel.deleteMany({
    //         messageId: msg._id,
    //       });
    //     }),
    //   );
    // }
    // // Delete Messages :
    if (user.isManager) {
      const deleteManagerMessages = await messageModel.deleteMany({
        forCompany: user.companyId,
      });
    } //else {
    //   const deleteMyMessages  = await messageModel.deleteMany({
    //     sentBy: userId,
    //   });
    // }
    // Delete Pending Users :
    if (user.isManager) {
      const deletePendingUsers = await pendinguserModel.deleteMany({
        companyId: user.companyId,
      });
    }
    // Delete Pending Projects :
    if (user.isManager) {
      const deletePendingProjects = await pendingprojectModel.deleteMany({
        forCompany: user.companyId,
      });
    }
    // Delete Tasks :
    let whereUsersAreMembers: any[] = [];
    if (user.isManager) {
      await Promise.all(
        allUsers?.map(async (userElm) => {
          whereUsersAreMembers = await memberModel.find({ user: userElm._id });
        }),
      );
      await Promise.all(
        whereUsersAreMembers.map(async (member) => {
          let deletedTasks = await taskModel.deleteMany({
            assignedTo: member._id,
          });
        }),
      );
    } else {
      let whereUserIsMember = await memberModel.find({ user: user._id });
      await Promise.all(
        whereUserIsMember.map(async (member) => {
          let deletedTasks = await taskModel.deleteMany({
            assignedTo: member._id,
          });
        }),
      );
    }
    // Delete Project Images :
    if (user.isManager) {
      // Delete only uploaded Pending Project Images :
      const deletePendingImages = await pendingimageModel.deleteMany({
        byUser: user._id,
      });
    }
    // Delete Notifications :
    let allProjects = [];
    if (user.isManager) {
      allProjects = await projectModel.find({ forCompany: user.companyId });
      // Delete Project Notifications
      await Promise.all(
        allProjects.map(async (project) => {
          const deleteProjectNotifications = await notificationModel.deleteMany(
            { forProject: project._id },
          );
        }),
      );
      // Delete Account Notifications :
      const deleteByUserNots = await notificationModel.deleteMany({
        byUser: user._id,
      });
      const deleteForUserNots = await notificationModel.deleteMany({
        forUser: user._id,
      });
    } else {
      const deleteByUserNots = await notificationModel.deleteMany({
        byUser: user._id,
      });
      const deleteForUserNots = await notificationModel.deleteMany({
        forUser: user._id,
      });
    }
    // Delete Project Images :
    if (user.isManager) {
      await Promise.all(
        allProjects.map(async (project) => {
          const deleteProjectImages = await projectimageModel.deleteMany({
            forProject: project._id,
          });
        }),
      );
    }

    // Delete Members :
    if (user.isManager) {
      await Promise.all(
        allProjects.map(async (project) => {
          const deleteAllMembers = await memberModel.deleteMany({
            forProject: project._id,
          });
        }),
      );
      const removeMembers = await memberModel.deleteMany({ user: user._id });
    } else {
      let adminMembers = 0;
      await Promise.all(
        allProjects.map(async (project) => {
          const currMember = await memberModel.findOne({
            forProject: project._id,
            user: user._id,
          });
          adminMembers = await memberModel.countDocuments({
            isAdmin: true,
            forProject: project._id,
          });
          if (adminMembers <= 1 && currMember.isAdmin) {
            const deleteAllTasks = await taskModel.deleteMany({
              forProject: project._id,
            });
            const deleteAllMembers = await memberModel.deleteMany({
              forProject: project._id,
            });
            const deleteAllNots = await notificationModel.deleteMany({
              forProject: project._id,
            });
            const deleteProjectImages = await projectimageModel.deleteMany({
              forProject: project._id,
            });
            const deletePendingProjectImages =
              await pendingimageModel.deleteMany({ forProject: project._id });
            const deleteComplete = await completeprojectModel.deleteOne({
              projectId: project._id,
            });
            const deleteDropped = await droppedprojectModel.deleteOne({
              projectId: project._id,
            });
            const deleteProject = await projectModel.findByIdAndDelete(
              project._id,
            );
          }
        }),
      );

      const removeMembers = await memberModel.deleteMany({ user: user._id });
    }
    //Delete Completed Projects :
    if (user.isManager) {
      await Promise.all(
        allProjects.map(async (project) => {
          const deleteComplete = await completeprojectModel.deleteOne({
            projectId: project._id,
          });
        }),
      );
    }
    //Delete Dropped Projects :
    if (user.isManager) {
      await Promise.all(
        allProjects.map(async (project) => {
          const deleteComplete = await droppedprojectModel.deleteOne({
            projectId: project._id,
          });
        }),
      );
    }
    // Delete Projects :
    if (user.isManager) {
      const deleteProjects = await projectModel.deleteMany({
        forCompany: user.companyId,
      });
    }
    // Delete company :
    if (user.isManager) {
      const deleteCompany = await companyModel.findByIdAndDelete(
        user.companyId,
      );
    }
    // Delete Users :
    if (user.isManager) {
      const deleteUsers = await userModel.deleteMany({
        companyId: user.companyId,
      });
    } else {
      const deleteUser = await userModel.findByIdAndDelete(userId);
    }
    await Promise.all(
      allProjects.map(async (project) => {
        await redis.del(
          `allProjects:projectId:${project._id}:userId:${userId}`,
        );
      }),
    );
    return NextResponse.json({
      message: "Account deleted successfully",
      success: true,
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
