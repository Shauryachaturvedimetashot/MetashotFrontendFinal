import User from "@/src/Models/User";
import connect from "@/src/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { companyname,email, password,type } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new NextResponse("User already exists", {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 7);
  const newUser = new User({
    companyname,
    email,
    password: hashedPassword,
    type
  });

  try {
    await newUser.save();
    return new NextResponse("User created successfully", {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};
