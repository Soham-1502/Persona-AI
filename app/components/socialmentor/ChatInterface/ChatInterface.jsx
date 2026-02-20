"use client";

import { cn } from "@/lib/utils";
import { Mic, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ChatInterface({ onTalkingStateChange, sessionId, initialMessages, onNewChat }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null);
    const ttsTimeoutRef = useRef(null);

    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            // Restore from history
            setMessages(initialMessages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
            setCurrentSessionId(sessionId);
        } else {
            // New Session
            setMessages([
                {
                    id: "1",
                    role: "ai",
                    text: "Hello! I'm your Social Mentor. I can help you practice tricky social situations.",
                    timestamp: new Date(),
                },
            ]);
            setCurrentSessionId(Date.now().toString());
        }

        return () => {
            if (typeof window !== "undefined" && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (ttsTimeoutRef.current) {
                clearTimeout(ttsTimeoutRef.current);
            }
            onTalkingStateChange?.(false);
        };
    }, [sessionId, initialMessages]);

    const saveToDB = async (sid, msgs) => {
        try {
            const res = await fetch('/api/mentor/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sid, messages: msgs })
            });
            const data = await res.json();
            console.log('Save to DB result:', data);
        } catch (e) {
            console.error('Failed to save history', e);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
                console.warn("Speech Recognition not supported");
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => (prev ? prev + " " + transcript : transcript));
            };

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

    // Safely stop talking and clear any pending safety timeout
    const stopTalking = () => {
        if (ttsTimeoutRef.current) {
            clearTimeout(ttsTimeoutRef.current);
            ttsTimeoutRef.current = null;
        }
        onTalkingStateChange?.(false);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Cancel any ongoing speech before sending a new message
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        stopTalking();

        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            text: input,
            timestamp: new Date(),
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        const aiMsgId = (Date.now() + 1).toString();
        const aiMsg = {
            id: aiMsgId,
            role: "ai",
            text: "",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        try {
            abortControllerRef.current = new AbortController();

            const response = await fetch("/api/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Handle streaming
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                accumulatedText += parsed.content;
                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.id === aiMsgId
                                            ? { ...msg, text: accumulatedText }
                                            : msg
                                    )
                                );
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            setIsLoading(false);

            // Save the complete session to DB
            const finalMessages = [...newMessages, { id: aiMsgId, role: "ai", text: accumulatedText, timestamp: new Date() }];
            saveToDB(currentSessionId, finalMessages);

            // Text-to-Speech with safety timeout fallback
            if ('speechSynthesis' in window && accumulatedText) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(accumulatedText);

                // Estimate speech duration: ~130 words per minute + 3s buffer
                const wordCount = accumulatedText.split(/\s+/).length;
                const estimatedMs = Math.ceil((wordCount / 130) * 60 * 1000) + 3000;

                utterance.onstart = () => {
                    onTalkingStateChange?.(true);
                    // Safety net: force stop if onend never fires
                    ttsTimeoutRef.current = setTimeout(() => {
                        stopTalking();
                    }, estimatedMs);
                };

                utterance.onend = () => stopTalking();
                utterance.onerror = () => stopTalking();

                window.speechSynthesis.speak(utterance);
            }

        } catch (error) {
            setIsLoading(false);
            stopTalking(); // Always reset avatar on error

            if (error.name === 'AbortError') return;

            console.error("Error:", error);
            const errorMsg = {
                id: (Date.now() + 2).toString(),
                role: "ai",
                text: `⚠️ ${error.message}`,
                timestamp: new Date(),
            };
            setMessages((prev) => {
                const filtered = prev.filter(msg => msg.id !== aiMsgId);
                return [...filtered, errorMsg];
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-card/50">
            {/* Header */}
            <div className="p-4 border-b border-border bg-white/80 dark:bg-card/80 backdrop-blur-sm flex items-center justify-between z-10 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-black dark:text-white transition-colors">Social Mentor</h2>
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "🤔 Thinking..." : "✓ Online • AI Active"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onNewChat}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border border-primary/20 text-xs font-bold transition-all"
                >
                    + New Chat
                </button>
            </div>

            {/* Messages */}
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
                                "flex max-w-[85%] flex-col gap-1 p-3.5 rounded-2xl text-base shadow-md",
                                msg.role === "user"
                                    ? "bg-secondary text-secondary-foreground rounded-tr-none dark:bg-muted dark:text-foreground"
                                    : "bg-primary text-primary-foreground rounded-tl-none"
                            )}
                        >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.text && (
                                <span className="text-[10px] opacity-50 self-end">
                                    {msg.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-secondary text-secondary-foreground p-3 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border">
                <div className="relative flex items-center gap-2">
                    <button
                        onClick={toggleListening}
                        disabled={isLoading}
                        className={cn(
                            "p-3 rounded-xl transition-all duration-300",
                            isListening
                                ? "bg-red-500/20 text-red-500 animate-pulse"
                                : "bg-secondary hover:bg-secondary/80 text-muted-foreground",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                        title="Toggle Voice Input"
                    >
                        <Mic className="w-5 h-5" />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading}
                        placeholder={isLoading ? "AI is responding..." : "Type your response..."}
                        className="flex-1 bg-white dark:bg-[#1a1d24] text-black dark:text-white border border-border dark:border-white/10 focus:ring-1 focus:ring-primary rounded-xl p-3 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}