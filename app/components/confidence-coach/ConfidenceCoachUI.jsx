"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Video, Square, Play, CheckCircle, Loader2 } from "lucide-react";
import { startMediaPipeStream } from "./MediaPipeAnalyzer";
import { AudioAnalyzer } from "./AudioAnalyzer";
import { getAuthToken } from "@/lib/auth-client";

export function ConfidenceCoachUI() {
    // Video state
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    // Session state
    const [sessionStatus, setSessionStatus] = useState("idle"); // idle, analyzing, ended
    const [scenarioCategory, setScenarioCategory] = useState("Job Interview"); // default scenario category
    const [question, setQuestion] = useState(""); // generated question string
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [startTime, setStartTime] = useState(null);

    // Transcript state
    const [userAnswer, setUserAnswer] = useState("");
    const recognitionRef = useRef(null);

    // ML Analyzers
    const audioAnalyzerRef = useRef(null);
    const mediaPipeCleanupRef = useRef(null);
    const [mlStats, setMlStats] = useState({ faceFrames: 0, visibleFaceFrames: 0, postures: [] });

    // Final Payload
    const [finalScore, setFinalScore] = useState(null);
    const [finalDataPayload, setFinalDataPayload] = useState(null);

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

    // AI Question Generation Effect
    useEffect(() => {
        let active = true;
        const fetchQuestion = async () => {
            if (sessionStatus !== "idle") return; // don't refetch if already running
            setIsGeneratingQuestion(true);
            try {
                const res = await fetch('/api/confidence-coach/generate-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scenarioType: scenarioCategory })
                });
                const data = await res.json();
                if (active) {
                    if (data.success && data.question) {
                        setQuestion(data.question);
                    } else {
                        setQuestion(`Please provide your best response for a typical ${scenarioCategory} scenario.`);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch generated question:", err);
                if (active) {
                    setQuestion(`Please provide your best response for a typical ${scenarioCategory} scenario.`);
                }
            } finally {
                if (active) setIsGeneratingQuestion(false);
            }
        };

        fetchQuestion();
        return () => { active = false; };
    }, [scenarioCategory, sessionStatus]);

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

    const startSession = async () => {
        if (sessionStatus !== "idle") return;
        setSessionId(crypto.randomUUID());
        setStartTime(Date.now());
        setUserAnswer("");
        setFinalScore(null);
        setFinalDataPayload(null);
        setMlStats({ faceFrames: 0, visibleFaceFrames: 0, postures: [] });
        setSessionStatus("analyzing");

        // Start Web Audio
        const audioAnalyzer = new AudioAnalyzer();
        audioAnalyzerRef.current = audioAnalyzer;
        try {
            await audioAnalyzer.start();
        } catch (e) {
            console.error("Audio analyzer failed to start", e);
        }

        // Start MediaPipe
        if (videoRef.current) {
            mediaPipeCleanupRef.current = startMediaPipeStream(videoRef.current, (results) => {
                setMlStats(prev => {
                    const isFaceVisible = results.face && results.face.faceBlendshapes && results.face.faceBlendshapes.length > 0;
                    return {
                        faceFrames: prev.faceFrames + 1,
                        visibleFaceFrames: prev.visibleFaceFrames + (isFaceVisible ? 1 : 0),
                        postures: [...prev.postures, results.posture]
                    };
                });
            });
        }
    };

    const endSession = () => {
        if (sessionStatus !== "analyzing") return;
        setSessionStatus("ended");

        // Stop Analyzers
        if (mediaPipeCleanupRef.current) {
            mediaPipeCleanupRef.current();
            mediaPipeCleanupRef.current = null;
        }

        let audioMetrics = { avgVolume: 0, volumeVariance: 0 };
        if (audioAnalyzerRef.current) {
            audioMetrics = audioAnalyzerRef.current.stop();
            audioAnalyzerRef.current = null;
        }

        // Calculate Time
        const endTimeStamp = Date.now();
        const timeTaken = Math.floor((endTimeStamp - startTime) / 1000);

        // Aggregate Score (0.0 to 10.0)
        let score = 5.0; // Base score

        // 1. Face Visibility Contribution (+ up to 2.5)
        const faceVisRatio = mlStats.faceFrames > 0 ? (mlStats.visibleFaceFrames / mlStats.faceFrames) : 0;
        score += (faceVisRatio * 2.5);

        // 2. Posture Contribution (+ up to 1.5)
        const validPostures = mlStats.postures.filter(p => p !== "unknown");
        const standingCount = validPostures.filter(p => p === "standing").length;
        const standingRatio = validPostures.length > 0 ? (standingCount / validPostures.length) : 0;
        // Reward standing or active sitting posture
        score += (standingRatio * 1.5);

        // 3. Audio Volume Stability (+ up to 1.0)
        // If volume variance is extremely high, they are shouting/whispering. If smooth, they are stable.
        const volStability = audioMetrics.volumeVariance > 0 ? Math.min(1.0, 100 / (audioMetrics.volumeVariance + 1)) : 0.5;
        score += volStability;

        // Cap score at 10.0 and format to 1 decimal
        const finalCalculatedScore = Math.min(10.0, Math.max(0.0, Math.round(score * 10) / 10));
        setFinalScore(finalCalculatedScore);

        // Assemble Final Payload Contract (Plan 1.3 requirement)
        const payload = {
            moduleId: "confidenceCoach",
            gameType: "voice",
            sessionId: sessionId || crypto.randomUUID(),
            question: question,
            userAnswer: userAnswer.trim() || "(No transcript captured)",
            correctAnswer: "completed",
            isCorrect: true,
            score: finalCalculatedScore,
            timeTaken: timeTaken
        };

        setFinalDataPayload(payload);

        // Fire-and-forget asynchronous save (Plan 1.4 requirement)
        fetch('/api/confidence-coach/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(payload),
        }).catch(err => console.error("Failed to save confidence coach session:", err));
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
                                value={scenarioCategory}
                                onChange={(e) => setScenarioCategory(e.target.value)}
                                className="w-full p-3 rounded-lg border border-input bg-background mb-4"
                                disabled={isGeneratingQuestion}
                            >
                                {scenarios.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            {isGeneratingQuestion ? (
                                <div className="text-sm text-muted-foreground animate-pulse mb-8 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Generating specific practice question...
                                </div>
                            ) : (
                                <div className="text-sm border border-border bg-secondary/10 p-4 rounded-lg mb-8 shadow-inner">
                                    <strong className="block mb-1 text-xs uppercase text-muted-foreground">Practice Question:</strong>
                                    <p className="text-foreground">{question}</p>
                                </div>
                            )}

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <Mic size={18} className="text-primary" /> Voice Commands
                                </h3>
                                <ul className="text-sm space-y-2 text-muted-foreground">
                                    <li>Say <strong className="text-foreground">&quot;Start&quot;</strong> to begin analysis.</li>
                                    <li>Say <strong className="text-foreground">&quot;END This Speech&quot;</strong> to finish.</li>
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
                            <div className="mb-4">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scenario:</span> <strong className="text-sm">{scenarioCategory}</strong>
                                <p className="text-sm mt-1 bg-secondary/20 p-3 rounded-md border border-border font-medium italic">&quot;{question}&quot;</p>
                            </div>

                            <div className="bg-secondary/30 rounded-lg p-4 mb-4 border border-border h-[160px] overflow-y-auto">
                                <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Live Transcript</h3>
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
                        {finalScore === null ? (
                            <>
                                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                                <h2 className="text-2xl font-bold">Processing Analysis...</h2>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={64} className="text-green-500 mb-2" />
                                <h2 className="text-2xl font-bold">Session Complete!</h2>

                                <div className="bg-secondary/30 rounded-xl p-6 w-full max-w-sm mt-4 border border-border">
                                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Holistic Confidence Score</div>
                                    <div className="text-6xl font-black text-primary mb-2">{finalScore}<span className="text-2xl text-muted-foreground">/10</span></div>
                                    <div className="text-sm text-muted-foreground">Time: {finalDataPayload?.timeTaken}s</div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSessionStatus("idle");
                                        setUserAnswer("");
                                        setFinalScore(null);
                                    }}
                                    className="mt-6 px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                                >
                                    Start New Session
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
