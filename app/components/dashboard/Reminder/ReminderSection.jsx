// This is in app/components/dashboard/Reminder/ReminderSection.jsx

'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ReminderFilters } from "./ReminderFilters.jsx";
import ReminderList from "./RemindersList.jsx";

import { useState, useEffect } from "react";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewReminderDialog } from "./NewReminderDialog.jsx";
import { isAuthenticated, clearAuth } from "@/lib/auth-client";

export default function ReminderSection() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch reminders function
    const fetchReminders = async () => {
        if (!isAuthenticated()) {
            clearAuth();
            window.location.href = '/login';
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/dashboard/reminders", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();

            if (response.ok && result.success) {
                setReminders(result.data);
            } else {
                console.error("Failed to fetch:", result.error);
            }
        } catch (error) {
            console.error("Error fetching reminders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh reminders function
    const handleRefresh = async () => {
        if (!isAuthenticated()) {
            clearAuth();
            window.location.href = '/login';
            return;
        }

        setRefreshing(true);
        try {
            const [response] = await Promise.all([
                fetch("/api/dashboard/reminders", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                new Promise(resolve => setTimeout(resolve, 600)) // Min delay to show animation
            ]);

            const result = await response.json();

            if (response.ok && result.success) {
                setReminders(result.data);
            } else {
                console.error("Failed to fetch:", result.error);
            }
        } catch (error) {
            console.error("Error fetching reminders:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchReminders();
    }, []);

    const handleReminderCreated = (newReminder) => {
        setReminders((prev) => [newReminder, ...prev]);
    };

    const handleReminderUpdated = (updatedReminder) => {
        setReminders((prev) =>
            prev.map((rem) => (rem._id === updatedReminder._id ? updatedReminder : rem))
        );
    };

    const handleReminderDeleted = (deletedId) => {
        setReminders((prev) => prev.filter(reminder => reminder._id !== deletedId));
    };

    const toggleReminderStatus = async (id) => {
        const reminderToUpdate = reminders.find(r => r._id === id);
        if (!reminderToUpdate) return;

        const newStatus = reminderToUpdate.status === "completed" ? "pending" : "completed";
        const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

        try {
            const response = await fetch(`/api/dashboard/reminders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...reminderToUpdate,
                    status: newStatus,
                    completedAt: completedAt
                }),
            });

            if (response.ok) {
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
        <Card className="col-span-full lg:col-span-1 max-h-122 flex flex-col justify-between border border-border bg-card/95 pr-2">
            <CardHeader className="flex flex-col">
                <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-1">
                        <p className="text-lg font-medium">Reminders</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    <NewReminderDialog onReminderCreated={handleReminderCreated}>
                        <Button className="cursor-pointer shrink-0 flex items-center gap-1">
                            <Plus size={18} />
                            <span className="hidden lg:inline 2xl:hidden">Add</span>
                            <span className="inline lg:hidden 2xl:inline">Add Reminder</span>
                        </Button>
                    </NewReminderDialog>
                </div>
                <div className="flex flex-wrap w-full">
                    <ReminderFilters
                        value={selectedFilter}
                        onValueChange={(value) => {
                            if (!value) return;
                            setSelectedFilter(value);
                        }}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 h-20 overflow-y-auto pr-2">
                {loading || refreshing ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                            {refreshing ? 'Refreshing reminders...' : 'Loading reminders...'}
                        </p>
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