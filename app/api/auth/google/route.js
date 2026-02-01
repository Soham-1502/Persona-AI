import { NextResponse } from "next/server";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { email, name, picture, googleId } = await req.json();

    if (!email || !googleId) {
      return NextResponse.json({ message: "Email and Google ID required" }, { status: 400 });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, picture, googleId, fromGoogle: true });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.fromGoogle = true;
      user.picture = picture;
      await user.save();
    }

    const token = user.generateAuthToken();

    return NextResponse.json({
      data: token,
      message: "Google login successful",
      user: { email: user.email, name: user.name, picture: user.picture }
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}