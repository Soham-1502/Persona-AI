import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db.js";
import Reminder from "@/backend/models/reminder.model";

// Get a single reminder by ID
export async function GET(req, { params }) {
  try {
    await connectDB();

    // Await params in Next.js 15+
    const { id } = await params;

    console.log("Fetching reminder with ID:", id);

    // Validate MongoDB ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid reminder ID format" },
        { status: 400 },
      );
    }

    const reminder = await Reminder.findById(id);

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: reminder });
  } catch (error) {
    console.error("Error in GET /api/reminders/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Update a reminder by ID
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // The frontend sends 'date' as 'datetime' in some contexts,
    // ensure we map it correctly to the schema field
    const updateData = {
      title: body.title,
      module: body.module,
      date: body.date,
      priority: body.priority,
      status: body.status, // Ensure status can be updated
      completedAt: body.completedAt, // Ensure completion dates are saved
    };

    const reminder = await Reminder.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: reminder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Delete a reminder by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("Deleting reminder with ID:", id);

    // Validate MongoDB ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid reminder ID format" },
        { status: 400 },
      );
    }

    const reminder = await Reminder.findByIdAndDelete(id);

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reminder deleted successfully",
      data: reminder,
    });
  } catch (error) {
    console.error("Error in DELETE /api/reminders/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
