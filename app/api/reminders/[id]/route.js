import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db.js";
import Reminder from "@/backend/models/reminder.model";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const reminder = await Reminder.findByIdAndUpdate(
      id,
      {
        title: body.title,
        module: body.module,
        date: body.date,
        priority: body.priority,
      },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: reminder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}