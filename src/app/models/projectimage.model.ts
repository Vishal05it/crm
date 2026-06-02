import mongoose from "mongoose";
const ProjectImageSchema = new mongoose.Schema(
  {
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.projectimage ||
  mongoose.model("projectimage", ProjectImageSchema);
