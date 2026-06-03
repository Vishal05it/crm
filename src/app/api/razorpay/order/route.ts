import { razorpay } from "@/app/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await razorpay.orders.create({
      amount: 49900,
      currency: "INR",
      receipt: `${body.userId}_${Date.now()}`,
      notes: {
        userId: body.userId,
        email: body.email,
      },
    });
    return NextResponse.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to create order",
      success: false,
      status: 500,
    });
  }
}
