import connectDB from "../../lib/db.js";
import Reminder from "../../models/reminder.model.js";

export async function runReminderJob() {
  await connectDB(); // ensure mongoose connection

  const now = new Date();

  const reminders = await Reminder.find({
    date: { $lte: now },
    status: "pending",
  });

  for (const reminder of reminders) {
    reminder.status = "completed";
    reminder.completedAt = new Date();
    console.log("Before save:", reminder.status, reminder.completedAt);

    await reminder.save();
  }

  console.log(`[ReminderJob] Triggered ${reminders.length} reminder(s)`);
}
