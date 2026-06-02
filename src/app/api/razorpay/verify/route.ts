import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/app/lib/connectToDB";
import userModel from "@/app/models/user.model";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_signature, orderId, userId } = body;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${orderId}|${razorpay_payment_id}`)
      .digest("hex");
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          message: "Invalid Payment Signature",
          success: false,
        },
        { status: 400 },
      );
    }
    await connectToDB();
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        allowed: true,
        paymentStatus: "paid",
      },
      { new: true },
    );
    return NextResponse.json({
      message: "Payment verified successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Verification failed",
        success: false,
      },
      { status: 500 },
    );
  }
}
