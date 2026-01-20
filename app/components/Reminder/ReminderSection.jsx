'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ReminderFilters } from "./ReminderFilters.jsx";
import ReminderList from "./RemindersList.jsx";

import { useState } from "react";
import { remindersData } from "./RemindersData.js";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewReminderDialog } from "./NewReminder/NewReminderDialog.jsx";

export default function ReminderSection() {

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [reminders, setReminders] = useState(remindersData);

    const toggleReminderStatus = (id) => {
        setReminders(prev =>
            prev.map(reminders =>
                reminders.id === id
                    ? reminders.status === "completed"
                        ? { ...reminders, status: "pending", completedAt: null }
                        : {
                            ...reminders,
                            status: "completed",
                            completedAt: new Date().toISOString()
                        }
                    : reminders
            )
        );
    };


    return (
        <Card className="max-h-122 flex flex-col justify-between border border-border bg-card/95 pr-2">
            <CardHeader className="flex flex-col">
                <div className="flex items-center justify-between w-full mb-1">
                    <p className="text-lg font-medium">Reminders</p>
                    <NewReminderDialog>
                        <Button className="cursor-pointer">
                            <Plus size={20} />
                            Add Reminder
                        </Button>
                    </NewReminderDialog>
                </div>
                <div className="flex flex-wrap">
                    <ReminderFilters value={selectedFilter} onValueChange={setSelectedFilter} />
                </div>
            </CardHeader>
            <CardContent className="flex-1 h-20 overflow-y-auto pr-2">
                <ReminderList remindersData={reminders} selectedFilter={selectedFilter} onToggle={toggleReminderStatus} />
            </CardContent>
        </Card>
    )
}