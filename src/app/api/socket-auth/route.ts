import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  try {
    let cookieStore = req.cookies;
    let authToken = cookieStore.get("authToken")?.value;
    if (!authToken) {
      return NextResponse.json({
        message: "Token not found",
        success: false,
      });
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Secret Key missing");
    const decode: any = jwt.verify(authToken, SECRET_KEY as string);
    const socketToken = jwt.sign(
      { userId: decode?.userId as string, type: "socket" },
      SECRET_KEY,
      {
        expiresIn: "5m",
      },
    );
    return NextResponse.json({
      message: "Socket token generated",
      success: true,
      socketToken,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 },
    );
  }
}
