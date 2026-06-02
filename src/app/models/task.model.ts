import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, "Task name is required"],
      minlength: [5, "Task name must be more than 4 characters"],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: [true, "User to whom task is assigned is required"],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: [true, "User to who assigned the task is required"],
    },
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
    },
    addedAt: {
      type: Number,
      required: [true, "Time of adding task is required"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.task || mongoose.model("task", TaskSchema);
