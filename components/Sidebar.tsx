"use client";

import { cn } from "@/lib/utils";
import {
    LayoutGrid,
    Mic,
    Users,
    GraduationCap,
    BrainCircuit,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { icon: Mic, label: "Voice Coach", href: "/voice-coach" },
    { icon: Users, label: "Social Mentor", href: "/social-mentor" },
    { icon: GraduationCap, label: "Micro-Learning", href: "/micro-learning" },
    { icon: BrainCircuit, label: "InQuizzo", href: "/inquizzo" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(true);

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-border">
                <div className="bg-primary/20 p-2 rounded-lg cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
                    <LayoutGrid className="text-primary w-6 h-6" />
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-primary/10",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-muted-foreground hover:text-white",
                                collapsed ? "justify-center" : "justify-start"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-border flex flex-col gap-2">
                <button
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-white hover:bg-primary/10 transition-all",
                        collapsed ? "justify-center" : "justify-start"
                    )}
                >
                    <Settings className="w-5 h-5" />
                    {!collapsed && <span>Settings</span>}
                </button>
            </div>
        </aside>
    );
}
