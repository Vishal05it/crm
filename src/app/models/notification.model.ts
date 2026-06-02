import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    byUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "By User ID is required"],
    },
    addedMs: {
      type: Number,
      required: [true, "Time of notification creation is required"],
    },
    forUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "For User ID is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    on: {
      type: String,
      required: [true, "Notification on what is required"],
      enum: [
        "Member",
        "Approval",
        "Account",
        "Task",
        "Image",
        "Project",
        "Complete",
        "ImageApproval",
        "Admin",
      ],
    },
    action: {
      type: String,
      enum: ["Add", "Remove", "Complete"],
    },
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
    title: {
      type: String,
    },
  },
  { timestamps: true, strict: true },
);
notificationSchema.index({ forUser: 1 });
export default mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
