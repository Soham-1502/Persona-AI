import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { formatCompletedDate, formatDate } from "./utils/formatDate";
import { cn } from "@/lib/utils.js";

import { EditReminderDialog } from "./EditReminderDialogue.jsx";
import { DeleteReminderAlert } from "./DeleteReminderAlert.jsx";

export default function ReminderRow({ reminder, onToggle, onReminderUpdated, onReminderDeleted }) {
    const formattedDate = reminder.status === "completed" ? `Completed • ${formatCompletedDate(reminder.completedAt)}` : formatDate(reminder.date);

    function getReminderStatus(reminder) {
        const date = new Date(reminder.date);
        const now = new Date("2025-09-14"); // Change this to current date LATER 

        if (reminder.status === 'completed') return 'completed';
        if (date < now) return 'overdue';
        if (date.toDateString() === now.toDateString()) return 'today';
        return 'upcoming';
    }

    const ReminderStatus = {
        today: "border-l-4 border-l-yellow-400",
        overdue: "border-l-4 border-l-red-500",
        upcoming: "border-l-4 border-l-blue-400",
        completed: "border-l-4 border-l-green-400",
    }

    const ReminderState = getReminderStatus(reminder);

    return (
        <Label htmlFor={`reminder-${reminder._id}`} className={cn(
            "flex h-fit w-full border-muted border-2 p-2 py-3 rounded-lg gap-3 items-center justify-between hover:bg-muted/30 cursor-pointer",
            ReminderStatus[ReminderState]
        )}>
            <div className="flex flex-row gap-3 items-center">
                <Checkbox id={`reminder-${reminder._id}`}
                    checked={reminder.status === "completed"} onCheckedChange={() => onToggle(reminder._id)}
                />
                <div className="flex flex-col">
                    <p className="text-md font-medium">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                </div>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top" sideOffset={10}>
                        <EditReminderDialog
                            reminder={reminder}
                            onReminderUpdated={(updatedReminder) => {
                                console.log("Reminder updated:", updatedReminder);
                                if (onReminderUpdated) {
                                    onReminderUpdated(updatedReminder);
                                }
                            }}
                        >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Reminder
                            </DropdownMenuItem>
                        </EditReminderDialog>

                        <DeleteReminderAlert
                            reminder={reminder}
                            onReminderDeleted={onReminderDeleted} // This links to handleReminderDeleted in Section
                        >
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={(e) => e.preventDefault()} // CRITICAL: This keeps the alert open
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Reminder
                            </DropdownMenuItem>
                        </DeleteReminderAlert>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Label>
    )
}