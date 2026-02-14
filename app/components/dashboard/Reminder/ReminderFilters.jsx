// This is in app/components/dashboard/Reminder/ReminderFilters.jsx

import { Star, CircleCheck, CalendarArrowUp, Clock, AlertCircle, RefreshCw } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

export function ReminderFilters({ value, onValueChange, onRefresh, refreshing }) {
    return (
        <div className="flex items-center justify-between w-full gap-2 relative">
            <ToggleGroup type="single" variant="outline" spacing={2} className="flex flex-wrap" value={value} onValueChange={onValueChange}>
                <ToggleGroupItem
                    value="all"
                    aria-label="Toggle All"
                    className="data-[state=on]:bg-red-500/20 data-[state=on]:text-red-500 [&[data-state=on]>svg]:fill-red-500 [&[data-state=on]>svg]:text-white data-[state=on]:border-red-800"
                >
                    <Star />
                    All
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="completed"
                    aria-label="Toggle Completed"
                    className="data-[state=on]:bg-green-500/20 data-[state=on]:text-green-500 [&[data-state=on]>svg]:fill-green-500 [&[data-state=on]>svg]:text-white data-[state=on]:border-green-800"
                >
                    <CircleCheck />
                    Completed
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="upcoming"
                    aria-label="Toggle Upcoming"
                    className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400 [&[data-state=on]>svg]:fill-blue-400 data-[state=on]:border-blue-800 [&[data-state=on]>svg]:text-white"
                >
                    <CalendarArrowUp />
                    Upcoming
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="pending"
                    aria-label="Toggle Pending"
                    className="data-[state=on]:bg-yellow-500/20 data-[state=on]:text-white [&[data-state=on]>svg]:fill-yellow-400 [&[data-state=on]>svg]:stroke-white data-[state=on]:border-yellow-800 [&[data-state=on]>svg]:text-white"
                >
                    <Clock />
                    Pending
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="overdue"
                    aria-label="Toggle Overdue"
                    className="data-[state=on]:bg-orange-500/20 data-[state=on]:text-orange-500 [&[data-state=on]>svg]:fill-orange-500 [&[data-state=on]>svg]:text-white data-[state=on]:border-orange-800"
                >
                    <AlertCircle />
                    Overdue
                </ToggleGroupItem>
            </ToggleGroup>
            
            <Button 
                variant="outline" 
                size="icon"
                onClick={onRefresh}
                disabled={refreshing}
                className="cursor-pointer shrink-0 absolute -right-4 bottom-0"
            >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
        </div>
    )
}