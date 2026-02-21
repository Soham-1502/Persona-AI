"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Video, Square, Play, CheckCircle } from "lucide-react";

export function ConfidenceCoachUI() {
    // Video state
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    // Session state
    const [sessionStatus, setSessionStatus] = useState("idle"); // idle, analyzing, ended
    const [question, setQuestion] = useState("Job Interview"); // default scenario
    const [sessionId, setSessionId] = useState(null);
    const [startTime, setStartTime] = useState(null);

    // Transcript state
    const [userAnswer, setUserAnswer] = useState("");
    const recognitionRef = useRef(null);

    const scenarios = ["Job Interview", "Presentation", "Networking", "Negotiation"];

    useEffect(() => {
        // Initialize camera
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Failed to access camera/mic:", err);
            }
        };

        if (sessionStatus === "idle") {
            initCamera();
        }

        return () => {
            // Clean up stream if component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStatus]);

    useEffect(() => {
        // Initialize Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition && !recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }

                const lowerTranscript = currentTranscript.toLowerCase();

                // Command keyword detection
                if (sessionStatus === "idle" && lowerTranscript.includes("start")) {
                    startSession();
                } else if (sessionStatus === "analyzing") {
                    if (lowerTranscript.includes("end this speech")) {
                        endSession();
                    } else if (event.results[event.results.length - 1].isFinal) {
                        // Accumulate final results to avoid capturing the command keyword ideally
                        setUserAnswer(prev => prev + " " + event.results[event.results.length - 1][0].transcript);
                    }
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
            };

            recognitionRef.current = recognition;

            try {
                recognition.start();
            } catch (e) {
                console.log("Recognition already running or failed to start", e);
            }
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) { }
            }
        };
    }, [sessionStatus]);

    // Live Timer
    const [timeElapsed, setTimeElapsed] = useState(0);
    useEffect(() => {
        let interval;
        if (sessionStatus === "analyzing" && startTime) {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            setTimeElapsed(0);
        }
        return () => clearInterval(interval);
    }, [sessionStatus, startTime]);

    const startSession = () => {
        if (sessionStatus !== "idle") return;
        setSessionId(crypto.randomUUID());
        setStartTime(Date.now());
        setUserAnswer("");
        setSessionStatus("analyzing");
    };

    const endSession = () => {
        if (sessionStatus !== "analyzing") return;
        setSessionStatus("ended");
        // We will process timeTaken and scores in Plan 1.3
    };

    return (
        <div className="w-full h-full flex gap-4">
            {/* Left Panel: Video Feed */}
            <div className="w-[60%] bg-black rounded-xl overflow-hidden relative shadow-lg border border-border flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* Status Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white border border-white/10 text-sm">
                        <Video size={16} className={stream ? "text-green-400" : "text-red-400"} />
                        <span>{stream ? "Camera Active" : "No Camera"}</span>
                    </div>
                </div>

                {sessionStatus === "analyzing" && (
                    <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        Recording
                    </div>
                )}
            </div>

            {/* Right Panel: Controls & Instructions */}
            <div className="w-[40%] bg-card rounded-xl border border-border p-6 flex flex-col shadow-sm">

                {sessionStatus === "idle" && (
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Confidence Coach</h2>
                            <p className="text-muted-foreground mb-6">Select a scenario to practice your public speaking and body language.</p>

                            <label className="block text-sm font-medium mb-2">Scenario Type</label>
                            <select
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="w-full p-3 rounded-lg border border-input bg-background mb-8"
                            >
                                {scenarios.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <Mic size={18} className="text-primary" /> Voice Commands
                                </h3>
                                <ul className="text-sm space-y-2 text-muted-foreground">
                                    <li>Say <strong className="text-foreground">"Start"</strong> to begin analysis.</li>
                                    <li>Say <strong className="text-foreground">"END This Speech"</strong> to finish.</li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={startSession}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold shadow-md hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                        >
                            <Play fill="currentColor" size={20} />
                            Start Manual Session
                        </button>
                    </div>
                )}

                {sessionStatus === "analyzing" && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2 text-primary">Analysis in Progress...</h2>
                            <p className="text-muted-foreground mb-4">Scenario: <strong>{question}</strong></p>

                            <div className="bg-secondary/30 rounded-lg p-4 mb-4 border border-border h-[200px] overflow-y-auto">
                                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Live Transcript</h3>
                                <p className="text-sm">{userAnswer}</p>
                            </div>

                            <div className="flex gap-2">
                                <div className="bg-background border border-border rounded-lg p-3 flex-1 flex flex-col items-center">
                                    <div className="text-xs text-muted-foreground mb-1">Time Elapsed</div>
                                    <div className="font-mono font-bold text-lg">
                                        {timeElapsed}s
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={endSession}
                            className="w-full py-4 bg-destructive text-destructive-foreground rounded-lg font-bold shadow-md hover:bg-destructive/90 transition-colors flex justify-center items-center gap-2 mt-4"
                        >
                            <Square fill="currentColor" size={20} />
                            End Speech
                        </button>
                    </div>
                )}

                {sessionStatus === "ended" && (
                    <div className="flex flex-col h-full justify-center items-center text-center space-y-4">
                        <CheckCircle size={64} className="text-green-500 mb-2" />
                        <h2 className="text-2xl font-bold">Session Complete!</h2>
                        <p className="text-muted-foreground">
                            Processing your holistic confidence score...
                        </p>
                        <button
                            onClick={() => {
                                setSessionStatus("idle");
                                setUserAnswer("");
                            }}
                            className="mt-6 px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                        >
                            Start New Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
