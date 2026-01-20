'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Bell, Sun, Moon, MonitorCog } from "lucide-react";
import { useTheme } from "next-themes";

export function DateFilter({ value, onValueChange }) {
    return (
        <div className='w-32 h-20 flex items-center justify-center rounded-lg'>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={cn(
                    "h-20 w-full bg-background text-foreground border-ring/5 py-2 border-2 cursor-pointer transition-all duration-200 ease-in-out",
                    "hover:border-ring hover:border-2",
                    "dark:bg-background dark:text-foreground"
                )}>
                    <SelectValue placeholder="Date Filter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last7">Last 7 Days</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export function Notifications() {
    return (
        <div className={cn("h-10 w-10 border-0 border-ring flex items-center justify-center rounded-lg transition-all duration-100 ease-in-out cursor-pointer",
            "hover:border-ring hover:border-2")}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <button>
                        <Bell />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={15} alignOffset={-5}>
                    <div className='p-2'>
                        No Notifications
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export function Theme() {
    const { theme, setTheme } = useTheme();
    return (
        <div className={cn("h-10 w-10 border-0 border-ring flex items-center justify-center rounded-lg transition-all duration-100 ease-in-out cursor-pointer",
            "hover:border-ring hover:border-2"
        )} >
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <button size="icon">
                        <Sun className='scale-100 dark:scale-0' />
                        <Moon className='absolute -translate-y-6 scale-0 dark:scale-100' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={15} alignOffset={-5}>
                    <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                        <Sun /> Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                        <Moon /> Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                        <MonitorCog /> System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}