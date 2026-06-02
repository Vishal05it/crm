import mongoose from "mongoose";
const CompleteProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
      unique: [true, "Cannot complete same project twice"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.completedproject ||
  mongoose.model("completedproject", CompleteProjectSchema);
