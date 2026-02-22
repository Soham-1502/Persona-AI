// location : app/inquizzo/QuizDomainSelection/page.jsx

'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Play,
  Zap,
  Target,
  Mic,
  MicOff,
  Volume2,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Atom,
  BarChart3,
  Clock
} from "lucide-react";
import Header from '@/app/components/shared/header/Header.jsx';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { QUIZ_STRUCTURE } from "@/lib/quizData";

const QuizDomainSelection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [currentView, setCurrentView] = useState("domains"); // domains, categories, topics, quiz
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Quiz states
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [particles, setParticles] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [lastGainedScore, setLastGainedScore] = useState(0);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const seenQuestionsRef = useRef([]);

  // Difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  // Session tracking
  const SESSION_LENGTH = 10;
  const sessionIdRef = useRef(null);
  const [sessionQCount, setSessionQCount] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [showSessionEnd, setShowSessionEnd] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const questionStartTimeRef = useRef(Date.now());

  const recognitionRef = useRef(null);
  const currentQuestionRef = useRef({ question: "", answer: "" });
  const voicesRef = useRef([]);
  const transcriptRef = useRef("");

  // Helper functions for authentication
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = getAuthToken();

    if (!token) {
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
        throw new Error("Authentication failed");
      }

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (e) {
          // Fallback to status code
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  // Update URL when selections change
  const updateURL = (domain, category, subCategory, topic) => {
    const pathParts = ["inquizzo", "Quiz"];

    if (domain) pathParts.push(encodeURIComponent(domain));
    if (category) pathParts.push(encodeURIComponent(category));
    if (subCategory) pathParts.push(encodeURIComponent(subCategory));
    if (topic) pathParts.push(encodeURIComponent(topic));

    const newPath = "/" + pathParts.join("/");
    window.history.pushState({}, "", newPath);
    console.log("🔗 Updated URL:", newPath);
  };

  // Parse URL to get current selections
  const parseCurrentURL = () => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);

    console.log("🔍 Parsing URL parts:", parts);

    if (parts.length >= 2 && parts[0] === "Quiz") {
      const domain = decodeURIComponent(parts[1]);
      const category = parts[2] ? decodeURIComponent(parts[2]) : null;
      const subCategory = parts[3] ? decodeURIComponent(parts[3]) : null;
      const topic = parts[4] ? decodeURIComponent(parts[4]) : null;

      console.log("📍 Parsed:", { domain, category, subCategory, topic });

      if (QUIZ_STRUCTURE[domain]) {
        setSelectedDomain(domain);

        if (category && QUIZ_STRUCTURE[domain].categories[category]) {
          setSelectedCategory(category);
          setCurrentView("subCategories");

          if (
            subCategory &&
            QUIZ_STRUCTURE[domain].categories[category].subCategories[subCategory]
          ) {
            setSelectedSubCategory(subCategory);
            setCurrentView("topics");

            if (
              topic &&
              QUIZ_STRUCTURE[domain].categories[category].subCategories[subCategory]
                .topics[topic]
            ) {
              setSelectedTopic(topic);
              setCurrentView("quiz");
              fetchQuestion(domain, category, subCategory, topic);
            }
          }
        } else if (category) {
          setCurrentView("categories");
        }
      }
    }
  };

  useEffect(() => {
    parseCurrentURL();
    // Generate particles only on client side to avoid hydration mismatch
    setParticles(
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      }))
    );

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

  useEffect(() => {
    if (currentView === "quiz" && timerActive && timer > 0 && !showResult) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentView, timerActive, timer, showResult]);


  // ✅ Voice Preloading for TTS
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);



  const resetToHome = () => {
    setCurrentView("domains");
    setSelectedDomain(null);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedTopic(null);
    setScore(0);
    setQuestionsAnswered(0);
    setCurrentQuestion("");
    setTranscript("");
    setFeedback("");
    setShowResult(false);
    setTimer(30);
    setTimerActive(false);
    seenQuestionsRef.current = [];
    sessionIdRef.current = null;
    setSessionQCount(0);
    setSessionScore(0);
    setShowSessionEnd(false);
    setChatHistory([]);
    updateURL(null, null, null, null);
  };

  const handleDomainSelect = (domainKey) => {
    console.log("🌟 Domain selected:", domainKey);
    setSelectedDomain(domainKey);
    setCurrentView("categories");
    updateURL(domainKey, null, null, null);
  };

  const handleCategorySelect = (categoryKey) => {
    console.log("📚 Category selected:", categoryKey);
    setSelectedCategory(categoryKey);
    setCurrentView("subCategories");
    updateURL(selectedDomain, categoryKey, null, null);
  };

  const handleSubCategorySelect = (subCategoryKey) => {
    console.log("📂 SubCategory selected:", subCategoryKey);
    setSelectedSubCategory(subCategoryKey);
    setCurrentView("topics");
    updateURL(selectedDomain, selectedCategory, subCategoryKey, null);
  };

  const handleTopicSelect = async (topicKey) => {
    console.log("📖 Topic selected:", topicKey);
    setSelectedTopic(topicKey);
    setCurrentView("quiz");
    updateURL(selectedDomain, selectedCategory, selectedSubCategory, topicKey);

    await fetchQuestion(
      selectedDomain,
      selectedCategory,
      selectedSubCategory,
      topicKey
    );
  };

  const fetchQuestion = async (domain, category, subCategory, topic, diffOverride = null) => {
    setIsLoading(true);
    setError("");

    // Ensure diffOverride is not an Event object (common when bound directly to onClick)
    const validLevels = ["easy", "medium", "hard"];
    const actualDifficulty = (typeof diffOverride === "string" && validLevels.includes(diffOverride))
      ? diffOverride
      : selectedDifficulty;

    // Generate session ID at the start of a topic quiz
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID();
    }

    try {
      const data = await makeAuthenticatedRequest(
        "/api/inquizzo/ask",
        {
          method: "POST",
          body: JSON.stringify({
            topic: topic,
            subject: domain,
            category: category,
            subCategory: subCategory,
            seenQuestions: seenQuestionsRef.current,
            difficulty: actualDifficulty,
          }),
        }
      );

      console.log("✅ Question fetched:", data);

      if (data.question && data.answer) {

        setCurrentQuestion(data.question);

        setCorrectAnswer(data.answer);
        currentQuestionRef.current = { question: data.question, answer: data.answer };

        if (!seenQuestionsRef.current.includes(data.question)) {
          seenQuestionsRef.current = [...seenQuestionsRef.current, data.question].slice(-500);
        }

        setTimer(30);
        setTimerActive(false);
        setTranscript("");
        setFeedback("");
        setShowResult(false);
        questionStartTimeRef.current = Date.now();
      }
    } catch (error) {
      console.error("❌ Error fetching question:", error);
      setError("Failed to load question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser. Please use Chrome.");
      setIsBrowserSupported(false);
      return;
    }

    if (!isListening) {
      // Abort previous instance if it exists and didn't close properly
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { }
      }
      setTranscript("");
      transcriptRef.current = "";
      setError("");
      setTimer(30);
      setTimerActive(true);

      // Track whether we are intentionally stopping (via stopListening)
      let intentionalStop = false;
      // Track if any speech was captured
      let speechCaptured = false;
      let silenceTimer;

      const startSilenceTimer = () => {
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          console.log("🎤 Silence timeout reached after speech, stopping.");
          intentionalStop = true;
          recognition.stop();
        }, 6000);
      };



      const startRecognition = () => {
        recognitionRef.current = recognition;
        try { recognition.start(); } catch { }
      };

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        speechCaptured = true;
        // Start/reset the silence timer only once speech has been detected
        startSilenceTimer();

        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const newTranscript = (transcriptRef.current + " " + finalTranscript).trim();
          transcriptRef.current = newTranscript;
          setTranscript(newTranscript);
        } else if (interimTranscript) {
          // Show interim results in UI for responsiveness
          setTranscript((transcriptRef.current + " " + interimTranscript).trim());
        }
      };

      recognition.onend = () => {
        console.log("🎤 Speech recognition ended. Final:", transcriptRef.current);
        clearTimeout(silenceTimer);

        if (intentionalStop || transcriptRef.current.trim()) {
          // Either user stopped manually or we have captured text — finalize
          setIsListening(false);
          recognitionRef.current = null;
          if (transcriptRef.current.trim()) {
            submitAnswer(transcriptRef.current);
          }
        } else {
          // Not intentional and no speech yet — restart silently to keep listening
          console.log("🔄 Restarting recognition (no speech detected)...");
          try {
            recognition.start();
          } catch {
            setIsListening(false);
            recognitionRef.current = null;
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("⚠️ Speech recognition error:", event.error);
        clearTimeout(silenceTimer);

        if (event.error === "no-speech") {
          // Don't stop — just restart. The browser timed out looking for speech.
          // onend will trigger automatically and restart for us.
          console.log("🔁 no-speech — will auto-restart via onend");
          return; // let onend handle restart
        }

        if (event.error === "aborted") {
          // This is an intentional abort — do nothing
          return;
        }

        // Any other error (audio-capture, network, etc.) — stop and show message
        intentionalStop = true;
        setIsListening(false);
        recognitionRef.current = null;
        setError(`Mic Error: ${event.error}. Try refreshing the page.`);
      };

      // Store the 'intentional stop' setter so stopListening() can use it
      recognition._setIntentionalStop = () => { intentionalStop = true; };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setTimerActive(false);
      // Signal that this is intentional before calling stop()
      if (recognitionRef.current._setIntentionalStop) {
        recognitionRef.current._setIntentionalStop();
      }
      recognitionRef.current.stop();
    }
  };

  // Save one attempt to DB
  const saveAttempt = async ({ question, userAnswer, correctAnswer, isCorrect, score, timeTaken }) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
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
    } catch (e) {
      console.warn("⚠️ Could not save attempt:", e.message);
    }
  };

  const submitAnswer = async (textOveride = null) => {
    const finalAnswer = textOveride || transcript;
    if (!finalAnswer.trim()) {
      setError("Please provide an answer.");
      return;
    }

    const timeTaken = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    setIsAnswering(true);
    setTimerActive(false);

    try {
      const data = await makeAuthenticatedRequest(
        "/api/inquizzo/evaluate",
        {
          method: "POST",
          body: JSON.stringify({
            question: currentQuestionRef.current.question,
            userAnswer: finalAnswer,
            timeTaken,
          }),
        }
      );

      console.log("✅ Answer checked:", data);

      setFeedback(data.result.explanation || data.result.feedback);
      setLastGainedScore(data.result.score || 0);
      setShowResult(true);

      const gained = data.result.score || 0;
      if (data.result.isCorrect) {
        setScore((prev) => prev + gained);
        setSessionScore((prev) => prev + gained);
      }

      // Save attempt
      await saveAttempt({
        question: currentQuestionRef.current.question,
        userAnswer: finalAnswer,
        correctAnswer: data.result.correctAnswer || currentQuestionRef.current.answer,
        isCorrect: data.result.isCorrect || false,
        score: gained,
        timeTaken,
      });

      // Session tracking
      const newCount = sessionQCount + 1;
      setSessionQCount(newCount);
      setQuestionsAnswered((prev) => prev + 1);

      // Add to chat history
      setChatHistory((prev) => [...prev, {
        question: currentQuestionRef.current.question,
        userAnswer: finalAnswer,
        correctAnswer: data.result.correctAnswer,
        isCorrect: data.result.isCorrect,
        feedback: data.result.explanation || data.result.feedback,
        score: gained,
      }]);

      if (newCount >= SESSION_LENGTH) {
        setShowSessionEnd(true);
      }
    } catch (error) {
      console.error("❌ Error checking answer:", error);
      setError("Failed to check answer. Please try again.");
    } finally {
      setIsAnswering(false);
    }
  };

  const handleTimeout = async () => {
    setTranscript("Time's up!");
    await submitAnswer("Time's up!");
  };

  const nextQuestion = (diffOverride = null) => {
    const validLevels = ["easy", "medium", "hard"];
    const actualOverride = typeof diffOverride === "string" && validLevels.includes(diffOverride)
      ? diffOverride
      : null;

    setTimer(30);
    setTimerActive(false);
    setTranscript("");
    setFeedback("");
    setShowResult(false);
    fetchQuestion(selectedDomain, selectedCategory, selectedSubCategory, selectedTopic, actualOverride);
  };

  const startNewSession = () => {
    sessionIdRef.current = crypto.randomUUID();
    setSessionQCount(0);
    setSessionScore(0);
    setShowSessionEnd(false);
    setScore(0);
    setChatHistory([]);
    setQuestionsAnswered(0);
    nextQuestion();
  };

  const downloadHistory = () => {
    const date = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });

    let content = `Username: ${localStorage.getItem("username") || "Unknown"}\n`;
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

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz_results_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
    const username = localStorage.getItem("username") || "Unknown";

    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text("Inquizzo Quiz Results", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Student: ${username}`, 20, 35);
    doc.text(`Score: ${score}`, 20, 42);
    doc.text(`Date: ${date}`, 20, 49);

    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    let yPos = 65;

    chatHistory.forEach((entry, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont(undefined, 'bold');
      doc.text(`Q${index + 1}: ${entry.question.substring(0, 80)}${entry.question.length > 80 ? "..." : ""}`, 20, yPos);
      yPos += 7;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(entry.isCorrect ? [40, 167, 69] : [220, 53, 69]);
      doc.text(`Your Answer: ${entry.userAnswer || "No Answer"}`, 25, yPos);
      yPos += 7;

      doc.setTextColor(0);
      doc.text(`Correct Answer: ${entry.correctAnswer}`, 25, yPos);
      yPos += 7;

      if (!entry.isCorrect && entry.feedback) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        const splitFeedback = doc.splitTextToSize(`Explanation: ${entry.feedback}`, 160);
        doc.text(splitFeedback, 25, yPos);
        yPos += (splitFeedback.length * 5);
      }

      yPos += 10;
    });

    doc.save(`${username}_results.pdf`);
  };

  // ✅ Enhanced FREE Neural TTS using Microsoft Edge Proxy
  const speakQuestion = async () => {
    if (!currentQuestion) return;

    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      console.log("🔊 Fetching high-quality voice for:", currentQuestion.substring(0, 30));

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

      console.log("✅ Playing humanized voice (Microsoft Edge Neural)");
    } catch (error) {
      console.warn("⚠️ High-quality TTS failed, falling back to system voice:", error.message);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(currentQuestion);
        utterance.rate = 0.95;
        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
        utterance.voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Neural"))) || voices[0];
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const renderDomainSelection = () => {
    return (
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Choose Your Domain
          </h2>
          <p className="text-gray-300 text-xl">
            Select a subject area to begin your quiz journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(QUIZ_STRUCTURE).map(([key, domain]) => (
            <div
              key={key}
              onClick={() => handleDomainSelect(key)}
              className="group relative glass-card p-8 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                  {domain.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {domain.name}
                </h3>
                <p className="text-gray-400 mb-4">{domain.description}</p>
                <div className="flex items-center text-blue-400 font-semibold">
                  <span>Explore</span>
                  <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategorySelection = () => {
    const domain = QUIZ_STRUCTURE[selectedDomain];

    return (
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <button
          onClick={() => {
            setCurrentView("domains");
            setSelectedDomain(null);
            updateURL(null, null, null, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Domains</span>
        </button>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{domain.icon}</div>
          <h2 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {domain.name}
          </h2>
          <p className="text-gray-300 text-xl">Choose a category to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(domain.categories).map(([key, category]) => (
            <div
              key={key}
              onClick={() => handleCategorySelect(key)}
              className="group glass-card p-8 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {category.name}
                </h3>
                <p className="text-gray-400 mb-6">{category.description}</p>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    {Object.keys(category.subCategories).length} Collections
                  </Badge>
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSubCategorySelection = () => {
    const category = QUIZ_STRUCTURE[selectedDomain].categories[selectedCategory];
    return (
      <div className="w-full max-w-5xl mx-auto animate-fadeIn px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentView("categories");
              setSelectedCategory(null);
              updateURL(selectedDomain, null, null, null);
            }}
            className="flex items-center text-muted-foreground hover:text-persona-ink"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px]">{QUIZ_STRUCTURE[selectedDomain].name}</Badge>
            <Badge variant="outline" className="bg-persona-purple/5 text-persona-purple border-persona-purple/20">{category.name}</Badge>
          </div>
        </div>

        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-persona-ink mb-2">Specific Collections</h2>
          <p className="text-muted-foreground">Detailed sub-categories in {category.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(category.subCategories).map(([key, subCat]) => (
            <Card
              key={key}
              onClick={() => handleSubCategorySelect(key)}
              className="p-6 cursor-pointer border-2 border-muted hover:border-persona-purple hover:bg-muted/40 transition-all rounded-xl shadow-none hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-persona-ink mb-4">{subCat.name}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px] font-normal">{Object.keys(subCat.topics).length} Practice Topics</Badge>
                <ChevronRight className="w-4 h-4 text-persona-purple" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderTopicSelection = () => {
    const subCat = QUIZ_STRUCTURE[selectedDomain].categories[selectedCategory].subCategories[selectedSubCategory];
    return (
      <div className="w-full max-w-6xl mx-auto animate-fadeIn px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentView("subCategories");
              setSelectedSubCategory(null);
              updateURL(selectedDomain, selectedCategory, null, null);
            }}
            className="flex items-center text-muted-foreground hover:text-persona-ink"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sub-Categories
          </Button>
          <Badge variant="outline" className="bg-persona-purple/5 text-persona-purple border-persona-purple/20 px-3 py-1">
            {subCat.name}
          </Badge>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-persona-ink mb-2">Ready to Start?</h2>
          <p className="text-muted-foreground">Choose a topic to begin your evaluation session</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(subCat.topics).map(([key, topic]) => (
            <div
              key={key}
              onClick={() => handleTopicSelect(key)}
              className="flex items-center justify-between border-2 border-muted rounded-xl px-5 py-5 hover:bg-muted/40 hover:shadow-md transition-all duration-200 hover:border-ring cursor-pointer group bg-card"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-persona-purple/10 flex items-center justify-center text-persona-purple group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-persona-ink text-base">{topic.name}</h4>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full text-persona-purple group-hover:bg-persona-purple/10">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuizInterface = () => {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeIn px-4">
        <button
          onClick={() => {
            setCurrentView("topics");
            setFeedback("");
            setShowResult(false);
            updateURL(selectedDomain, selectedCategory, selectedSubCategory, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Topics</span>
        </button>

        {/* Timer */}
        <div className="flex justify-center mb-8">
          <div
            className={`glass-card px-8 py-4 rounded-3xl border ${timer <= 10 ? "border-red-400 animate-pulse" : "border-blue-400"
              }`}
          >
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${timer <= 10 ? "text-red-400" : "text-blue-300"
                  }`}
              >
                {timer}s
              </div>
              <div className="text-gray-400 text-sm mt-1">Time Remaining</div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card rounded-3xl p-8 mb-8 border border-purple-400/30 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-3xl font-bold text-white flex-1 leading-tight">
              {isLoading ? "Loading question..." : currentQuestion}
            </h3>
            <button
              onClick={speakQuestion}
              className="ml-4 p-3 rounded-xl bg-purple-600/20 border border-purple-400/50 hover:bg-purple-700/20 transition-colors"
              title="Read question aloud"
            >
              <Volume2 className="w-6 h-6 text-purple-300" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-400/50 text-red-300">
              {error}
            </div>
          )}

          {/* Voice Input */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isAnswering}
              className={cn(
                "p-6 rounded-full transition-all duration-300",
                isListening
                  ? "bg-red-600 animate-pulse scale-110 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                  : "bg-blue-600/20 border border-blue-400/50 hover:bg-blue-700/20",
                isAnswering && "opacity-50 cursor-not-allowed"
              )}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-blue-300" />
              )}
            </button>

            {isAnswering && (
              <div className="flex items-center gap-2 text-blue-300 font-bold animate-pulse">
                <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                Analyzing Answer...
              </div>
            )}
          </div>

          <div className="text-center text-gray-400 text-sm">
            {isListening
              ? "🎤 Listening... Speak your answer"
              : "Click the microphone to speak your answer"}
          </div>

          {/* Interim transcript while listening */}
          {isListening && transcript && (
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 italic text-blue-200 text-center text-sm">
              "{transcript}"
            </div>
          )}
        </div>

        {/* User Transcript Display */}
        {transcript && !isListening && (
          <div className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-blue-400 bg-blue-900/10">
            <h4 className="text-lg font-bold text-blue-300 mb-2">
              Your Answer:
            </h4>
            <p className="text-white text-lg leading-relaxed italic">"{transcript}"</p>
          </div>
        )}

        {/* AI Feedback */}
        {showResult && feedback && (
          <div
            className={cn(
              "glass-card rounded-3xl p-6 mb-6 border-l-4 transition-all duration-500",
              feedback.toLowerCase().includes("correct") || feedback.includes("✅")
                ? "border-green-400 bg-green-900/10"
                : "border-red-400 bg-red-900/10"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {feedback.toLowerCase().includes("correct") || feedback.includes("✅") ? (
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 mr-2" />
                )}
                <h4 className="text-xl font-bold text-white">AI Analysis</h4>
              </div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 font-bold bg-yellow-400/10">
                +{lastGainedScore} XP
              </Badge>
            </div>
            <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
              {feedback}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showResult && !showSessionEnd && (
          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={nextQuestion}
              className="px-8 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-900/20"
            >
              <Play className="w-5 h-5 mr-2" />
              Next Question
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentView("topics");
                setShowResult(false);
                setFeedback("");
                updateURL(selectedDomain, selectedCategory, selectedSubCategory, null);
              }}
              className="px-8 h-14 rounded-2xl border-white/20 hover:bg-white/10 text-white font-bold"
            >
              Exit Practice
            </Button>
          </div>
        )}

        {/* Session End Overlay (handled in main return but can also be here) */}
        {showSessionEnd && (
          <div className="glass-card rounded-3xl p-10 border border-yellow-400/40 shadow-2xl text-center mt-8 bg-linear-to-br from-yellow-900/30 to-purple-900/30">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-yellow-300 mb-2">Session Complete!</h3>
            <p className="text-xl text-white/80 mb-6">{SESSION_LENGTH} questions answered</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={downloadPDF} className="bg-persona-purple hover:bg-persona-purple/90">📄 PDF Report</Button>
              <Button onClick={downloadHistory} variant="outline">📥 Export History</Button>
              <Button onClick={startNewSession} className="bg-green-600 hover:bg-green-700 text-white">🔄 Restart</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
      <Header
        DateValue="practice"
        onDateChange={() => { }}
        tempDate={new Date().toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}
        showDateFilter={false}
      />

      {/* Breadcrumb Navigation - Refined */}
      {(selectedDomain || selectedCategory || selectedSubCategory || selectedTopic) && currentView !== "quiz" && (
        <div className="w-full max-w-6xl mx-auto px-4 py-4 pt-8">
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="cursor-pointer hover:text-persona-purple" onClick={resetToHome}>InQuizzo</span>
            <ChevronRight className="w-3 h-3" />
            {selectedDomain && (
              <>
                <span className={cn("cursor-pointer hover:text-persona-purple", !selectedCategory && "text-persona-purple")} onClick={() => { setCurrentView("categories"); setSelectedCategory(null); setSelectedSubCategory(null); setSelectedTopic(null); }}>{QUIZ_STRUCTURE[selectedDomain]?.name}</span>
                {selectedCategory && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className={cn("cursor-pointer hover:text-persona-purple", !selectedSubCategory && "text-persona-purple")} onClick={() => { setCurrentView("subCategories"); setSelectedSubCategory(null); setSelectedTopic(null); }}>{QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]?.name}</span>
                    {selectedSubCategory && (
                      <>
                        <ChevronRight className="w-3 h-3" />
                        <span className={cn("cursor-pointer hover:text-persona-purple", !selectedTopic && "text-persona-purple")} onClick={() => { setCurrentView("topics"); setSelectedTopic(null); }}>{QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]?.subCategories[selectedSubCategory]?.name}</span>
                        {selectedTopic && (
                          <>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-persona-purple">{QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]?.subCategories[selectedSubCategory]?.topics[selectedTopic]?.name}</span>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 py-8 grow justify-center">
        {currentView === "domains" && renderDomainSelection()}
        {currentView === "categories" && renderCategorySelection()}
        {currentView === "subCategories" && renderSubCategorySelection()}
        {currentView === "topics" && renderTopicSelection()}
        {currentView === "quiz" && renderQuizInterface()}

        {/* Speech Recognition Warning */}
        {currentView === "quiz" && !isBrowserSupported && (
          <div className="text-center mt-8">
            <div className="glass-card p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/10 max-w-md mx-auto">
              <p className="text-yellow-300 text-lg">
                ⚠️ Speech Recognition requires Chrome, Edge, or Safari
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── Difficulty Selector (Floating Sidebar Style) ── */}
      {currentView === "quiz" && (
        <Card className="fixed bottom-6 right-6 z-50 p-4 border border-border shadow-2xl rounded-2xl bg-card/95 backdrop-blur-md hidden md:block">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-persona-purple" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level</span>
            </div>
            {["easy", "medium", "hard"].map((level) => (
              <Button
                key={level}
                onClick={() => {
                  const prev = selectedDifficulty;
                  setSelectedDifficulty(level);
                  if (currentView === "quiz" && !isLoading && prev !== level) {
                    nextQuestion(level);
                  }
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
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase px-1">
              <span>Progress</span>
              <span className="text-persona-purple">{sessionQCount}/{SESSION_LENGTH}</span>
            </div>
            <Progress value={(sessionQCount / SESSION_LENGTH) * 100} className="h-1" />
          </div>
        </Card>
      )}

      {/* Global Transition Styles */}
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QuizDomainSelection;