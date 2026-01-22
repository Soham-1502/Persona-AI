import { createReminder } from "@/backend/services/reminders/reminder.service";
import connectDB from "@/backend/config/db.js";
import Reminder from "@/backend/models/reminder.model";
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

// Get all reminders
export async function GET(req) {
  try {
    await connectDB();
    
    const reminders = await Reminder.find({}).sort({ date: 1 });
    
    return NextResponse.json(
      { success: true, data: reminders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}