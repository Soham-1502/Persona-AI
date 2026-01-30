"use client";

import { useState } from "react";
import Header from '@/app/components/header/Header.jsx'; // Consistent Header from Home page
import { ChatInterface } from "@/app/components/ChatInterface/ChatInterface.jsx";
import { AvatarExperience } from "@/app/components/Avatar/AvatarExperience.jsx";

export default function SocialMentorPage() {
    const [isTalking, setIsTalking] = useState(false);

    // Date logic consistent with the dashboard pattern
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="w-full flex flex-col min-h-screen">
            {/* 1. Header Section - Using the pattern from Home.jsx */}
            <div>
                <Header 
                    DateValue="Interactive" 
                    onDateChange={() => {}} 
                    tempDate={today}
                    showDateFilter={false}
                />
            </div>

            {/* 2. Main Content Area - Refined spacing/layout to match dashboard grid flow */}
            <div className="flex-1 p-2 px-3 flex gap-3 h-[calc(100vh-80px)] overflow-hidden">
                
                {/* Left Panel: Chat Interface */}
                {/* Pattern: Defined width, card-style background, and shadows */}
                <section className="w-1/3 min-w-[350px] flex flex-col bg-card rounded-md border border-border shadow-md overflow-hidden">
                    <ChatInterface onTalkingStateChange={setIsTalking} />
                </section>

                {/* Right Panel: 3D Avatar Space */}
                {/* Pattern: flex-1 for growth, grid-like alignment, and background transitions */}
                <section className="flex-1 bg-linear-to-br from-card to-background rounded-md border border-border relative overflow-hidden flex flex-cols">
                    
                    {/* Status Badge: Following the MetricCard badge logic visually */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isTalking 
                            ? "bg-green-500/20 text-green-500 border border-green-500/20" 
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}>
                            {isTalking ? "● AI Speaking" : "○ Standing By"}
                        </div>
                    </div>

                    <AvatarExperience isTalking={isTalking} />
                </section>
                
            </div>
        </div>
    );
}