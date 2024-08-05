import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    const response = NextResponse.json({
      message: "Login Successful",
      success: true,
    });
    response.cookies.set("token", token, { httpOnly: true,expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    return response;
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
