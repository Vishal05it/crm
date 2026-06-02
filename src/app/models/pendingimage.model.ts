import mongoose from "mongoose";
const PendingImageSchema = new mongoose.Schema(
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
    byUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.pendingimage ||
  mongoose.model("pendingimage", PendingImageSchema);
