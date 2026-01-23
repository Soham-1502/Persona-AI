"use client";

import { ChatInterface } from "@/components/ChatInterface";
import { AvatarExperience } from "@/components/AvatarExperience";
import { useState } from "react";

export default function SocialMentorPage() {
    // Shared State: Is the AI currently speaking?
    const [isTalking, setIsTalking] = useState(false);

    return (
        <div className="h-[calc(100vh-8rem)] min-h-[600px] flex gap-6">
            {/* Left Panel - Chat Interface (Red Box in prototype) */}
            <section className="w-1/3 min-w-[350px] flex flex-col bg-card rounded-3xl border border-border shadow-2xl overflow-hidden relative">
                <ChatInterface onTalkingStateChange={setIsTalking} />
            </section>

            {/* Right Panel - 3D Avatar Space (Blue Box in prototype) */}
            <section className="flex-1 bg-gradient-to-br from-card to-background rounded-3xl border border-border relative overflow-hidden flex flex-col justify-center items-center shadow-2xl">
                <AvatarExperience isTalking={isTalking} />
            </section>
        </div>
    );
}
