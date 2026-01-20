import connectDB from "@/backend/config/db";
import Reminder from "@/backend/models/reminder.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const reminders = await Reminder.find();
  return NextResponse.json(reminders);
}
