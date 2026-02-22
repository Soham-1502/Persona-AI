// location : app/inquizzo/RandomQuiz/page.jsx
'use client'

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Play,
  Zap,
  Target,
  Brain,
  History,
  Shield,
  BarChart3,
  Clock
} from "lucide-react";
import Header from '@/app/components/shared/header/Header.jsx';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import axios from "axios";

// Loading state indicator
const LoaderIcon = () => (
  <div className="w-5 h-5 border-2 border-persona-purple border-t-transparent rounded-full animate-spin" />
);

const Quiz = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(30);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [lastGainedScore, setLastGainedScore] = useState(0);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  // Difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  // Session tracking (10 questions per session)
  const SESSION_LENGTH = 10;
  const sessionIdRef = useRef(null);
  const [sessionQCount, setSessionQCount] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [showSessionEnd, setShowSessionEnd] = useState(false);
  const questionStartTimeRef = useRef(Date.now());


  useEffect(() => {
    // ✅ Load user data from localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUsername(userData.name || userData.username || userData.email || "");
        setIsAuthenticated(true);
      } catch {
        setUsername("");
        setIsAuthenticated(false);
      }
    } else {
      setUsername(localStorage.getItem("username") || "");
      setIsAuthenticated(false);
    }

    // Initial check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);

  const recognitionRef = useRef(null);
  const currentQuestionRef = useRef({ question: "", answer: "" });
  const seenQuestionsRef = useRef([]);
  const voicesRef = useRef([]);
  const transcriptRef = useRef("");

  // ✅ Helper: get localStorage key for this user's seen questions
  const getSeenQuestionsKey = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return `quiz_seen_${u.id || u.email || "default"}`;
      } catch { return "quiz_seen_default"; }
    }
    return "quiz_seen_default";
  };

  // ✅ Load seen questions from localStorage on mount
  useEffect(() => {
    const key = getSeenQuestionsKey();
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      seenQuestionsRef.current = Array.isArray(stored) ? stored : [];
    } catch { seenQuestionsRef.current = []; }
  }, []);

  // ✅ Preload TTS voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        voicesRef.current = speechSynthesis.getVoices();
      };
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  const handleAuthError = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setError("Authentication failed. Please login again.");
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      handleAuthError();
      throw new Error("No authentication token found");
    }

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (response.status === 401) {
        handleAuthError();
        throw new Error("Authentication failed");
      }
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  useEffect(() => {
    currentQuestionRef.current = {
      question: currentQuestion,
      answer: correctAnswer,
    };
  }, [currentQuestion, correctAnswer, isLoading, showResult]);

  const startListening = () => {
    if (typeof window === 'undefined') return;
    if (!currentQuestion) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback("Speech Recognition not supported in this browser.");
      setIsBrowserSupported(false);
      return;
    }

    if (!isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { }
      }
      setTranscript("");
      transcriptRef.current = "";
      setFeedback("");
      setTimer(30);
      setTimerActive(true);

      let intentionalStop = false;
      let silenceTimer;

      const startSilenceTimer = () => {
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          intentionalStop = true;
          recognition.stop();
        }, 6000);
      };

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        startSilenceTimer();
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          else interimTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) {
          const newTranscript = (transcriptRef.current + " " + finalTranscript).trim();
          transcriptRef.current = newTranscript;
          setTranscript(newTranscript);
        } else if (interimTranscript) {
          setTranscript((transcriptRef.current + " " + interimTranscript).trim());
        }
      };

      recognition.onend = () => {
        clearTimeout(silenceTimer);
        if (intentionalStop || transcriptRef.current.trim()) {
          setIsListening(false);
          recognitionRef.current = null;
          if (transcriptRef.current.trim()) checkAnswer(transcriptRef.current);
        } else {
          try { recognition.start(); } catch {
            setIsListening(false);
            recognitionRef.current = null;
          }
        }
      };

      recognition.onerror = (event) => {
        clearTimeout(silenceTimer);
        if (event.error === "no-speech") return;
        if (event.error === "aborted") return;
        intentionalStop = true;
        setIsListening(false);
        recognitionRef.current = null;
        setFeedback(`Mic Error: ${event.error}`);
      };

      recognition._setIntentionalStop = () => { intentionalStop = true; };
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setTimerActive(false);
      if (recognitionRef.current._setIntentionalStop) {
        recognitionRef.current._setIntentionalStop();
      }
      recognitionRef.current.stop();
    }
  };

  const checkAnswer = async (spokenText) => {
    const { question, answer } = currentQuestionRef.current;
    if (!question) {
      setFeedback("Error: Missing question data.");
      setShowResult(true);
      return;
    }

    setIsAnswering(true);
    const timeTaken = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    const userAnswer = spokenText.trim().toLowerCase();
    const skipPhrases = ["i don't know", "no idea", "skip", "pass", "not sure"];
    const isSkip = skipPhrases.some((phrase) => userAnswer.includes(phrase));

    if (isSkip) {
      const feedbackMsg = "You chose to skip this question.";
      const resultData = { question, correctAnswer: answer, userAnswer: spokenText, isCorrect: false, feedback: feedbackMsg, score: 0 };
      setFeedback(feedbackMsg);
      setChatHistory((prev) => [...prev, resultData]);
      setSessionQCount(prev => prev + 1);
      setQuestionsAnswered((prev) => prev + 1);
      setShowResult(true);
      setIsAnswering(false);
      await saveAttempt({ question, userAnswer: spokenText, correctAnswer: answer, isCorrect: false, score: 0, timeTaken });
      if (sessionQCount + 1 >= SESSION_LENGTH) setShowSessionEnd(true);
      return;
    }

    try {
      const data = await makeAuthenticatedRequest("/api/inquizzo/evaluate", {
        method: "POST",
        body: JSON.stringify({ userAnswer: spokenText, question, timeTaken }),
      });

      const { result } = data;
      const { isCorrect, similarity, score: gainedScore, feedback: evalFeedback, correctAnswer: correctAns } = result;

      const resultData = { question, correctAnswer: correctAns || answer, userAnswer: spokenText, similarity, isCorrect, feedback: evalFeedback, score: gainedScore };
      
      if (gainedScore > 0) {
        setScore((prev) => prev + gainedScore);
        setSessionScore((prev) => prev + gainedScore);
      }
      setFeedback(evalFeedback);
      setLastGainedScore(gainedScore || 0);
      setChatHistory((prev) => [...prev, resultData]);
      setSessionQCount(prev => prev + 1);
      setQuestionsAnswered((prev) => prev + 1);
      setShowResult(true);

      await saveAttempt({ question, userAnswer: spokenText, correctAnswer: correctAns || answer, isCorrect, score: gainedScore, timeTaken });
      if (sessionQCount + 1 >= SESSION_LENGTH) setShowSessionEnd(true);
    } catch (error) {
      setFeedback("Something went wrong during evaluation.");
      setShowResult(true);
    } finally {
      setIsAnswering(false);
    }
  };

  const speakQuestion = async () => {
    if (!currentQuestion) return;
    try {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      const response = await fetch("/api/inquizzo/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentQuestion }),
      });
      if (!response.ok) throw new Error("TTS proxy failed");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      audio.play().catch(e => console.error("🔇 Audio play failed:", e));
    } catch (error) {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(currentQuestion);
        utterance.rate = 0.95;
        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
        utterance.voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Neural"))) || voices[0];
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const resetQuiz = (diffOverride = null) => {
    const validLevels = ["easy", "medium", "hard"];
    const actualOverride = typeof diffOverride === "string" && validLevels.includes(diffOverride) ? diffOverride : null;
    setIsListening(false);
    setTranscript("");
    setFeedback("");
    setShowResult(false);
    setIsAnswering(false);
    setTimer(30);
    setError("");
    questionStartTimeRef.current = Date.now();
    getAIQuestion(actualOverride);
  };

  const startNewSession = () => {
    sessionIdRef.current = crypto.randomUUID();
    setSessionQCount(0);
    setSessionScore(0);
    setShowSessionEnd(false);
    setScore(0);
    setChatHistory([]);
    setQuestionsAnswered(0);
    resetQuiz();
  };

  useEffect(() => {
    if (timer > 0 && timerActive && !showResult) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      if (transcript) checkAnswer(transcript);
      else {
        setFeedback("Time's up! The correct answer is: " + correctAnswer);
        setShowResult(true);
        setQuestionsAnswered((prev) => prev + 1);
      }
    }
  }, [timer, timerActive, showResult]);

  const saveSeenQuestion = (question) => {
    if (!question) return;
    const key = getSeenQuestionsKey();
    const seen = seenQuestionsRef.current;
    if (!seen.includes(question)) {
      seen.push(question);
      if (seen.length > 500) seen.splice(0, seen.length - 500);
      seenQuestionsRef.current = seen;
      localStorage.setItem(key, JSON.stringify(seen));
    }
  };

  const saveAttempt = async ({ question, userAnswer, correctAnswer, isCorrect, score, timeTaken }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !sessionIdRef.current) return;
      await fetch("/api/inquizzo/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          moduleId: "inQuizzo",
          gameType: "voice",
          sessionId: sessionIdRef.current,
          question,
          userAnswer,
          correctAnswer,
          isCorrect,
          score,
          difficulty: selectedDifficulty,
          timeTaken,
        }),
      });
    } catch (e) {}
  };

  const getAIQuestion = async (diffOverride = null) => {
    const token = getAuthToken();
    if (!token) {
      setError("Please login to access quiz questions.");
      setIsAuthenticated(false);
      return;
    }
    setIsLoading(true);
    setError("");
    const actualDifficulty = (typeof diffOverride === "string" && ["easy", "medium", "hard"].includes(diffOverride)) ? diffOverride : (selectedDifficulty || "medium");
    const topics = ["general knowledge", "science", "history", "geography", "technology", "sports", "mathematics", "coding"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    try {
      const data = await makeAuthenticatedRequest("/api/inquizzo/ask", {
        method: "POST",
        body: JSON.stringify({ topic: randomTopic, seenQuestions: seenQuestionsRef.current, difficulty: actualDifficulty }),
      });

      if (data && data.question) {
        setCurrentQuestion(data.question);
        setCorrectAnswer(data.answer);
        saveSeenQuestion(data.question);
        setTimer(30);
        setTimerActive(false);
        setTranscript("");
        setFeedback("");
        setShowResult(false);
        setIsAnswering(false);
        questionStartTimeRef.current = Date.now();
      } else throw new Error("Invalid data");
    } catch (error) {
      setError("Connection issue. Loading fallback question.");
      setCurrentQuestion("What is the capital of India?");
      setCorrectAnswer("New Delhi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    sessionIdRef.current = crypto.randomUUID();
    getAIQuestion();
  }, []);

  const downloadCSV = () => {
    let content = `Score: ${score}\n\n`;
    chatHistory.forEach((entry, index) => {
      content += `Q${index + 1}: ${entry.question}\nAnswer: ${entry.userAnswer}\nCorrect: ${entry.correctAnswer}\n\n`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quiz_results.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("InQuizzo Random Practice Results", 20, 20);
    doc.text(`Score: ${score}`, 20, 30);
    let y = 40;
    chatHistory.forEach((entry, index) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`Q${index + 1}: ${entry.question.substring(0, 70)}`, 20, y);
      y += 10;
    });
    doc.save("quiz_results.pdf");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
      <Header 
        DateValue="random-practice" 
        onDateChange={() => {}} 
        tempDate={new Date().toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })} 
        showDateFilter={false}
      />

      <main className="relative z-10 flex flex-col items-center px-4 py-8 grow justify-center">
        <div className="w-full max-w-3xl mx-auto animate-fadeIn group">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-persona-ink">Random Practice</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className={cn("w-5 h-5", timer <= 10 && isListening ? "text-red-500 animate-pulse" : "text-persona-purple")} />
                <span className={cn("text-xl font-bold tabular-nums", timer <= 10 && isListening ? "text-red-500" : "text-persona-ink")}>
                  {isListening ? `0:${timer < 10 ? `0${timer}` : timer}` : "--:--"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-persona-purple/5 rounded-full border border-persona-purple/20 shadow-sm">
                <Zap className="w-4 h-4 text-persona-purple" />
                <span className="font-bold text-persona-purple text-sm">{score}</span>
              </div>
            </div>
          </div>

          <Card className="border-2 border-muted shadow-xl rounded-3xl overflow-hidden mb-6 bg-card">
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground py-0">Question {questionsAnswered + 1}</Badge>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn("w-6 h-1 rounded-full bg-muted", i <= questionsAnswered % 5 && "bg-persona-purple")} />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-persona-ink leading-tight">
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <LoaderIcon />
                        Fetching next challenge...
                      </div>
                    ) : currentQuestion || "Ready to start?"}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={speakQuestion}
                  disabled={!currentQuestion || isLoading}
                  className="w-12 h-12 rounded-xl flex-shrink-0 border-muted hover:border-persona-purple hover:text-persona-purple shadow-sm transition-all"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>

              {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-sm flex flex-col items-center gap-3">
                  <p>{error}</p>
                  <Button variant="outline" size="sm" onClick={() => getAIQuestion()} className="border-red-500/30 text-red-500">Retry Fetch</Button>
                </div>
              )}

              <div className="flex flex-col items-center justify-center py-6 border-y border-muted/50 mb-6 bg-muted/5 rounded-2xl">
                <div className="relative mb-6">
                  {isListening && (
                    <div className="absolute -inset-4 bg-red-500/10 rounded-full animate-ping pointer-events-none" />
                  )}
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isAnswering || isLoading || !currentQuestion}
                    className={cn(
                      "w-24 h-24 rounded-full shadow-2xl transition-all duration-300 scale-100 hover:scale-105 active:scale-95",
                      isListening 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
                        : "bg-persona-purple hover:bg-persona-purple/90 text-white shadow-persona-purple/20"
                    )}
                  >
                    {isListening ? (
                      <MicOff className="w-10 h-10" />
                    ) : (
                      <Mic className="w-10 h-10" />
                    )}
                  </Button>
                </div>

                {isAnswering ? (
                  <div className="flex flex-col items-center gap-2">
                     <div className="flex items-center gap-3 text-persona-purple font-semibold">
                      <LoaderIcon />
                      AI is evaluating...
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-medium text-persona-ink/60">
                      {isListening ? "Listening... Speak now" : "Tap the mic and answer aloud"}
                    </p>
                    {isListening && transcript && (
                      <p className="mt-4 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-muted text-persona-ink/80 text-sm italic shadow-inner line-clamp-2 max-w-md mx-auto">
                        "{transcript}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {showResult && feedback && (
              <Card className={cn(
                "p-6 border-l-4 rounded-2xl shadow-lg border border-border bg-card animate-fadeIn",
                feedback.toLowerCase().includes("correct") || feedback.includes("✅")
                  ? "border-l-green-500"
                  : "border-l-red-500"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      feedback.toLowerCase().includes("correct") || feedback.includes("✅")
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    )}>
                      {feedback.toLowerCase().includes("correct") || feedback.includes("✅") ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-persona-ink">AI Insights</h4>
                  </div>
                  <Badge className="bg-persona-purple text-white">+{lastGainedScore} XP</Badge>
                </div>
                <p className="text-persona-ink/80 text-base leading-relaxed mb-6">
                  {feedback}
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => resetQuiz()} className="flex-1 bg-persona-purple hover:bg-persona-purple/90 h-12 rounded-xl font-bold">
                    <Play className="w-5 h-5 mr-2" /> Next Challenge
                  </Button>
                </div>
              </Card>
            )}

            {!showResult && !isListening && !isAnswering && currentQuestion && (
              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => resetQuiz()} className="text-muted-foreground hover:text-persona-ink">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Skip this question
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {!showSessionEnd && (
        <Card className="fixed bottom-6 right-6 z-50 p-4 border border-border shadow-2xl rounded-2xl bg-card/95 backdrop-blur-md hidden md:block">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-persona-purple" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty</span>
            </div>
            {["easy", "medium", "hard"].map((level) => (
              <Button
                key={level}
                onClick={() => {
                  setSelectedDifficulty(level);
                  if (!isLoading) resetQuiz(level);
                }}
                variant={selectedDifficulty === level ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 rounded-lg text-[10px] font-bold uppercase w-24",
                  selectedDifficulty === level 
                    ? level === "easy" ? "bg-green-500 hover:bg-green-600" : level === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"
                    : "border-muted text-muted-foreground"
                )}
              >
                {level}
              </Button>
            ))}
            <div className="h-px bg-muted mt-2 mb-1" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadPDF} className="h-8 text-[10px] px-2 flex-1">
                <Shield className="w-3 h-3 mr-1" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCSV} className="h-8 text-[10px] px-2 flex-1">
                <History className="w-3 h-3 mr-1" /> CSV
              </Button>
            </div>
          </div>
        </Card>
      )}

      {showSessionEnd && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-3xl p-10 border-2 border-persona-purple/20 shadow-2xl text-center bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-persona-purple via-blue-500 to-persona-purple" />
            <div className="w-20 h-20 bg-persona-purple/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🏆</div>
            <h3 className="text-3xl font-bold text-persona-ink mb-2">Practice Complete!</h3>
            <p className="text-muted-foreground mb-8 text-lg">You've mastered {SESSION_LENGTH} random topics</p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Score</p>
                <p className="text-3xl font-black text-persona-ink">{sessionScore}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">XP Gained</p>
                <p className="text-3xl font-black text-persona-ink">{score}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={startNewSession} className="h-12 bg-persona-purple hover:bg-persona-purple/90 rounded-xl font-bold">Start New Session</Button>
              <Button variant="ghost" onClick={() => window.location.href='/inquizzo'} className="text-muted-foreground">Return to InQuizzo</Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Quiz;