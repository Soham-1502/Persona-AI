// components/dashboard/InsightsCard.jsx
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

function Chip({ text }) {
    return (
        <div className="w-fit rounded-full bg-background text-foreground text-[11px] font-medium px-3 py-1">
            {text}
        </div>
    );
}

export default function InsightsCard() {
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
                        You&apos;re most active in{" "}
                        <span className="font-semibold">Micro‑Learning</span> while{" "}
                        <span className="font-semibold">Confidence Coach</span> has fewer
                        sessions this week.
                    </p>
                </div>

                <Separator className="bg-border/60" />

                {/* Snapshot chips – visually like compact stats */}
                <div className="w-full flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Snapshot
                    </p>
                    <div className="flex flex-wrap gap-1">
                        <Chip text="Top module • Micro‑Learning" />
                        <Chip text="Streak • 7 days" />
                        <Chip text="Peak day • Wed" />
                    </div>
                </div>

                <Separator className="bg-border/60" />

                {/* AI Suggests area – similar weight to chart filters row */}
                <div className="w-full flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        AI suggests
                    </p>
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-foreground/90">
                            Start a 10‑min{" "}
                            <span className="font-semibold">Confidence Coach</span> session to
                            balance your practice.
                        </p>
                        <CardAction>
                            <button className="px-4 py-1.5 text-xs font-medium rounded-full bg-persona-purple text-white hover:bg-persona-purple/90">
                                Start
                            </button>
                        </CardAction>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-4 pt-0">
                <p className="text-[11px] text-muted-foreground">
                    Updated from your last 7 days of activity.
                </p>
            </CardFooter>
        </Card>
    );
}