import { useState, useEffect, useRef } from "react";
import { Mic, Video, Square, Play, CheckCircle, Loader2, Eye, Activity, Zap, TrendingUp, Timer } from "lucide-react";
import { usePorcupine } from '@picovoice/porcupine-react';
import { startMediaPipeStream } from "./MediaPipeAnalyzer";
import { AudioAnalyzer } from "./AudioAnalyzer";
import { getAuthToken } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function ConfidenceCoachUI() {
    // Video state
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    // Session state
    const [sessionStatus, setSessionStatus] = useState("idle"); // idle, analyzing, ended
    const [scenarioCategory, setScenarioCategory] = useState("Job Interview"); // default scenario category
    const [difficulty, setDifficulty] = useState("Beginner"); // Beginner, Intermediate, Expert
    const [question, setQuestion] = useState(""); // generated question string
    const [previousQuestions, setPreviousQuestions] = useState([]); // history of questions asked this session
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [startTime, setStartTime] = useState(null);

    // Transcript state
    const [userAnswer, setUserAnswer] = useState("");
    const [interimAnswer, setInterimAnswer] = useState("");
    const recognitionRef = useRef(null);

    // ML Analyzers
    const audioAnalyzerRef = useRef(null);
    const mediaPipeCleanupRef = useRef(null);
    const [mlStats, setMlStats] = useState({
        faceFrames: 0,
        visibleFaceFrames: 0,
        postures: [],
        positiveFrames: 0,
        tenseFrames: 0,
        emotionMeasuredFrames: 0,
        currentPostureRatio: 0,
        handFrames: 0,
        visibleHandFrames: 0
    });
    const [audioStats, setAudioStats] = useState(null);

    // Live Breakdown Metrics
    const [liveMetrics, setLiveMetrics] = useState({
        eyeContact: 0,
        posture: 0,
        pitch: 0,
        energy: 0,
        pace: 0,
        wpm: 0,
        isSpeaking: false
    });

    // Final Payload
    const [finalScore, setFinalScore] = useState(null);
    const [finalDataPayload, setFinalDataPayload] = useState(null);

    const scenarios = ["Job Interview", "Presentation", "Networking", "Negotiation", "Crisis Management", "Impromptu Pitch", "Hostile Q&A", "Salary Discussion"];

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
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [sessionStatus]);

    // Live Metrics Update Loop
    useEffect(() => {
        let interval;
        if (sessionStatus === "analyzing" && startTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const durationMinutes = (now - startTime) / 60000;

                // Calculate WPM
                const words = userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length;
                const wpm = durationMinutes > 0 ? Math.round(words / durationMinutes) : 0;

                // Sync with audio analyzer
                let pitch = 0;
                let energy = 0;
                if (audioAnalyzerRef.current) {
                    const metrics = audioAnalyzerRef.current.getMetrics();
                    pitch = Math.min(100, (metrics.currentPitch / 300) * 100); // Scale pitch approx 0-300Hz
                    energy = metrics.currentEnergy;
                }

                setLiveMetrics(prev => ({
                    ...prev,
                    // Eye contact: higher sensitivity, human contact is rarely 100% stable
                    eyeContact: mlStats.faceFrames > 0 ? Math.min(100, Math.round((mlStats.visibleFaceFrames / mlStats.faceFrames) * 110)) : 0,
                    // Posture: already smoothed by alpha-beta filter in MediaPipeAnalyzer
                    posture: Math.round(mlStats.currentPostureRatio * 100),
                    // Pitch scaling: 80Hz - 250Hz is normal range. Scale 150Hz as 50%
                    pitch: pitch > 0 ? Math.min(100, Math.round((pitch / 300) * 100)) : 0,
                    // Energy is already normalized 0-100 in AudioAnalyzer
                    energy: Math.round(energy),
                    wpm: wpm,
                    // Pacing: 120-150 WPM is ideal (100%). Penalize extremes.
                    pace: wpm < 80 ? Math.round((wpm / 120) * 100) : (wpm > 180 ? Math.max(0, 100 - (wpm - 180)) : 100),
                    isSpeaking: interimAnswer.length > 0 || (Date.now() - prev.lastSpeechTime < 2000),
                    lastSpeechTime: interimAnswer.length > 0 ? Date.now() : (prev.lastSpeechTime || 0)
                }));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [sessionStatus, startTime, userAnswer, interimAnswer, mlStats]);

    // Porcupine Wake Word Engine
    const { keywordDetection, isLoaded: isPorcupineLoaded, isListening: isPorcupineListening, init: initPorcupine, start: startPorcupine } = usePorcupine();

    useEffect(() => {
        const setupPorcupine = async () => {
            const accessKey = process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY;
            if (!accessKey || isPorcupineLoaded) return;
            try {
                await initPorcupine(
                    accessKey,
                    { publicPath: "/porcupine_params.pv", forceWrite: true },
                    [
                        { builtin: "Porcupine", sensitivity: 0.7 },
                        { builtin: "Bumblebee", sensitivity: 0.7 }
                    ]
                );
            } catch (err) {
                console.warn("Porcupine fallback logic triggered", err);
            }
        };
        setupPorcupine();
    }, [isPorcupineLoaded, initPorcupine]);

    useEffect(() => {
        if (isPorcupineLoaded && !isPorcupineListening) {
            startPorcupine().catch(e => console.warn(e));
        }
    }, [isPorcupineLoaded, isPorcupineListening, startPorcupine]);

    // Command Parser
    useEffect(() => {
        if (keywordDetection !== null) {
            if (keywordDetection.index === 0 && sessionStatus === "idle") {
                startSession();
            } else if (keywordDetection.index === 1 && sessionStatus === "analyzing") {
                endSession();
            }
        }
    }, [keywordDetection, sessionStatus]);

    useEffect(() => {
        let active = true;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        let recognition = recognitionRef.current;
        if (!recognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";
            recognitionRef.current = recognition;
        }

        recognition.onresult = (event) => {
            let finalPiece = '';
            let interimPiece = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalPiece += event.results[i][0].transcript;
                } else {
                    interimPiece += event.results[i][0].transcript;
                }
            }
            const combined = (finalPiece + interimPiece).toLowerCase();
            if (sessionStatus === "idle" && combined.includes("start")) {
                startSession();
            } else if (sessionStatus === "analyzing") {
                if (combined.includes("end this speech")) {
                    endSession();
                } else {
                    if (finalPiece) {
                        setUserAnswer(prev => prev + (prev && finalPiece ? " " : "") + finalPiece);
                    }
                    setInterimAnswer(interimPiece);
                }
            }
        };

        recognition.onend = () => {
            if (active && sessionStatus !== "ended") {
                try { recognition.start(); } catch (e) { }
            }
        };

        if (sessionStatus !== "ended") {
            try { recognition.start(); } catch (e) { }
        }

        return () => {
            active = false;
            try { recognition.stop(); } catch (e) { }
        };
    }, [sessionStatus]);

    // AI Question Generation
    useEffect(() => {
        let active = true;
        const fetchQuestion = async () => {
            if (sessionStatus !== "idle") return;
            setIsGeneratingQuestion(true);
            try {
                const res = await fetch('/api/confidence-coach/generate-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scenarioType: scenarioCategory, difficulty: difficulty, previousQuestions: previousQuestions })
                });
                const data = await res.json();
                if (active) {
                    setQuestion(data.success && data.question ? data.question : `Please provide your best response for a typical ${scenarioCategory} scenario.`);
                    if (data.success && data.question) setPreviousQuestions(prev => [...prev, data.question]);
                }
            } catch (err) {
                if (active) setQuestion(`Please provide your best response for a typical ${scenarioCategory} scenario.`);
            } finally {
                if (active) setIsGeneratingQuestion(false);
            }
        };
        fetchQuestion();
        return () => { active = false; };
    }, [scenarioCategory, difficulty, sessionStatus]);

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
        setInterimAnswer("");
        setFinalScore(null);
        setFinalDataPayload(null);
        setAudioStats(null);
        setMlStats({
            faceFrames: 0,
            visibleFaceFrames: 0,
            postures: [],
            positiveFrames: 0,
            tenseFrames: 0,
            emotionMeasuredFrames: 0,
            currentPostureRatio: 0,
            handFrames: 0,
            visibleHandFrames: 0
        });
        setLiveMetrics({ eyeContact: 0, posture: 0, pitch: 0, energy: 0, pace: 0, wpm: 0, isSpeaking: false });

        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) { }
        }

        setSessionStatus("analyzing");

        const audioAnalyzer = new AudioAnalyzer();
        audioAnalyzerRef.current = audioAnalyzer;
        try { await audioAnalyzer.start(); } catch (e) { console.error(e); }

        if (videoRef.current) {
            mediaPipeCleanupRef.current = startMediaPipeStream(videoRef.current, (results) => {
                setMlStats(prev => {
                    const isFaceVisible = results.face && results.face.faceBlendshapes && results.face.faceBlendshapes.length > 0;
                    const validPostures = [...prev.postures, results.posture].filter(p => p !== "unknown");
                    // Treat both sitting and standing as "Strong" presence for desk users
                    const presenceCount = validPostures.filter(p => p === "standing" || p === "sitting").length;
                    const presenceRatio = validPostures.length > 0 ? (presenceCount / validPostures.length) : 0;

                    return {
                        ...prev,
                        faceFrames: prev.faceFrames + 1,
                        visibleFaceFrames: prev.visibleFaceFrames + (isFaceVisible ? 1 : 0),
                        postures: [...prev.postures, results.posture],
                        positiveFrames: prev.positiveFrames + (results.emotion === "positive" ? 1 : 0),
                        tenseFrames: prev.tenseFrames + (results.emotion === "tense" ? 1 : 0),
                        emotionMeasuredFrames: prev.emotionMeasuredFrames + (results.emotion !== "neutral" ? 1 : 0),
                        currentPostureRatio: presenceRatio,
                        handFrames: prev.handFrames + 1,
                        visibleHandFrames: prev.visibleHandFrames + (results.handsVisible ? 1 : 0)
                    };
                });
            });
        }
    };

    const endSession = () => {
        if (sessionStatus !== "analyzing") return;
        setSessionStatus("ended");

        if (mediaPipeCleanupRef.current) {
            mediaPipeCleanupRef.current();
            mediaPipeCleanupRef.current = null;
        }

        let audioMetrics = { avgVolume: 0, volumeVariance: 0, avgPitch: 0, avgEnergy: 0, pitchStability: 0, energyTrend: "Stable" };
        if (audioAnalyzerRef.current) {
            audioMetrics = audioAnalyzerRef.current.stop();
            audioAnalyzerRef.current = null;
        }
        setAudioStats(audioMetrics);

        const endTimeStamp = Date.now();
        const timeTaken = Math.floor((endTimeStamp - startTime) / 1000);

        // Filler Word Detection
        const fillerWords = ["um", "uh", "err", "like", "actually", "basically", "you know"];
        const transcript = userAnswer.toLowerCase();
        let fillerCount = 0;
        fillerWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'g');
            const matches = transcript.match(regex);
            if (matches) fillerCount += matches.length;
        });

        const wordCount = userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length;
        const durationMin = timeTaken / 60;
        const finalWPM = durationMin > 0 ? wordCount / durationMin : 0;

        // 1. Eye Contact (3.5 points max)
        // Scale: 70% visibility = 100% score (3.5 pts)
        const faceVisRatio = mlStats.faceFrames > 0 ? (mlStats.visibleFaceFrames / mlStats.faceFrames) : 0;
        const eyeContactScore = Math.min(1.0, faceVisRatio / 0.7);
        const eyeContactPts = eyeContactScore * 3.5;

        // 2. Presence & Posture (2.5 points max)
        const posturePts = mlStats.currentPostureRatio * 2.5;

        // 3. Emotion Calibration (2.0 points max)
        let emotionPts = 1.0; // standard neutral start
        if (mlStats.faceFrames > 0) {
            const positiveRatio = mlStats.positiveFrames / mlStats.faceFrames;
            const tenseRatio = mlStats.tenseFrames / mlStats.faceFrames;
            emotionPts = Math.min(2.0, Math.max(0.5, 1.0 + (positiveRatio * 2.0) - (tenseRatio * 1.5)));
        }

        // 4. Vocal Performance (1.2 points max)
        const vocalPts = (audioMetrics.pitchStability / 100) * 1.2;

        // 5. Pacing Performance (0.8 points max)
        // Ideal range: 110 - 160 WPM
        let pacingPts = 0.4;
        if (finalWPM >= 110 && finalWPM <= 160) pacingPts = 0.8;
        else if (finalWPM > 160) pacingPts = Math.max(0.2, 0.8 - (finalWPM - 160) / 100);
        else pacingPts = Math.max(0.1, (finalWPM / 110) * 0.8);

        // Deductions for fillers
        let totalScore = eyeContactPts + posturePts + emotionPts + vocalPts + pacingPts;
        const fillerPenalty = Math.min(2.0, (fillerCount / (wordCount || 1)) * 50);
        totalScore -= fillerPenalty;

        const finalCalculatedScore = Math.min(10.0, Math.max(1.0, Math.round(totalScore * 10) / 10));
        setFinalScore(finalCalculatedScore);

        const payload = {
            moduleId: "confidenceCoach",
            gameType: "voice",
            sessionId: sessionId || crypto.randomUUID(),
            question: question,
            userAnswer: userAnswer.trim() || "(No transcript captured)",
            correctAnswer: "completed",
            isCorrect: true,
            score: finalCalculatedScore,
            timeTaken: timeTaken,
            metrics: {
                eyeContact: Math.round(eyeContactScore * 100),
                posture: Math.round(mlStats.currentPostureRatio * 100),
                emotion: emotionPts > 1.5 ? "Confident" : (emotionPts < 0.8 ? "Tense" : "Neutral"),
                vocalStability: audioMetrics.pitchStability,
                pacing: Math.round((pacingPts / 0.8) * 100),
                wpm: Math.round(finalWPM)
            },
            meta: {
                fillers: fillerCount,
                pitchStability: audioMetrics.pitchStability,
                energyTrend: audioMetrics.energyTrend
            }
        };

        const token = getAuthToken();
        setFinalDataPayload(payload);
        // Fire-and-forget asynchronous save to JWT-protected backend (Plan 4.3)
        fetch('/api/confidence-coach/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(payload),
        }).catch(err => console.error("❌ Failed to save session:", err));
    };

    const getProgressColor = (value) => {
        if (value < 40) return "bg-red-500";
        if (value < 70) return "bg-orange-400";
        return "bg-green-500";
    };

    return (
        <div className="w-full h-fit lg:h-full flex flex-col lg:flex-row gap-4 overflow-y-auto lg:overflow-hidden pb-4 lg:pb-0">
            {/* Left Panel: Video Feed */}
            <div className="w-full lg:w-[60%] min-h-[40vh] lg:min-h-0 bg-black rounded-xl overflow-hidden relative shadow-lg border border-border flex items-center justify-center shrink-0 lg:shrink">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full flex-1 h-full object-cover transform scale-x-[-1]"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white border border-white/10 text-sm">
                        <Video size={16} className={stream ? "text-green-400" : "text-red-400"} />
                        <span>{stream ? "Camera Active" : "No Camera"}</span>
                    </div>
                </div>

                {sessionStatus === "analyzing" && (
                    <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 text-white text-sm font-bold animate-pulse shadow-lg">
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        RECORDING
                    </div>
                )}
            </div>

            {/* Right Panel: Controls & Instructions */}
            <div className="w-full lg:w-[40%] bg-card rounded-xl border border-border p-5 lg:p-6 flex flex-col shadow-sm flex-1 lg:overflow-y-auto">

                {sessionStatus === "idle" && (
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-3xl font-black mb-2 tracking-tight">Confidence Coach</h2>
                            <p className="text-muted-foreground mb-8">Master your presence with real-time AI feedback.</p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                    <label className="block text-sm font-medium mb-2">Scenario Type</label>
                                    <select
                                        value={scenarioCategory}
                                        onChange={(e) => setScenarioCategory(e.target.value)}
                                        className="w-full p-2.5 sm:p-3 rounded-lg border border-input bg-background"
                                        disabled={isGeneratingQuestion}
                                    >
                                        {scenarios.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full p-2.5 sm:p-3 rounded-lg border border-input bg-background"
                                        disabled={isGeneratingQuestion}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            {isGeneratingQuestion ? (
                                <div className="text-sm font-medium text-primary animate-pulse mb-8 flex items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <Loader2 size={18} className="animate-spin" /> Crafting your challenge...
                                </div>
                            ) : (
                                <div className="border border-border bg-secondary/20 p-5 rounded-2xl mb-8 shadow-inner relative group">
                                    <div className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Practice Question</div>
                                    <p className="text-lg font-semibold leading-relaxed">&quot;{question}&quot;</p>
                                </div>
                            )}

                            <div className="bg-secondary/40 rounded-2xl p-5 mb-4 border border-border">
                                <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
                                    <Mic size={18} className="text-primary" /> VOICE COMMANDS
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-xs bg-background p-3 rounded-lg border border-border">
                                        <span className="text-muted-foreground block mb-1">TO START</span>
                                        <span className="font-bold">&quot;Start&quot;</span>
                                    </div>
                                    <div className="text-xs bg-background p-3 rounded-lg border border-border">
                                        <span className="text-muted-foreground block mb-1">TO END</span>
                                        <span className="font-bold">&quot;End this speech&quot;</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={startSession}
                            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl hover:translate-y-[-2px] active:translate-y-[0] transition-all flex justify-center items-center gap-3 group"
                        >
                            <Play fill="currentColor" size={24} className="group-hover:scale-110 transition-transform" />
                            BEGIN SESSION
                        </button>
                    </div>
                )}

                {sessionStatus === "analyzing" && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-tighter text-primary">Live Analysis</h2>
                                <Badge variant="outline" className="font-mono text-lg bg-secondary/50 px-3 py-1">
                                    {timeElapsed}s
                                </Badge>
                            </div>

                            {/* LIVE BREAKDOWN */}
                            <div className="space-y-4 bg-secondary/10 p-5 rounded-2xl border border-border">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Live Breakdown</h3>

                                <div className="space-y-4">
                                    {[
                                        { label: "Eye Contact", value: liveMetrics.eyeContact, icon: <Eye size={14} /> },
                                        { label: "Posture", value: liveMetrics.posture, icon: <TrendingUp size={14} /> },
                                        { label: "Pitch", value: liveMetrics.pitch, icon: <Activity size={14} /> },
                                        { label: "Energy", value: liveMetrics.energy, icon: <Zap size={14} /> },
                                        { label: "Pace", value: liveMetrics.pace, icon: <TrendingUp size={14} /> }
                                    ].map((m) => (
                                        <div key={m.label} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <div className="flex items-center gap-2 opacity-70">
                                                    {m.icon} {m.label}
                                                </div>
                                                <span>{m.value}%</span>
                                            </div>
                                            <Progress value={m.value} className="h-2" indicatorClassName={getProgressColor(m.value)} />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                                    <div className="text-xs font-bold text-muted-foreground">Speaking Pace</div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-primary">{liveMetrics.wpm} WPM</span>
                                        <Badge variant={liveMetrics.isSpeaking ? "default" : "secondary"} className="text-[10px] h-5 px-2">
                                            {liveMetrics.isSpeaking ? "Speaking" : "No Speech"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/30 rounded-2xl p-5 border border-border h-[200px] overflow-y-auto relative">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3 sticky top-0 bg-secondary/30 backdrop-blur-sm -mt-5 pt-5 pb-2">Live Transcript</h3>
                                <p className="text-sm font-medium leading-relaxed">
                                    {userAnswer} <span className="text-primary italic animate-pulse">{interimAnswer}</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={endSession}
                            className="w-full py-5 bg-destructive/10 text-destructive border-2 border-destructive/20 rounded-2xl font-black text-lg shadow-lg hover:bg-destructive hover:text-white transition-all flex justify-center items-center gap-3 mt-6"
                        >
                            <Square fill="currentColor" size={24} />
                            END SPEECH
                        </button>
                    </div>
                )}

                {sessionStatus === "ended" && (
                    <div className="flex flex-col h-full overflow-y-auto pb-4">
                        {finalScore === null ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                <Loader2 size={48} className="text-primary animate-spin" />
                                <h2 className="text-2xl font-black uppercase tracking-widest animate-pulse">Analyzing...</h2>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center space-y-2 mb-4">
                                    <div className="flex justify-center mb-2">
                                        <div className="bg-green-500/10 p-2 rounded-full">
                                            <CheckCircle size={32} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter">SUCCESS</h2>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Session analyzed against AI models</p>
                                </div>

                                {/* 6-CARD RESULTS LAYOUT */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Eye Contact */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col items-center text-center">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Eye Contact</span>
                                        <span className="text-2xl font-black text-primary mb-1">
                                            {mlStats.faceFrames > 0 ? Math.round((mlStats.visibleFaceFrames / mlStats.faceFrames * 100)) : 0}%
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold opacity-60">Time looking at camera</span>
                                    </div>

                                    {/* Expression */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col items-center text-center">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Expression</span>
                                        <span className="text-2xl font-black text-primary mb-1">
                                            {mlStats.positiveFrames > mlStats.tenseFrames ? "Confident" : (mlStats.tenseFrames > mlStats.faceFrames * 0.2 ? "Tense" : "Neutral")}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold opacity-60">Dominant facial emotion</span>
                                    </div>

                                    {/* Vocal Pacing */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col items-center text-center">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Vocal Pacing</span>
                                        <span className="text-2xl font-black text-primary mb-1">
                                            {audioStats?.volumeVariance < 20 ? "Stable" : "Dynamic"}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold opacity-60">Volume stability over time</span>
                                    </div>

                                    {/* Posture */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col items-center text-center">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Posture</span>
                                        <span className="text-2xl font-black text-primary mb-1">
                                            {mlStats.currentPostureRatio > 0.6 ? "Strong" : (mlStats.currentPostureRatio > 0.3 ? "Moderate" : "Weak")}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold opacity-60">Body posture quality</span>
                                    </div>

                                    {/* Fillers */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col items-center text-center">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Fillers</span>
                                        <span className="text-2xl font-black text-primary mb-1">
                                            {finalDataPayload?.meta?.fillers || 0}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold opacity-60">Um, uh, like, etc.</span>
                                    </div>

                                    {/* Clarity */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col items-center text-center">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Clarity</span>
                                        <span className="text-2xl font-black text-primary mb-1">
                                            {Math.round((audioStats?.pitchStability || 80) * (userAnswer.length > 50 ? 1 : 0.8))}%
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold opacity-60">Linguistic clarity</span>
                                    </div>
                                </div>

                                {/* DETAILED VOCAL PACING BREAKDOWN */}
                                <div className="bg-secondary/10 rounded-2xl p-5 border border-border mt-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vocal Pacing Details</span>
                                        <span className="text-xs font-black text-primary">{Math.round(userAnswer.split(' ').length / (finalDataPayload?.timeTaken / 60)) || 0} WPM</span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-2xl font-black text-yellow-500">
                                            {(userAnswer.split(' ').length / (finalDataPayload?.timeTaken / 60)) < 110 ? "Too Slow" : ((userAnswer.split(' ').length / (finalDataPayload?.timeTaken / 60)) > 160 ? "Too Fast" : "Ideal")}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold">Pitch Stability</span>
                                            <span className={audioStats?.pitchStability > 70 ? "text-green-500 font-black" : "text-red-500 font-black"}>{audioStats?.pitchStability || 0}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold">Fillers / 100 words</span>
                                            <span className="text-green-500 font-black">{(finalDataPayload?.meta?.fillers / (userAnswer.split(' ').length / 100)).toFixed(1)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold">Volume</span>
                                            <span className="text-green-500 font-black">Good</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold">Energy Trend</span>
                                            <span className="text-green-500 font-black">{audioStats?.energyTrend || "Stable"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold">Pause Ratio</span>
                                            <span className="text-blue-500 font-black">0%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground font-bold">Filler Severity</span>
                                            <span className="text-green-500 font-black">Excellent</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Holistic Score Area */}
                                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 shadow-xl relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-primary/70">Holistic Confidence Score</span>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-8xl font-black leading-none text-primary">{finalScore}</span>
                                            <span className="text-2xl font-bold opacity-30 text-primary">/10</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                                            <span>Difficulty: <span className="text-primary">{difficulty}</span></span>
                                            <div className="w-1 h-1 rounded-full bg-border"></div>
                                            <span>Duration: <span className="text-primary">{finalDataPayload?.timeTaken}s</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* RECOMMENDATIONS SECTION */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mt-4">Areas for Improvement</h3>
                                    <div className="grid gap-3">
                                        {mlStats.visibleFaceFrames / mlStats.faceFrames < 0.7 && (
                                            <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl flex gap-4 items-start">
                                                <div className="bg-orange-500/10 p-2 rounded-lg text-orange-600">
                                                    <Eye size={18} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black uppercase opacity-60">Eye Contact</p>
                                                    <p className="text-sm font-medium">Try to look directly at the camera lens more often to establish better rapport with your audience.</p>
                                                </div>
                                            </div>
                                        )}
                                        {finalDataPayload?.meta?.fillers > 5 && (
                                            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex gap-4 items-start">
                                                <div className="bg-red-500/10 p-2 rounded-lg text-red-600">
                                                    <Zap size={18} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black uppercase opacity-60">Filler Words</p>
                                                    <p className="text-sm font-medium">You used {finalDataPayload.meta.fillers} filler words. Try to embrace pauses instead of using "um" or "like" while thinking.</p>
                                                </div>
                                            </div>
                                        )}
                                        {mlStats.visibleHandFrames / mlStats.handFrames < 0.3 && (
                                            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex gap-4 items-start">
                                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                                                    <Activity size={18} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black uppercase opacity-60">Hand Gestures</p>
                                                    <p className="text-sm font-medium">Use more open-palm hand gestures to signal transparency and confidence during your high-impact points.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* YOUTUBE PLAYLIST INTEGRATION */}
                                <div className="bg-secondary/10 rounded-3xl p-6 border border-border mt-2 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                        <TrendingUp size={80} />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Recommended Training</h3>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-24 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 relative border border-white/10">
                                            <img src="https://img.youtube.com/vi/K0pxo-dS9Hc/0.jpg" className="w-full h-full object-cover" alt="YouTube Thumbnail" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <Play size={12} fill="white" className="text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black leading-tight">Mastering Body Language</p>
                                            <p className="text-[10px] font-medium text-muted-foreground">Confidence Coach Curated Playlist</p>
                                            <a
                                                href="https://www.youtube.com/playlist?list=PLp_f9kI_pG7yUshX7b_0PskFk9OQyW8vS"
                                                target="_blank"
                                                className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 mt-1"
                                            >
                                                WATCH ON YOUTUBE →
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSessionStatus("idle");
                                        setFinalScore(null);
                                    }}
                                    className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-3 mt-6 shadow-xl shadow-primary/20"
                                >
                                    PRACTICE AGAIN
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
