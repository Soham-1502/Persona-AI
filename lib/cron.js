import cron from "node-cron";
import { runReminderJob } from "../services/reminders/ReminderRunner";

let isRunning = false;

export function startReminderCron() {
  if (isRunning) return;
  isRunning = true;

  cron.schedule("* * * * *", async () => {
    try {
      await runReminderJob();
    } catch (err) {
      console.error("[ReminderCron] Error:", err);
    }
  });

  console.log("⏰ Reminder cron started (runs every minute)");
}
