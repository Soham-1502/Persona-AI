// components/dashboard/InsightsCard.jsx
'use client'

import React from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function Chip({ text }) {
    return (
        <div className="w-fit rounded-full bg-background text-foreground text-[11px] font-medium px-3 py-1">
            {text}
        </div>
    );
}

/**
 * InsightsCard
 *
 * Props:
 *   insights  – { pattern, snapshot, suggestion, suggestionModule }
 *   streak    – { current, longest }
 *   isLoading – boolean
 */
export default function InsightsCard({ insights, streak, isLoading }) {
    if (isLoading) {
        return (
            <Card className="h-full flex flex-col justify-between border border-border bg-card/95">
                <CardHeader className="px-5 pt-0 pb-0">
                    <CardTitle className="text-sm font-semibold text-foreground">
                        PersonaAI Insights
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                        Loading your insights…
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-start gap-4 px-5">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-6 w-3/4 rounded-full" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
            </Card>
        );
    }

    // Fallback values when no data is available
    const pattern = insights?.pattern ?? "Start your first session to see your activity pattern!";
    const snapshot = insights?.snapshot ?? [];
    const suggestion = insights?.suggestion ?? "Keep up the great work! Try a new module today.";
    const suggestionModule = insights?.suggestionModule ?? null;
    const currentStreak = streak?.current ?? 0;

    return (
        <Card className="h-full flex flex-col justify-between border border-border bg-card/95">
            {/* header matches ActivityChart */}
            <CardHeader className="px-5 pt-0 pb-0">
                <CardTitle className="text-sm font-semibold text-foreground">
                    PersonaAI Insights
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    Based on your recent sessions
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col items-start gap-4 px-5 pb-">
                {/* This week pattern */}
                <div className="w-full">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                        This week&apos;s pattern
                    </p>
                    <p className="text-sm text-foreground/90">
                        {pattern}
                    </p>
                </div>

                <Separator className="bg-border/60" />

                {/* Snapshot chips */}
                <div className="w-full flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Snapshot
                    </p>
                    {snapshot.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {snapshot.map((chip, i) => (
                                <Chip key={i} text={chip} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">No activity yet — complete a session to see your snapshot.</p>
                    )}
                </div>

                <Separator className="bg-border/60" />

                {/* AI Suggests area */}
                <div className="w-full flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        AI suggests
                    </p>
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-foreground/90">
                            {suggestionModule ? (
                                <>
                                    {suggestion.split(suggestionModule)[0]}
                                    <span className="font-semibold">{suggestionModule}</span>
                                    {suggestion.split(suggestionModule)[1]}
                                </>
                            ) : (
                                suggestion
                            )}
                        </p>
                        {suggestionModule && (
                            <CardAction>
                                <button onClick={() => {
                                    if (insights?.suggestionRoute) {
                                        window.location.href = insights.suggestionRoute;
                                    }
                                }} className="px-4 py-1.5 text-xs font-medium rounded-full bg-persona-purple text-white hover:bg-persona-purple/90 whitespace-nowrap">
                                    Start
                                </button>
                            </CardAction>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-4 pt-0">
                <p className="text-[11px] text-muted-foreground">
                    {currentStreak > 0
                        ? `🔥 ${currentStreak}-day streak • Updated from your last 7 days of activity.`
                        : "Updated from your last 7 days of activity."}
                </p>
            </CardFooter>
        </Card>
    );
}
