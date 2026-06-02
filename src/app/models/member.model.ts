import mongoose from "mongoose";
const MemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "user",
    },
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Project ID is required"],
      ref: "project",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      default: null,
      minlength: [3, "Member designation must be atleast 3 characters long"],
    },
  },
  { timestamps: true, strict: true },
);
MemberSchema.index({ forProject: 1, user: 1 }, { unique: true });
export default mongoose.models.member || mongoose.model("member", MemberSchema);
