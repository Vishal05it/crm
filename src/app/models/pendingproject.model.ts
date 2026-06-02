import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      minlength: [5, "Project title must be atleast 5 characters long"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      minlength: [20, "Project description must be atleast 20 characters long"],
    },
    createdMs: {
      type: Number,
      required: [true, "Initialization time is required"],
    },
    isFailed: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Number,
      required: [true, "Deadline is required"],
    },
    deadlineDate: {
      type: String,
      required: [true, "Deadline date is required"],
    },
    addedMs: {
      type: Number,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Creator ID is required"],
    },
    designation: {
      type: String,
      required: [true, "Creator's designation is required"],
    },
    forCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: [true, "Company ID is required"],
    },
    required: {
      type: Number,
      required: [true, "Expected time to finish the project is required"],
    },
  },
  { timestamps: true,strict:true },
);
ProjectSchema.index({ title: 1 }, { unique: true });
export default mongoose.models.pendingproject ||
  mongoose.model("pendingproject", ProjectSchema);
