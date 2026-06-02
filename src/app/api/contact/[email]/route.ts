import { connectToDB } from "@/app/lib/connectToDB";
import { transport } from "@/app/lib/nodemailer";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ email: string }> },
) {
  try {
    await connectToDB();
    const { email } = await context.params;
    const body = await req.json();
    transport.sendMail({
      from: process.env.EMAIL,
      to: "vishalweb.org@gmail.com",
      subject: `${body.subject ? body.subject : "No Subject Available"} sent by ${body.name}`,
      text: ` Customer's Email : ${email}
      Issue : 
      ${body.text}`,
    });
    return NextResponse.json({
      message:
        "Thank you for contacting us, we will respond you within 24 - 48 hours",
      success: true,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({
        message: messages[0],
        success: false,
      });
    }
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
