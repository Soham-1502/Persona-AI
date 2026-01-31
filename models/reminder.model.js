import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // later ObjectId or auth user id
      required: false, // keep false for now
    },
    title: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      default: "General",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "upcoming"],
      default: "pending",
    },
    date: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    collection: "Reminders",
  },
);

const UserDB = mongoose.connection.useDb("User");

export default UserDB.models.Reminder || UserDB.model("Reminder", ReminderSchema);
