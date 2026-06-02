import mongoose from "mongoose";
const trackerSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      required: [true, "Message ID is required"],
    },
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
    },
    notReadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Notified to ID is required"],
    },
    forCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: [true, "Company ID is required"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.tracker ||
  mongoose.model("tracker", trackerSchema);
