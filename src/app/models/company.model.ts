import mongoose from "mongoose";
const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
    },
    companyPic: {
      type: String,
      required: [true, "Company Logo is required"],
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.models.company ||
  mongoose.model("company", CompanySchema);
