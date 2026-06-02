import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
const DroppedProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
      unique: [true, "Same project can't be dropped twice"],
    },
    reason: {
      type: String,
      required: [true, "Reason for dropping required"],
      minlength: [5, "Reason can't be less than 5 characters"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.droppedproject ||
  mongoose.model("droppedproject", DroppedProjectSchema);
