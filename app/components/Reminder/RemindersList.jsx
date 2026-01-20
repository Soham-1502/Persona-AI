import ReminderRow from "./ReminderRow";
import { Inbox } from "lucide-react";

export default function RemindersList({ selectedFilter, remindersData, onToggle }) {

    const filteredReminders = selectedFilter === 'all' ? remindersData : remindersData.filter((reminder) => {
        return reminder.status === selectedFilter;
    });

    return (
        <div className="flex flex-col gap-2">
            {remindersData.length === 0 ? (
                <div className="flex gap-2 justify-center items-center text-muted-foreground pr-2 py-30">
                    <Inbox /><p>No reminders found</p>
                </div>
            ) : (
                filteredReminders.map((reminder) => {
                    return <ReminderRow key={reminder.id} reminder={reminder} onToggle={onToggle}/>
                })
            )}
        </div>
    )
}
