"use client";

import { useState, useEffect } from "react";
import Header from '@/app/components/shared/header/Header.jsx';
import { ChatInterface } from "@/app/components/socialmentor/ChatInterface/ChatInterface.jsx";
import { AvatarExperience } from "@/app/components/socialmentor/Avatar/AvatarExperience.jsx";
import { History, X, Trash2, Search, RefreshCw, Archive, ArchiveRestore } from "lucide-react";

import { getAuthToken } from "@/lib/auth-client";
import { DeleteHistoryAlert } from "@/app/components/socialmentor/DeleteHistoryAlert";

export default function SocialMentorPage() {
    const [isTalking, setIsTalking] = useState(false);
    const [avatarType, setAvatarType] = useState("male");

    const [showHistory, setShowHistory] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(Date.now().toString());
    const [activeMessages, setActiveMessages] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("active");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Ensure session ID is always stable
    useEffect(() => {
        if (!activeSessionId) {
            setActiveSessionId(Date.now().toString());
        }
    }, []);

    // Load preference on mount
    useEffect(() => {
        const saved = localStorage.getItem("social-mentor-avatar");
        if (saved) setAvatarType(saved);
    }, []);

    // Helper to change and persist
    const changeAvatar = (type) => {
        setAvatarType(type);
        localStorage.setItem("social-mentor-avatar", type);
    };

    useEffect(() => {
        if (showHistory) {
            fetchHistory();
        }
    }, [showHistory]);

    const fetchHistory = () => {
        setIsRefreshing(true);
        const token = getAuthToken();
        console.log("[SocialMentor] Fetching history with token:", token ? "Token exists" : "No token");

        fetch('/api/mentor/history', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("[SocialMentor] History fetch status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("[SocialMentor] History data received:", data);
                if (data.success) {
                    setSessions(data.data || []);
                } else {
                    console.error("Failed to fetch history:", data.error);
                }
            })
            .catch(err => {
                console.error("[SocialMentor] History fetch error:", err);
            })
            .finally(() => setIsRefreshing(false));
    };

    const toggleArchiveSession = async (session, e) => {
        e.stopPropagation();
        const token = getAuthToken();
        try {
            const res = await fetch('/api/mentor/history/archive', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sessionId: session.sessionId,
                    isArchived: !session.isArchived
                })
            });
            const data = await res.json();
            if (data.success) {
                setSessions(prev => prev.map(s => s.sessionId === session.sessionId ? { ...s, isArchived: !s.isArchived } : s));
            }
        } catch (error) {
            console.error("Failed to archive/unarchive session:", error);
        }
    };

    const handleSessionDeleted = (sessionId) => {
        setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    };

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

    const filteredSessions = sessions.filter(session => {
        const matchesTab = activeTab === "archived" ? session.isArchived : !session.isArchived;
        const searchLower = searchQuery.toLowerCase();

        const titleMatch = session.title ? session.title.toLowerCase().includes(searchLower) : false;
        const messagesMatch = session.messages && Array.isArray(session.messages)
            ? session.messages.some(m => m.text && typeof m.text === 'string' && m.text.toLowerCase().includes(searchLower))
            : false;

        const matchesSearch = titleMatch || messagesMatch;
        return matchesTab && matchesSearch;
    });

    return (
        <div className="w-full h-screen flex flex-col bg-background">
            {/* Header Section */}
            <div className="sticky top-0 z-50 w-full shrink-0">
                <Header
                    DateValue="Interactive"
                    onDateChange={() => { }}
                    tempDate={today}
                    showDateFilter={false}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-2 px-3 flex flex-col lg:flex-row gap-3 overflow-hidden">

                {/* Left Panel: Chat Interface */}
                <section className="w-full lg:w-[60%] flex flex-col bg-white dark:bg-card rounded-md border border-border shadow-md overflow-hidden order-2 lg:order-1 h-[60%] lg:h-auto">
                    <ChatInterface
                        onTalkingStateChange={setIsTalking}
                        sessionId={activeSessionId}
                        initialMessages={activeMessages}
                        onNewChat={startNewSession}
                        avatarType={avatarType}
                    />
                </section>

                {/* Right Panel: 3D Avatar Space or History */}
                <section className="w-full lg:w-[40%] bg-gradient-to-br from-card to-background rounded-md border border-border relative overflow-hidden flex flex-col order-1 lg:order-2 h-[40%] lg:h-auto min-h-[300px]">

                    {/* Status Badge & History Toggle */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 flex flex-col items-end gap-2">
                        {!showHistory && (
                            <div className="flex bg-white dark:bg-black/40 backdrop-blur-md p-0.5 sm:p-1 rounded-lg border border-border shadow-lg scale-90 sm:scale-100 origin-right">
                                <button
                                    onClick={() => changeAvatar("male")}
                                    className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded transition-all ${avatarType === "male" ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => changeAvatar("female")}
                                    className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded transition-all ${avatarType === "female" ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                                >
                                    Female
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-primary hover:bg-primary/90 text-white rounded shadow-lg border border-primary/20 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all scale-90 sm:scale-100 origin-right"
                        >
                            {showHistory ? <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <History className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                            {showHistory ? "Back" : "History"}
                        </button>
                    </div>

                    {showHistory ? (
                        <div className="flex-1 w-full h-full bg-white/95 dark:bg-background/95 backdrop-blur-lg flex flex-col p-4 sm:p-6 overflow-hidden z-10 transition-colors">
                            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 shrink-0 pr-20 sm:pr-32">
                                <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white flex items-center gap-2 transition-colors">
                                    <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Session History
                                </h2>
                                <button
                                    onClick={fetchHistory}
                                    disabled={isRefreshing}
                                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all disabled:opacity-50"
                                    title="Refresh History"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-4 shrink-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by title or content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-black dark:text-white dark:bg-black/20"
                                />
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-secondary/30 p-1 rounded-lg mb-4 shrink-0">
                                <button
                                    onClick={() => setActiveTab("active")}
                                    className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${activeTab === "active" ? "bg-white dark:bg-card text-black dark:text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setActiveTab("archived")}
                                    className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${activeTab === "archived" ? "bg-white dark:bg-card text-black dark:text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Archived
                                </button>
                            </div>

                            <div className="space-y-3 overflow-y-auto flex-1 p-1 scrollbar-thin scrollbar-thumb-border">
                                {filteredSessions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-10 italic">
                                        {searchQuery ? "No sessions match your search." : (activeTab === "archived" ? "No archived sessions." : "No past sessions found. Start a new chat!")}
                                    </p>
                                ) : (
                                    filteredSessions.map(session => (
                                        <div
                                            key={session.sessionId}
                                            onClick={() => loadSession(session)}
                                            className="p-4 rounded-xl bg-gray-50 dark:bg-secondary/50 border border-border dark:border-white/5 cursor-pointer hover:bg-secondary/20 dark:hover:bg-secondary transition-all hover:border-primary/50 group shadow-sm relative flex flex-col"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm text-black dark:text-white font-semibold group-hover:text-primary transition-colors truncate pr-2 flex-1" title={session.title}>
                                                    {session.title || "Untitled Session"}
                                                </p>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="text-[10px] text-muted-foreground bg-gray-200 dark:bg-black/20 px-2 py-0.5 rounded whitespace-nowrap">
                                                        {new Date(session.updatedAt).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        onClick={(e) => toggleArchiveSession(session, e)}
                                                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                        title={session.isArchived ? "Unarchive" : "Archive"}
                                                    >
                                                        {session.isArchived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <DeleteHistoryAlert
                                                        session={session}
                                                        onSessionDeleted={handleSessionDeleted}
                                                    >
                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                            title="Delete History"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </DeleteHistoryAlert>
                                                </div>
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
                            <AvatarExperience isTalking={isTalking} avatarType={avatarType} />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
