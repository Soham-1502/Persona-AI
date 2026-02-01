import { NextResponse } from "next/server";
import { User, validate } from "../../../../models/User";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { error } = validate(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: body.email });
    if (user) {
      return NextResponse.json(
        { message: "User with given email already exists!" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashPassword = await bcrypt.hash(body.password, salt);

    await new User({
      ...body,
      password: hashPassword,
    }).save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}