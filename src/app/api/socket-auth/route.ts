import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function GET(req: NextRequest) {
  try {
    let cookieStore = req.cookies;
    console.log("Cookie Store : ", cookieStore);
    console.log("Cookie All : ", cookieStore.getAll());
    let authToken = cookieStore.getAll()[1].value;
    console.log("Token extracted : ", authToken);
    if (!authToken) {
      return NextResponse.json({
        message: "Token not found",
        success: false,
        cookieStore,
        cookieStoreAll: cookieStore.getAll(),
      });
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Secret Key missing");
    const decode: any = jwt.verify(authToken, SECRET_KEY as string);
    console.log("Decode", decode);
    const socketToken = jwt.sign(
      { userId: decode?.userId as string, type: "socket" },
      SECRET_KEY,
      {
        expiresIn: "2m",
      },
    );
    return NextResponse.json({
      message: "Socket token generated",
      success: true,
      socketToken,
    });
  } catch (error) {
    let cookieStore = await cookies();
    console.log(error);
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false,
        cookieAll: cookieStore.getAll(),
        token: cookieStore.getAll()[1].value,
      },
      { status: 401 },
    );
  }
}
