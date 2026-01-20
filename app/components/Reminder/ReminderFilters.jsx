import { Star, CircleCheck, CalendarArrowUp, Clock, ChevronDown } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ReminderFilters({ value, onValueChange }) {
    return (
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
                aria-label="Toggle In Progress"
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
        </ToggleGroup>
    )
}