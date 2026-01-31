import Reminder from "../../models/reminder.model.js";

export async function createReminder(data) {
  return Reminder.create({
    title: data.title,
    module: data.module,
    date: new Date(data.date),
    priority: data.priority || "medium",
    status: "pending",
    completedAt: null,
  });
}