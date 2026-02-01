import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || String(user.resetOTP) !== String(otp) || Date.now() > user.resetOTPExpiry) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}