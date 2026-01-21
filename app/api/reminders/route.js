import { createReminder } from "@/backend/services/reminders/reminder.service";
import connectDB from "@/backend/config/db.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await req.json();
    
    console.log('Creating reminder with data:', body);

    // Validate required fields
    if (!body.title || !body.date) {
      return NextResponse.json(
        { success: false, error: 'Title and date are required' },
        { status: 400 }
      );
    }

    // Create reminder
    const reminder = await createReminder(body);

    console.log('Reminder created successfully:', reminder);

    return NextResponse.json(
      { success: true, data: reminder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/reminders:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create reminder',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

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

// Add GET method for testing
export async function GET(req) {
  try {
    await connectDB();
    
    return NextResponse.json(
      { success: true, message: 'Reminders API is working' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}