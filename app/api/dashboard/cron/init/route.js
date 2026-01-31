import { NextResponse } from "next/server";
import { runReminderJob } from "@/services/reminders/ReminderRunner";

let started = false;

export async function GET() {
  if (!started) {
    runReminderJob();
    started = true;
  }

  return NextResponse.json({
    message: "Reminder job executed",
  });
}
