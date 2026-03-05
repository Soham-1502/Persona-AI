"use client";

import { cn } from "@/lib/utils";
import { Mic, Send, Sparkles, Volume2, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { getAuthToken } from "@/lib/auth-client";

export function ChatInterface({ onTalkingStateChange, sessionId, initialMessages, onNewChat, avatarType = "male" }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null);
    const ttsTimeoutRef = useRef(null);
    const audioRef = useRef(null);
    const audioQueueRef = useRef([]);
    const sessionStartTimeRef = useRef(null);

    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            // Restore from history
            setMessages(initialMessages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
            setCurrentSessionId(sessionId);
            sessionStartTimeRef.current = Date.now();
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
            setCurrentSessionId(sessionId || Date.now().toString());
            sessionStartTimeRef.current = Date.now();
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
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            onTalkingStateChange?.(false);
        };
    }, [sessionId, initialMessages]);

    const saveToDB = async (sid, msgs) => {
        try {
            const token = getAuthToken();
            console.log(`[ChatInterface] Saving to DB. SessionId: ${sid}, Messages: ${msgs.length}, Token: ${token ? "Yes" : "No"}`);

            const res = await fetch('/api/mentor/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId: sid, messages: msgs })
            });

            const data = await res.json();
            console.log('[ChatInterface] Save result status:', res.status, data);

            if (!res.ok) {
                console.error('Failed to save to DB:', data.error || res.statusText);
            }
        } catch (e) {
            console.error('[ChatInterface] Failed to save history - Network/Auth error:', e);
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

    // Safely stop ALL talking
    const stopTalking = () => {
        if (ttsTimeoutRef.current) {
            clearTimeout(ttsTimeoutRef.current);
            ttsTimeoutRef.current = null;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        audioQueueRef.current = [];
        onTalkingStateChange?.(false);
    };

    const playAudioQueue = async () => {
        if (audioQueueRef.current.length === 0) {
            stopTalking();
            return;
        }

        const base64Audio = audioQueueRef.current.shift();
        const audio = new Audio("data:audio/mp3;base64," + base64Audio);
        audioRef.current = audio;

        audio.onplay = () => onTalkingStateChange?.(true);
        audio.onended = () => {
            if (audioQueueRef.current.length > 0) {
                playAudioQueue();
            } else {
                stopTalking();
            }
        };
        audio.onerror = () => stopTalking();

        try {
            await audio.play();
        } catch (error) {
            console.error("Audio playback failed:", error);
            stopTalking();
        }
    };

    const handleSpeakMessage = async (text) => {
        // Only stop if we're not already transitioning 
        // to a new audio fetch for the female avatar
        if (avatarType !== "female") {
            if (typeof window !== "undefined" && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            stopTalking();
        } else {
            // For female, we want to keep the "isTalking" state true if possible
            if (typeof window !== "undefined" && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            // Just clear previous audio without resetting the isTalking state yet
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
            audioQueueRef.current = [];
        }

        if (!text) {
            stopTalking();
            return;
        }

        if (avatarType === "female") {
            try {
                console.log("[TTS] Requesting audio for text length:", text.length);
                onTalkingStateChange?.(true);

                const res = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, lang: 'en' })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.details || "TTS API failed");
                }

                const data = await res.json();
                console.log("[TTS] Received chunks:", data.chunks?.length);

                if (data.chunks && data.chunks.length > 0) {
                    audioQueueRef.current = data.chunks.map(c => c.base64);
                    playAudioQueue();
                } else {
                    console.warn("[TTS] No audio chunks returned");
                    stopTalking();
                }
            } catch (error) {
                console.error("[TTS] Google TTS error:", error);
                stopTalking();
            }
        } else {
            // Male Avatar uses standard browser TTS
            if (typeof window !== "undefined" && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    const maleVoice = voices.find(v =>
                        v.name.includes('Male') ||
                        v.name.includes('David') ||
                        v.name.includes('Mark') ||
                        v.name.includes('Alex')
                    );
                    if (maleVoice) utterance.voice = maleVoice;
                }

                const wordCount = text.split(/\s+/).length;
                const estimatedMs = Math.ceil((wordCount / 130) * 60 * 1000) + 3000;

                utterance.onstart = () => {
                    onTalkingStateChange?.(true);
                    ttsTimeoutRef.current = setTimeout(() => {
                        stopTalking();
                    }, estimatedMs);
                };

                utterance.onend = () => stopTalking();
                utterance.onerror = () => stopTalking();

                window.speechSynthesis.speak(utterance);
            }
        }
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

            const token = getAuthToken();
            const response = await fetch("/api/mentor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
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

            onTalkingStateChange?.(true); // Start moving while streaming

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

            // Trigger TTS
            if (accumulatedText) {
                handleSpeakMessage(accumulatedText);
            } else {
                onTalkingStateChange?.(false);
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
                                "flex max-w-[90%] sm:max-w-[85%] flex-col gap-1 p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base shadow-md group relative",
                                msg.role === "user"
                                    ? "bg-secondary text-secondary-foreground rounded-tr-none dark:bg-muted dark:text-foreground"
                                    : "bg-primary text-primary-foreground rounded-tl-none"
                            )}
                        >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <div className="flex items-center justify-between mt-1">
                                {msg.role === "ai" && !isLoading && msg.text && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSpeakMessage(msg.text); }}
                                            className="text-[10px] text-primary-foreground/70 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded flex items-center gap-1 bg-white/5"
                                            title="Listen to message again"
                                        >
                                            <Volume2 className="w-3 h-3" /> <span className="hidden sm:inline">Listen</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); stopTalking(); }}
                                            className="text-[10px] text-primary-foreground/70 hover:text-red-300 hover:bg-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 bg-white/5"
                                            title="Stop Speaking"
                                        >
                                            <Square className="w-3 h-3 fill-current" /> <span className="hidden sm:inline">Stop</span>
                                        </button>
                                    </div>
                                )}
                                {msg.text && (
                                    <span className={cn(
                                        "text-[10px] opacity-50 ml-auto",
                                        msg.role === "user" && "mt-1"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                )}
                            </div>
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
            <div className="p-3 sm:p-4 bg-card border-t border-border">
                <div className="relative flex items-center gap-1.5 sm:gap-2">
                    <button
                        onClick={toggleListening}
                        disabled={isLoading}
                        className={cn(
                            "p-2.5 sm:p-3 rounded-xl transition-all duration-300",
                            isListening
                                ? "bg-red-500/20 text-red-500 animate-pulse"
                                : "bg-secondary hover:bg-secondary/80 text-muted-foreground",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                        title="Toggle Voice Input"
                    >
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading}
                        placeholder={isLoading ? "..." : "Type your response..."}
                        className="flex-1 bg-white dark:bg-[#1a1d24] text-black dark:text-white border border-border dark:border-white/10 focus:ring-1 focus:ring-primary rounded-xl p-2.5 sm:p-3 text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-2.5 sm:p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
