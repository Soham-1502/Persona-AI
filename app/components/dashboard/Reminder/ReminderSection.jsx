'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ReminderFilters } from "./ReminderFilters.jsx";
import ReminderList from "./RemindersList.jsx";

import { useState, useEffect } from "react"; // Added useEffect
import { Plus, Loader2 } from "lucide-react"; // Added Loader2 for better UX
import { Button } from "@/components/ui/button";
import { NewReminderDialog } from "./NewReminderDialog.jsx";

export default function ReminderSection() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    // Initialize with an empty array instead of mock data
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Function to fetch all reminders from the database
    const fetchReminders = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/dashboard/reminders"); // Targets your GET route
            const result = await response.json();

            if (response.ok && result.success) {
                setReminders(result.data); // result.data matches your route.js structure
            } else {
                console.error("Failed to fetch:", result.error);
            }
        } catch (error) {
            console.error("Error fetching reminders:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch data on component mount
    useEffect(() => {
        fetchReminders();
    }, []);

    // 3. Callback to update UI when a new reminder is created via NewReminderDialog
    const handleReminderCreated = (newReminder) => {
        setReminders((prev) => [newReminder, ...prev]);
    };

    const handleReminderUpdated = (updatedReminder) => {
        setReminders((prev) =>
            prev.map((rem) => (rem._id === updatedReminder._id ? updatedReminder : rem))
        );
    };

    const handleReminderDeleted = (deletedId) => {
        // Filter out the reminder that has the matching MongoDB _id
        setReminders((prev) => prev.filter(reminder => reminder._id !== deletedId));
    };

    const toggleReminderStatus = async (id) => {
        // 1. Find the current status to toggle it
        const reminderToUpdate = reminders.find(r => r._id === id);
        if (!reminderToUpdate) return;

        const newStatus = reminderToUpdate.status === "completed" ? "pending" : "completed";
        const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

        try {
            // 2. Persist to Database
            const response = await fetch(`/api/reminders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...reminderToUpdate,
                    status: newStatus,
                    completedAt: completedAt
                }),
            });

            if (response.ok) {
                // 3. Update Local State for instant UI feedback
                setReminders(prev =>
                    prev.map(rem =>
                        rem._id === id
                            ? { ...rem, status: newStatus, completedAt: completedAt }
                            : rem
                    )
                );
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    };

    return (
        <Card className="max-h-122 flex flex-col justify-between border border-border bg-card/95 pr-2">
            <CardHeader className="flex flex-col">
                <div className="flex items-center justify-between w-full mb-1">
                    <p className="text-lg font-medium">Reminders</p>
                    {/* Pass the callback to the dialog */}
                    <NewReminderDialog onReminderCreated={handleReminderCreated}>
                        <Button className="cursor-pointer">
                            <Plus size={20} />
                            Add Reminder
                        </Button>
                    </NewReminderDialog>
                </div>
                <div className="flex flex-wrap">
                    <ReminderFilters
                        value={selectedFilter}
                        onValueChange={(value) => {
                            if (!value) return;
                            setSelectedFilter(value);
                        }} />
                </div>
            </CardHeader>
            <CardContent className="flex-1 h-20 overflow-y-auto pr-2">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ReminderList
                        remindersData={reminders}
                        selectedFilter={selectedFilter}
                        onToggle={toggleReminderStatus}
                        handleReminderDeleted={handleReminderDeleted}
                        onReminderUpdated={handleReminderUpdated}
                    />
                )}
            </CardContent>
        </Card>
    )
}