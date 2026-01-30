"use client";

import { cn } from "@/lib/utils";
import { Mic, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * ChatInterface Component
 * Handles user messaging, Web Speech API for voice input, 
 * and TTS (Text-to-Speech) for AI responses.
 */
export function ChatInterface({ onTalkingStateChange }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    // Hydration fix & Initial Message
    useEffect(() => {
        setMessages([
            {
                id: "1",
                role: "ai",
                text: "Hello! I'm your Social Mentor. I can help you practice tricky social situations. Try me! For example context: 'Your friends are being rude'.",
                timestamp: new Date(),
            },
        ]);

        // Cleanup speech on unmount
        return () => {
            if (typeof window !== "undefined" && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Speech Recognition Setup (Web Speech API)
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
                console.warn("Speech Recognition not supported in this browser.");
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => (prev ? prev + " " + transcript : transcript));
            };

            // Store in global window for easy access in toggle function
            window.recognitionInstance = recognition;
        }
    }, []);

    const toggleListening = () => {
        const recognition = window.recognitionInstance;
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            text: input,
            timestamp: new Date(),
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await fetch("/api/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                text: data.text,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);

            // Text-to-Speech Logic
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(aiMsg.text);

                // Update shared parent state to trigger 3D Avatar animations
                utterance.onstart = () => onTalkingStateChange?.(true);
                utterance.onend = () => onTalkingStateChange?.(false);
                utterance.onerror = () => onTalkingStateChange?.(false);

                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                text: error.message || "Sorry, I'm having trouble connecting to my brain right now. Please check the API Key.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-card/50">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Social Mentor</h2>
                        <p className="text-xs text-muted-foreground">Online • AI Active</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "flex max-w-[85%] flex-col gap-1 p-3 rounded-2xl text-sm shadow-md",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-secondary text-secondary-foreground rounded-tl-none"
                            )}
                        >
                            <p>{msg.text}</p>
                            <span className="text-[10px] opacity-50 self-end">
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
                <div className="relative flex items-center gap-2">
                    <button
                        onClick={toggleListening}
                        className={cn(
                            "p-3 rounded-xl transition-all duration-300",
                            isListening
                                ? "bg-red-500/20 text-red-500 animate-pulse"
                                : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                        )}
                        title="Toggle Voice Input"
                    >
                        <Mic className="w-5 h-5" />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your response..."
                        className="flex-1 bg-gray-900 border border-white/10 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none transition-all"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}