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
} from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";

const Atom = () => (
  <div className="inline-block animate-spin">
    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
  </div>
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
  const [particles, setParticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    // ✅ Load user data from localStorage (set by login/signup pages)
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUsername(userData.name || userData.username || userData.email || "");
        setIsAuthenticated(true);
        console.log("✅ User authenticated from localStorage:", userData.email);
      } catch {
        setUsername("");
        setIsAuthenticated(false);
      }
    } else {
      setUsername(localStorage.getItem("username") || "");
      setIsAuthenticated(false);
    }

    setParticles(
      [...Array(22)].map((_, i) => ({
        left: `${(i * 97 + Math.random() * 30) % 100}%`,
        top: `${Math.random() * 90}%`,
        delay: `${Math.random() * 10}s`,
      }))
    );
  }, []);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);

  const recognitionRef = useRef(null);
  const currentQuestionRef = useRef({ question: "", answer: "" });
  const seenQuestionsRef = useRef([]);
  const voicesRef = useRef([]);

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
      console.log(`📦 Loaded ${seenQuestionsRef.current.length} seen questions from localStorage`);
    } catch { seenQuestionsRef.current = []; }
  }, []);

  // ✅ Preload TTS voices (Chrome loads them asynchronously)
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        voicesRef.current = speechSynthesis.getVoices();
        console.log(`🔊 Loaded ${voicesRef.current.length} TTS voices`);
      };
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ✅ Helper function to get authentication token
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  // ✅ Helper function to handle authentication errors
  const handleAuthError = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setError("Authentication failed. Please login again.");
  };

  // ✅ Helper function for authenticated API calls
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
  }, [currentQuestion, correctAnswer]);

  // ✅ FIXED: SpeechRecognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("⚠️ Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // ✅ FIXED: single result mode
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("🎤 Speech recognition ended");
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      console.log("🎤 Transcript:", finalTranscript);
      setTranscript(finalTranscript);
      setIsAnswering(true);
      setTimeout(() => {
        checkAnswer(finalTranscript);
        setIsAnswering(false);
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error("🎤 Speech error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setFeedback("Microphone permission denied. Please allow mic access in browser settings.");
      } else if (event.error === "no-speech") {
        setFeedback("No speech detected. Please try again and speak clearly.");
      } else if (event.error === "network") {
        setFeedback("Network error with speech recognition. Please check your connection.");
      } else {
        setFeedback("Speech error: " + event.error);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { if (recognitionRef.current) recognitionRef.current.abort(); } catch { }
    };
  }, []);

  // ✅ FIXED: Request mic permission first, then start recognition
  const startListening = async () => {
    if (!currentQuestion) return;

    // Request mic permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // release immediately
    } catch (err) {
      console.error("Mic permission error:", err);
      setFeedback("Microphone access denied. Please allow mic access and try again.");
      return;
    }

    if (!recognitionRef.current) {
      setFeedback("Speech recognition not available in this browser.");
      return;
    }

    try {
      // Abort any existing session first
      try { recognitionRef.current.abort(); } catch { }

      setTranscript("");
      setFeedback("");
      setShowResult(false);
      setTimer(30);

      recognitionRef.current.start();
      console.log("🎤 Recognition start called");
    } catch (err) {
      console.error("Speech recognition start error:", err);
      if (err.name === "InvalidStateError") {
        setIsListening(true);
      } else {
        setFeedback("Could not start speech recognition. Please reload the page.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
      setIsListening(false);
    }
  };

  // ✅ UPDATED: checkAnswer function with proper authentication
  const checkAnswer = async (spokenText) => {
    const { question, answer } = currentQuestionRef.current;

    if (!question) {
      setFeedback("Error: Missing question data. Please try again.");
      setShowResult(true);
      return;
    }

    const userAnswer = spokenText.trim().toLowerCase();
    const skipPhrases = ["i don't know", "no idea", "skip", "pass", "not sure"];
    const isSkip = skipPhrases.some((phrase) => userAnswer.includes(phrase));

    if (isSkip) {
      const feedbackMsg = "You chose to skip this question.";
      const resultData = {
        question,
        correctAnswer: answer,
        userAnswer: spokenText,
        isCorrect: null,
        feedback: feedbackMsg,
        score: 0,
      };

      setFeedback(feedbackMsg);
      setChatHistory((prev) => [...prev, resultData]);
      setQuestionsAnswered((prev) => prev + 1);
      setShowResult(true);
      return;
    }

    try {
      // ✅ Call the correct endpoint with authentication
      const data = await makeAuthenticatedRequest(
        "/api/inquizzo/evaluate",
        {
          method: "POST",
          body: JSON.stringify({
            userAnswer: spokenText,
            question,
            sessionId: Date.now().toString(), // Simple session ID
            timeTaken: 30 - timer, // Calculate time taken
          }),
        }
      );

      // ✅ Extract data from the new response format
      const { result, userStats } = data;
      const {
        isCorrect,
        similarity,
        score: gainedScore,
        feedback: evalFeedback,
        correctAnswer: correctAns,
      } = result;

      const resultData = {
        username,
        question,
        correctAnswer: correctAns,
        userAnswer: spokenText,
        similarity,
        isCorrect,
        feedback: evalFeedback,
        score: gainedScore,
      };

      // ✅ Update local score if points were gained
      if (gainedScore > 0) {
        setScore((prev) => prev + gainedScore);
      }

      // ✅ Update correct answer for display
      if (correctAns) {
        setCorrectAnswer(correctAns);
      }

      setFeedback(evalFeedback);
      setChatHistory((prev) => [...prev, resultData]);
      setQuestionsAnswered((prev) => prev + 1);
      setShowResult(true);

      console.log("✅ Updated user stats:", userStats);
    } catch (error) {
      console.error("❌ Error analyzing answer:", error.message);
      setFeedback(
        "Something went wrong while analyzing your answer. Please check your authentication."
      );
      setShowResult(true);
    }
  };

  // ✅ FIXED: Use preloaded voices for TTS
  const speakQuestion = () => {
    if ("speechSynthesis" in window && currentQuestion) {
      speechSynthesis.cancel(); // Stop any ongoing speech first
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.rate = 0.8;
      // Use preloaded voices, fallback to live query
      const voices = voicesRef.current.length > 0 ? voicesRef.current : speechSynthesis.getVoices();
      utterance.voice =
        voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0] || null;
      utterance.onerror = (e) => console.error("TTS error:", e);
      speechSynthesis.speak(utterance);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion("");
    setCorrectAnswer("");
    setTranscript("");
    setFeedback("");
    setShowResult(false);
    setIsAnswering(false);
    setTimer(30);
    setError("");
    getAIQuestion();
  };

  useEffect(() => {
    if (timer > 0 && isListening) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && isListening) {
      stopListening();
      if (transcript) {
        checkAnswer(transcript);
      } else {
        setFeedback("Time's up! The correct answer is: " + correctAnswer);
        setShowResult(true);
        setQuestionsAnswered((prev) => prev + 1);
      }
    }
  }, [timer, isListening]);

  // ✅ UPDATED: getAIQuestion function with proper authentication
  // const getAIQuestion = async () => {
  //   setIsLoading(true);
  //   setError("");
  //   setCurrentQuestion("");
  //   setCorrectAnswer("");

  //   const topics = [
  //     "science",
  //     "indian history",
  //     "geography",
  //     "technology",
  //     "sports",
  //     "mathematics",
  //     "coding",
  //   ];
  //   const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  //   const message = `Give me a unique ${randomTopic} quiz question and its answer in JSON format only. Example: {"question": "What is the capital of France?", "answer": "Paris"}`;

  //   try { 
  //     //  const token = localStorage.getItem("token"); // FRONTEND: safe to use here

  //   // const res = await fetch("http://localhost:5000/api/ask", {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //     Authorization: `Bearer ${token}`,
  //   //   },
  //   //   body: JSON.stringify({
  //   //     message: "Generate a quiz question",
  //   //     subject: selectedSubject,
  //   //     category: selectedCategory,
  //   //     topic: selectedTopic,
  //   //   }),
  //   // });
  //     // ✅ Use authenticated request
  //     const data = await makeAuthenticatedRequest(
  //       "http://localhost:5000/api/ask",
  //       {
  //        method: "POST",
  //       body: JSON.stringify({
  //         topic: selectedTopic || randomTopic,
  //         subject: selectedSubject,
  //         category: selectedCategory,
  //       })
  //     }
  //     );

  //     if (!data.question || !data.answer) {
  //       setCurrentQuestion(data.question);
  //       setCorrectAnswer(data.answer);
  //       console.log("✅ New Unique Question Loaded");
  //     } 

  //     setCurrentQuestion(data.question);
  //     setCorrectAnswer(data.answer);

  //     console.log("✅ Question loaded:", data.question);
  //     console.log("✅ User stats:", data.user);
  //   } catch (error) {
  //     console.error("❌ Error loading question:", error.message);
  //     setError(`Failed to load question: ${error.message}`);

  //     // ✅ Fallback to public endpoint if authentication fails
  //     if (
  //       error.message.includes("Authentication") ||
  //       error.message.includes("401")
  //     ) {
  //       console.log("🔄 Trying public endpoint as fallback...");
  //       try {
  //         const fallbackData = await fetch(
  //           "http://localhost:5000/api/ask-public",
  //           {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ message }),
  //           }
  //         ).then((res) => res.json());

  //         setCurrentQuestion(fallbackData.question || "What is 2 + 2?");
  //         setCorrectAnswer(fallbackData.answer || "4");
  //         setError("Using public mode - some features may be limited");
  //       } catch (fallbackError) {
  //         setCurrentQuestion("What is 2 + 2?");
  //         setCorrectAnswer("4");
  //         setError("Failed to load question. Using fallback.");
  //       }
  //     } else {
  //       setCurrentQuestion("What is 2 + 2?");
  //       setCorrectAnswer("4");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ✅ Helper: save a question to localStorage seen list (max 80)
  const saveSeenQuestion = (question) => {
    if (!question) return;
    const key = getSeenQuestionsKey();
    const seen = seenQuestionsRef.current;
    if (!seen.includes(question)) {
      seen.push(question);
      // Keep only last 80 questions
      if (seen.length > 80) seen.splice(0, seen.length - 80);
      seenQuestionsRef.current = seen;
      localStorage.setItem(key, JSON.stringify(seen));
      console.log(`📦 Saved seen question (${seen.length}/80):`, question.substring(0, 50));
    }
  };

  const getAIQuestion = async () => {
    // ✅ Check authentication before making API call
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to access quiz questions.");
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    setError("");

    const topics = [
      "science",
      "indian history",
      "geography",
      "technology",
      "sports",
      "mathematics",
      "coding",
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    try {
      const data = await makeAuthenticatedRequest(
        "/api/inquizzo/ask",
        {
          method: "POST",
          body: JSON.stringify({
            topic: selectedTopic || randomTopic,
            subject: selectedSubject,
            category: selectedCategory,
            seenQuestions: seenQuestionsRef.current, // ✅ Send seen questions to avoid repeats
          }),
        }
      );

      if (data && data.question) {
        setCurrentQuestion(data.question);
        setCorrectAnswer(data.answer);
        saveSeenQuestion(data.question); // ✅ Save to localStorage
        console.log("✅ New Unique Question:", data.question);
      } else {
        throw new Error("Invalid data received");
      }
    } catch (error) {
      console.error("❌ Quiz Error:", error.message);
      setError("Connection issue. Loading fallback question.");
      setCurrentQuestion("What is the capital of India?");
      setCorrectAnswer("New Delhi");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    getAIQuestion();
  }, []);

  const handleNameChange = (e) => {
    setUsername(e.target.value);
    localStorage.setItem("username", e.target.value);
  };

  const downloadCSV = () => {
    const date = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });

    let content = `Username: ${username || "Unknown"}\n`;
    content += `Score: ${score}\n`;
    content += `Time: ${date}\n\n`;

    chatHistory.forEach((entry, index) => {
      content += `Q${index + 1}:\n`;
      content += `Question: ${entry.question}\n`;
      content += `Your Answer: ${entry.userAnswer}\n`;
      content += `Correct Answer: ${entry.correctAnswer}\n`;

      if (entry.isCorrect === true) {
        content += `Result: ✅ Correct\n`;
      } else if (entry.isCorrect === false) {
        content += `Result: ❌ Incorrect\n`;
        content += `Explanation: ${entry.feedback}\n`;
      } else {
        content += `Result: ⚠️ Skipped\n`;
        content += `Note: ${entry.feedback}\n`;
      }

      content += `\n`;
    });

    // Create a Blob from content
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${username || "quiz_results"}.txt`; // You can change to '.csv' if needed

    // Append to DOM, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
    URL.revokeObjectURL(link.href);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    localStorage.setItem("username", e.target.value);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-blue-950 to-slate-900 text-white font-sans overflow-hidden">
      {/* --- Layered Backgrounds --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[120vw] h-[120vw] bg-gradient-radial from-indigo-700/30 via-blue-600/10 to-transparent blur-3xl -top-1/2 -left-1/2 animate-spin-fast"></div>
        <div className="absolute w-[100vw] h-[110vw] bg-gradient-radial from-pink-500/10 via-blue-800/20 to-transparent blur-2xl -bottom-1/3 -right-1/3 opacity-90"></div>
      </div>

      {/* --- Floating Particles --- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-[6px] h-[6px] rounded-full shadow-lg bg-white/10 animate-twinkle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* --- Header --- */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="glass-card px-5 py-2 rounded-2xl flex items-center space-x-2 shadow-md border border-yellow-300/20">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-300">{score}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-2xl border border-white/20 text-gray-200 flex items-center">
            <span>Q: {questionsAnswered}</span>
          </div>
        </div>
        <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-[#ffffff] bg-clip-text text-transparent drop-shadow-2xl tracking-tight uppercase">
            InQuizo
          </h1>
          <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-200 to-blue-500 transition-all duration-500 rounded-full mt-1"></div>
        </div>
      </header>

      {/* --- Main Section with Glass Card Hero --- */}
      <main className="relative z-10 flex flex-col items-center px-2 py-8 grow justify-center">
        <section className="w-full max-w-3xl mx-auto">
          {/* Hero Card */}
          <div className="mb-10">
            <div className="relative glass-card p-10 rounded-3xl shadow-3xl border border-white/40 overflow-hidden bg-gradient-to-br from-indigo-950/80 to-blue-800/60">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-radial from-white/30 to-transparent rounded-full blur-xl pointer-events-none"></div>
              <Play className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h2 className="text-5xl md:text-7xl font-black mb-3 bg-gradient-to-r from-[#fff] via-[#6e41df] to-[#44c5eb] bg-clip-text text-transparent drop-shadow-lg text-center select-none">
                Voice Quiz
              </h2>
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="relative mb-12 group">
            <div className="glass-card rounded-3xl p-10 border border-white/20 shadow-3xl backdrop-blur-3xl transition-all duration-700 hover:scale-105 hover:shadow-4xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-300" />
                  <h3 className="text-2xl font-bold text-blue-100 flex items-center gap-2">
                    {isLoading && <Atom />} Challenge
                  </h3>
                </div>
                <button
                  onClick={speakQuestion}
                  disabled={!currentQuestion || isLoading}
                  className="glass-card px-5 py-3 rounded-2xl transition-all duration-300 border border-blue-400/50 hover:bg-blue-700/20 hover:border-blue-300 disabled:opacity-40 group"
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-200 group-hover:scale-125 transition-transform" />
                    <span className="text-blue-200 font-semibold">Listen</span>
                  </div>
                </button>
              </div>

              {/* Main Question */}
              <div className="text-center mb-8 min-h-[64px] animate-fadeIn">
                {error ? (
                  <div className="space-y-4">
                    <p className="text-2xl font-bold text-red-400">{error}</p>
                    <button
                      onClick={getAIQuestion}
                      className="glass-card px-6 py-3 rounded-2xl border border-red-400/40 hover:bg-red-700/10 text-red-100 font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Atom />
                    <p className="text-2xl font-bold text-blue-300">
                      Loading question...
                    </p>
                  </div>
                ) : (
                  <p className="text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg transition-all duration-500">
                    {currentQuestion || "No question loaded"}
                  </p>
                )}
              </div>

              {/* Voice Mic Button w/ Glow */}
              {!error && !isLoading && currentQuestion && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!recognitionRef.current || isAnswering}
                    className={`relative overflow-visible w-36 h-36 rounded-full flex items-center justify-center transition-all 
                ${isListening
                        ? "bg-gradient-to-tr from-red-600 via-red-500 to-purple-700 animate-micPulse scale-110 shadow-lg"
                        : isAnswering
                          ? "bg-gradient-to-br from-yellow-500 to-orange-600 animate-bounce"
                          : "bg-gradient-to-br from-blue-600 to-blue-800 hover:scale-105"
                      }
                ${!recognitionRef.current
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                      }
              `}
                  >
                    {/* Gradient ring glow */}
                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-4
                ${isListening
                          ? "border-red-400/80 animate-glow"
                          : isAnswering
                            ? "border-yellow-400/80"
                            : "border-blue-500/30 group-hover:border-blue-300"
                        }
              `}
                    ></span>
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white/5"></span>
                    {/* Icon logic */}
                    {isAnswering ? (
                      <div className="w-8 h-8 border-4 border-white/70 border-t-transparent rounded-full animate-spin"></div>
                    ) : isListening ? (
                      <MicOff className="w-14 h-14 text-white drop-shadow-lg" />
                    ) : (
                      <Mic className="w-14 h-14 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                  <p className="mt-5 text-lg text-blue-200 font-medium">
                    {isListening
                      ? `Listening... Speak clearly! Time: ${timer}s`
                      : "Click the button and speak your answer"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={resetQuiz}
              className="group/reset glass-card hover:bg-white/10 px-8 py-4 rounded-2xl transition-all duration-300 justify-end border border-purple-500/30 hover:border-purple-400/50 hover:scale-105 shadow-md item-end  mx-auto  bottom-6 right-6 flex gap-4"
              type="button"
            >
              <RotateCcw className="w-6 h-6 text-purple-400 group-hover/reset:rotate-180 transition-transform duration-500 mr-3" />
              <span className="text-xl font-bold text-purple-300 select-none ">
                Next Challenge
              </span>
            </button>
          </div>

          {/* Response Section */}
          {(transcript || showResult) && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto px-4">
              {/* User Transcript */}
              {transcript && (
                <div className="relative group/answer">
                  <div className="relative glass-card rounded-3xl p-8 border border-blue-400/30 shadow-lg backdrop-blur-xl">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg select-none">
                          You
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-blue-300">
                        Your Response
                      </h4>
                    </div>
                    <p className="text-3xl font-semibold text-white leading-relaxed pl-14 tracking-wide break-words">
                      "{transcript}"
                    </p>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {showResult && feedback && (
                <div className="relative group/feedback animate-in slide-in-from-bottom-4 duration-500 delay-300 max-w-lg mx-auto">
                  <div
                    className={`
            relative glass-card rounded-3xl p-8 border-l-4 shadow-2xl
            ${feedback.toLowerCase().includes("correct") ||
                        feedback.toLowerCase().includes("perfect") ||
                        feedback.toLowerCase().includes("that's correct")
                        ? "border-green-400 bg-green-900/20"
                        : "border-red-400 bg-red-900/20"
                      }
            transition-colors duration-300
          `}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div
                        className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${feedback.toLowerCase().includes("correct") ||
                            feedback.toLowerCase().includes("perfect") ||
                            feedback.toLowerCase().includes("that's correct")
                            ? "bg-green-500"
                            : "bg-red-500"
                          }
                shadow-md
              `}
                      >
                        {feedback.toLowerCase().includes("correct") ||
                          feedback.toLowerCase().includes("perfect") ||
                          feedback.toLowerCase().includes("that's correct") ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <h4 className="text-2xl font-bold text-white select-none">
                        AI Analysis
                      </h4>
                    </div>

                    <p
                      className={`
              text-3xl font-bold leading-relaxed pl-14 tracking-wide whitespace-pre-wrap break-words
              ${feedback.toLowerCase().includes("correct") ||
                          feedback.toLowerCase().includes("perfect") ||
                          feedback.toLowerCase().includes("that's correct")
                          ? "text-green-300"
                          : "text-red-300"
                        }
            `}
                    >
                      {feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Chat History */}
              {chatHistory.length > 0 && (
                <div className="mt-10 space-y-6 max-w-5xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-4 select-none">
                    📜 Chat History
                  </h2>
                  {chatHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-xl shadow-lg"
                    >
                      <p className="text-white text-lg mb-1 break-words">
                        <span className="text-blue-400 font-bold select-none">
                          Q{index + 1}:
                        </span>{" "}
                        {entry.question}
                      </p>
                      <p className="text-yellow-300 mb-1 break-words">
                        <span className="font-semibold select-none">You:</span>{" "}
                        {entry.userAnswer}
                      </p>
                      <p className="text-green-300 mb-1 break-words">
                        <span className="font-semibold select-none">
                          Correct:
                        </span>{" "}
                        {entry.correctAnswer}
                      </p>
                      <p
                        className={`font-bold break-words ${entry.isCorrect ? "text-green-400" : "text-red-400"
                          }`}
                      >
                        {entry.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Download CSV Button */}
              {showResult && questionsAnswered >= 10 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={downloadCSV}
                    className="glass-card hover:bg-blue-800 px-8 py-3 rounded-xl text-black font-semibold bg-slate-950 transition-colors duration-300 shadow-md"
                    type="button"
                  >
                    📥 Download Results (CSV)
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {showResult && (
                <div className="text-center mt-12 animate-in fade-in-0 duration-500 delay-700 space-y-6">
                  {/* Feedback Message */}
                  {feedback && (
                    <div
                      className={`
              inline-block px-6 py-4 rounded-xl border text-lg font-medium select-none
              ${feedback.toLowerCase().includes("correct") ||
                          feedback.toLowerCase().includes("perfect") ||
                          feedback.toLowerCase().includes("that's correct")
                          ? "border-green-400 bg-green-100/20 text-green-300"
                          : feedback.toLowerCase().includes("skip")
                            ? "border-yellow-400 bg-yellow-100/20 text-yellow-300"
                            : "border-red-400 bg-red-100/20 text-red-300"
                        }
              transition-colors duration-300
            `}
                    >
                      {feedback}
                    </div>
                  )}

                  <button
                    onClick={resetQuiz}
                    className="group/reset glass-card hover:bg-white/10 px-8 py-4 rounded-2xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 hover:scale-105 shadow-md inline-flex items-center justify-center mx-auto"
                    type="button"
                  >
                    <RotateCcw className="w-6 h-6 text-purple-400 group-hover/reset:rotate-180 transition-transform duration-500 mr-3" />
                    <span className="text-xl font-bold text-purple-300 select-none">
                      Next Challenge
                    </span>
                  </button>
                </div>
              )}

              {/* Browser Support Warning */}
              {!recognitionRef.current && (
                <div className="text-center mt-12">
                  <div className="glass-card p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/10 max-w-md mx-auto">
                    <p className="text-yellow-300 text-lg select-none">
                      Speech Recognition requires Chrome, Edge, or Safari
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* --- Animations CSS --- */}
      <style>
        {`
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 60px 30px #f00a, 0 0 100px 10px #1e90ff33; }
      50% { box-shadow: 0 0 100px 30px #ff4bcfb0, 0 0 80px 30px #64eaff77; }
       100% { box-shadow: 0 0 100px 30px #ff4bcfb0, 0 0 70px 90px #64eaff77; }
    }
    .animate-glow { animation: glow 1.2s infinite alternate ; }

    @keyframes micPulse {
      0%, 100% { filter: brightness(1) blur(0px);}
      50% { filter: brightness(1.5) blur(2px);}
    }
    .animate-micPulse { animation: micPulse 1.2s infinite; }

    @keyframes twinkle {
      0%,20%,100%{ opacity:0.3; }
      8%,12%{ opacity:1; }
      50%{ opacity:0.2;}
    }
    .animate-twinkle { animation: twinkle 7s linear infinite; }

    .glass-card {
      background: linear-gradient(120deg,#e3e3e32a 15%,#5e5ba92a 90%);
      backdrop-filter: blur(22px);
      border-radius: 1.8rem;
      box-shadow: 0 6px 32px 0 #0002, 0 1.5px 4px 0 #00d2,0 0px 30px 0 #0082;
      border:1px solid rgba(255,255,255,.08);
      transition: box-shadow .3s,transform .3s;
    }
    @media (max-width: 640px) {
      .glass-card { padding: 1rem !important; }
    }
    .bg-gradient-radial {
      background: radial-gradient(circle,var(--tw-gradient-stops));
    }
    .animate-fadeIn {animation: fadeIn .6s cubic-bezier(.44,.13,.48,.87);}
    @keyframes fadeIn {from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
    .shadow-3xl { box-shadow: 0 4px 40px 8px #08001526, 0 1px 2px 0 #6674f080;}
    .hover\\:shadow-4xl:hover { box-shadow: 0 6px 60px 12px #415cff44, 0 1.5px 4px 0 #59e6ff50;}
  `}
      </style>
    </div>
  );
};


export default Quiz;