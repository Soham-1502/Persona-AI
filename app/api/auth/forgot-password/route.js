import { NextResponse } from "next/server";
import { User } from "@/models/User";
import nodemailer from "nodemailer";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.fromGoogle && !user.password) {
      return NextResponse.json({ message: "This account uses Google Sign-In" }, { status: 400 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<h2>Password Reset Request</h2><p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}