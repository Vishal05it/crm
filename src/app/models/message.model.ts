import mongoose from "mongoose";
const trackerSchema = new mongoose.Schema(
  {
    addedMs: {
      type: Number,
      required: [true, "Time of message is required"],
    },
    modifiedMs: {
      type: Number,
      required: [true, "Time of message editing is required"],
    },
    editBlock: {
      type: Number,
      required: [true, "Time of edit blocking is required"],
    },
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Sender ID is required"],
    },
    message: {
      type: String,
      minlength: [1, "Cannot send empty message"],
    },
    isModified: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
    forCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: [true, "Company ID is required"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.message ||
  mongoose.model("message", trackerSchema);
