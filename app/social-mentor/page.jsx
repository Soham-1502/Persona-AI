"use client";

import { useState, useEffect } from "react";
import Header from '@/app/components/shared/header/Header.jsx';
import { ChatInterface } from "@/app/components/socialmentor/ChatInterface/ChatInterface.jsx";
import { AvatarExperience } from "@/app/components/socialmentor/Avatar/AvatarExperience.jsx";
import { History, X } from "lucide-react";

export default function SocialMentorPage() {
    const [isTalking, setIsTalking] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [activeMessages, setActiveMessages] = useState(null);

    useEffect(() => {
        if (showHistory) {
            fetch('/api/mentor/history')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setSessions(data.data || []);
                    } else {
                        console.error("Failed to fetch history:", data.error);
                    }
                })
                .catch(console.error);
        }
    }, [showHistory]);

    const loadSession = (session) => {
        setActiveSessionId(session.sessionId);
        setActiveMessages(session.messages);
        setShowHistory(false);
    };

    const startNewSession = () => {
        setActiveSessionId(Date.now().toString());
        setActiveMessages(null);
        setShowHistory(false);
    };

    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="w-full h-screen flex flex-col overflow-hidden bg-background">
            {/* Header Section */}
            <div className="shrink-0">
                <Header
                    DateValue="Interactive"
                    onDateChange={() => { }}
                    tempDate={today}
                    showDateFilter={false}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-2 px-3 flex gap-3 overflow-hidden">

                {/* Left Panel: Chat Interface */}
                <section className="w-[60%] flex flex-col bg-white dark:bg-card rounded-md border border-border shadow-md overflow-hidden">
                    <ChatInterface
                        onTalkingStateChange={setIsTalking}
                        sessionId={activeSessionId}
                        initialMessages={activeMessages}
                        onNewChat={startNewSession}
                    />
                </section>

                {/* Right Panel: 3D Avatar Space or History */}
                <section className="w-[40%] bg-gradient-to-br from-card to-background rounded-md border border-border relative overflow-hidden flex flex-col">

                    {/* Status Badge & History Toggle */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded shadow-lg border border-primary/20 text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                            {showHistory ? <X className="w-3 h-3" /> : <History className="w-3 h-3" />}
                            {showHistory ? "Back to Avatar" : "History"}
                        </button>
                    </div>

                    {showHistory ? (
                        <div className="flex-1 w-full h-full bg-white/95 dark:bg-background/95 backdrop-blur-lg flex flex-col p-6 overflow-y-auto z-10 transition-colors">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 transition-colors">
                                    <History className="w-5 h-5 text-primary" /> Session History
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {sessions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-10 italic">
                                        No past sessions found. Start a new chat!
                                    </p>
                                ) : (
                                    sessions.map(session => (
                                        <div
                                            key={session.sessionId}
                                            onClick={() => loadSession(session)}
                                            className="p-4 rounded-xl bg-gray-50 dark:bg-secondary/50 border border-border dark:border-white/5 cursor-pointer hover:bg-secondary/20 dark:hover:bg-secondary transition-all hover:border-primary/50 group shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm text-black dark:text-white font-semibold group-hover:text-primary transition-colors truncate pr-2 max-w-[70%]" title={session.title}>
                                                    {session.title || "Untitled Session"}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground bg-gray-200 dark:bg-black/20 px-2 py-0.5 rounded whitespace-nowrap">
                                                    {new Date(session.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate mt-1">
                                                {session.messages && session.messages.length > 1
                                                    ? `"${session.messages[1].text}"`
                                                    : "New Session"}
                                            </p>
                                            <p className="text-[10px] text-primary/70 mt-3 font-medium">
                                                {session.messages ? session.messages.length : 0} Messages
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 w-full h-full">
                            <AvatarExperience isTalking={isTalking} />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}