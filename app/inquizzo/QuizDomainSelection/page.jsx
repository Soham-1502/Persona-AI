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
} from "lucide-react";

// Complete quiz structure matching your backend
const QUIZ_STRUCTURE = {
  science: {
    name: "Science",
    icon: "🧪",
    description: "Physics, Chemistry, Biology, Mathematics",
    gradient: "from-blue-500 to-purple-600",
    categories: {
      chemistry: {
        name: "Chemistry",
        icon: "🧬",
        description: "Study of chemical reactions and matter",
        topics: {
          inorganic: { name: "Inorganic Chemistry", questions: 45 },
          organic: { name: "Organic Chemistry", questions: 60 },
          physical: { name: "Physical Chemistry", questions: 40 },
          analytical: { name: "Analytical Chemistry", questions: 35 },
        },
      },
      physics: {
        name: "Physics",
        icon: "⚛️",
        description: "Study of matter, energy and motion",
        topics: {
          mechanics: { name: "Mechanics", questions: 50 },
          thermodynamics: { name: "Thermodynamics", questions: 40 },
          optics: { name: "Optics", questions: 35 },
          electromagnetism: { name: "Electromagnetism", questions: 55 },
          modernPhysics: { name: "Modern Physics", questions: 45 },
        },
      },
      biology: {
        name: "Biology",
        icon: "🧫",
        description: "Study of living organisms",
        topics: {
          cellBiology: { name: "Cell Biology", questions: 40 },
          genetics: { name: "Genetics", questions: 45 },
          ecology: { name: "Ecology", questions: 35 },
          evolution: { name: "Evolution", questions: 30 },
          anatomy: { name: "Human Anatomy", questions: 50 },
        },
      },
      mathematics: {
        name: "Mathematics",
        icon: "📐",
        description: "Study of numbers, patterns and logic",
        topics: {
          algebra: { name: "Algebra", questions: 60 },
          calculus: { name: "Calculus", questions: 55 },
          geometry: { name: "Geometry", questions: 45 },
          statistics: { name: "Statistics", questions: 40 },
          trigonometry: { name: "Trigonometry", questions: 35 },
        },
      },
    },
  },
  technology: {
    name: "Technology",
    icon: "💻",
    description: "Programming, AI, Web Development, Cybersecurity",
    gradient: "from-green-500 to-teal-600",
    categories: {
      programming: {
        name: "Programming",
        icon: "💻",
        description: "Software development and coding",
        topics: {
          javascript: { name: "JavaScript", questions: 70 },
          python: { name: "Python", questions: 65 },
          java: { name: "Java", questions: 60 },
          cPlusPlus: { name: "C++", questions: 55 },
          dataStructures: { name: "Data Structures", questions: 50 },
        },
      },
      webDevelopment: {
        name: "Web Development",
        icon: "🌐",
        description: "Frontend and backend development",
        topics: {
          react: { name: "React", questions: 45 },
          nodejs: { name: "Node.js", questions: 40 },
          html: { name: "HTML/CSS", questions: 50 },
          databases: { name: "Databases", questions: 35 },
          apis: { name: "APIs", questions: 30 },
        },
      },
      artificialIntelligence: {
        name: "Artificial Intelligence",
        icon: "🤖",
        description: "Machine learning and AI concepts",
        topics: {
          machineLearning: { name: "Machine Learning", questions: 40 },
          deepLearning: { name: "Deep Learning", questions: 35 },
          nlp: { name: "Natural Language Processing", questions: 30 },
          computerVision: { name: "Computer Vision", questions: 25 },
        },
      },
    },
  },
  humanities: {
    name: "Humanities",
    icon: "📚",
    description: "History, Literature, Philosophy, Languages",
    gradient: "from-orange-500 to-red-600",
    categories: {
      history: {
        name: "History",
        icon: "🏛️",
        description: "Study of past events and civilizations",
        topics: {
          worldHistory: { name: "World History", questions: 60 },
          ancientCivilizations: {
            name: "Ancient Civilizations",
            questions: 45,
          },
          modernHistory: { name: "Modern History", questions: 50 },
          warHistory: { name: "War History", questions: 40 },
        },
      },
      literature: {
        name: "Literature",
        icon: "📖",
        description: "Study of written works and texts",
        topics: {
          classicLiterature: { name: "Classic Literature", questions: 50 },
          poetry: { name: "Poetry", questions: 40 },
          modernLiterature: { name: "Modern Literature", questions: 45 },
          shakespeare: { name: "Shakespeare", questions: 35 },
        },
      },
    },
  },
};

const QuizDomainSelection = () => {
  const [currentView, setCurrentView] = useState("domains"); // domains, categories, topics, quiz
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const recognitionRef = useRef(null);
  const currentQuestionRef = useRef({ question: "", answer: "" });

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  // Update URL when selections change
  const updateURL = (domain, category, topic) => {
    const pathParts = ["inquizzo", "Quiz"];

    if (domain) pathParts.push(encodeURIComponent(domain));
    if (category) pathParts.push(encodeURIComponent(category));
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
      const topic = parts[3] ? decodeURIComponent(parts[3]) : null;

      console.log("📍 Parsed:", { domain, category, topic });

      if (QUIZ_STRUCTURE[domain]) {
        setSelectedDomain(domain);

        if (category && QUIZ_STRUCTURE[domain].categories[category]) {
          setSelectedCategory(category);
          setCurrentView("topics");

          if (
            topic &&
            QUIZ_STRUCTURE[domain].categories[category].topics[topic]
          ) {
            setSelectedTopic(topic);
            setCurrentView("quiz");
            fetchQuestion(domain, category, topic);
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
    
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (currentView === "quiz" && timer > 0 && !showResult) {
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
  }, [currentView, timer, showResult]);

  const initializeSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started");
        setIsListening(true);
        setError("");
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        console.log("🗣️ Transcribed:", spokenText);
        setTranscript(spokenText);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("🎤 Speech recognition ended");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn(
        "⚠️ Speech Recognition not supported in this browser. Use Chrome, Edge, or Safari."
      );
      setError(
        "Speech Recognition not supported. Please use Chrome, Edge, or Safari."
      );
    }
  };

  const resetToHome = () => {
    setCurrentView("domains");
    setSelectedDomain(null);
    setSelectedCategory(null);
    setSelectedTopic(null);
    setScore(0);
    setQuestionsAnswered(0);
    setCurrentQuestion("");
    setTranscript("");
    setFeedback("");
    setShowResult(false);
    setTimer(30);
    updateURL(null, null, null);
  };

  const handleDomainSelect = (domainKey) => {
    console.log("🌟 Domain selected:", domainKey);
    setSelectedDomain(domainKey);
    setCurrentView("categories");
    updateURL(domainKey, null, null);
  };

  const handleCategorySelect = (categoryKey) => {
    console.log("📚 Category selected:", categoryKey);
    setSelectedCategory(categoryKey);
    setCurrentView("topics");
    updateURL(selectedDomain, categoryKey, null);
  };

  const handleTopicSelect = async (topicKey) => {
    console.log("📖 Topic selected:", topicKey);
    setSelectedTopic(topicKey);
    setCurrentView("quiz");
    updateURL(selectedDomain, selectedCategory, topicKey);

    await fetchQuestion(selectedDomain, selectedCategory, topicKey);
  };

  const fetchQuestion = async (domain, category, topic) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await makeAuthenticatedRequest(
        `http://localhost:5000/api/quiz/get-question?domain=${domain}&category=${category}&topic=${topic}`
      );

      console.log("✅ Question fetched:", data);

      if (data.question && data.answer) {
        setCurrentQuestion(data.question);
        setCorrectAnswer(data.answer);
        currentQuestionRef.current = { question: data.question, answer: data.answer };
        setTimer(30);
        setTranscript("");
        setFeedback("");
        setShowResult(false);
      }
    } catch (error) {
      console.error("❌ Error fetching question:", error);
      setError("Failed to load question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setError("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }

    setIsAnswering(true);

    try {
      const data = await makeAuthenticatedRequest(
        "http://localhost:5000/api/quiz/check-answer",
        {
          method: "POST",
          body: JSON.stringify({
            question: currentQuestionRef.current.question,
            correctAnswer: currentQuestionRef.current.answer,
            userAnswer: transcript,
          }),
        }
      );

      console.log("✅ Answer checked:", data);

      setFeedback(data.feedback);
      setShowResult(true);
      setQuestionsAnswered((prev) => prev + 1);

      if (data.isCorrect) {
        setScore((prev) => prev + 10);
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
    await submitAnswer();
  };

  const nextQuestion = () => {
    fetchQuestion(selectedDomain, selectedCategory, selectedTopic);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderDomainSelection = () => {
    return (
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
            updateURL(null, null, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Domains</span>
        </button>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{domain.icon}</div>
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {domain.name}
          </h2>
          <p className="text-gray-300 text-xl">Choose a category to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(domain.categories).map(([key, category]) => (
            <div
              key={key}
              onClick={() => handleCategorySelect(key)}
              className="group glass-card p-8 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30"
            >
              <div className="flex items-start space-x-4">
                <div className="text-5xl transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-400 font-semibold">
                    <span>
                      {Object.keys(category.topics).length} Topics Available
                    </span>
                    <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTopicSelection = () => {
    const category =
      QUIZ_STRUCTURE[selectedDomain].categories[selectedCategory];

    return (
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <button
          onClick={() => {
            setCurrentView("categories");
            setSelectedCategory(null);
            updateURL(selectedDomain, null, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Categories</span>
        </button>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {category.name}
          </h2>
          <p className="text-gray-300 text-xl">Select a topic to start the quiz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(category.topics).map(([key, topic]) => (
            <div
              key={key}
              onClick={() => handleTopicSelect(key)}
              className="group glass-card p-6 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30"
            >
              <h3 className="text-xl font-bold mb-2 text-white">
                {topic.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {topic.questions} questions available
              </p>
              <div className="flex items-center text-green-400 font-semibold">
                <Play className="w-5 h-5 mr-2" />
                <span>Start Quiz</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuizInterface = () => {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeIn">
        <button
          onClick={() => {
            setCurrentView("topics");
            setSelectedTopic(null);
            updateURL(selectedDomain, selectedCategory, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Topics</span>
        </button>

        {/* Timer */}
        <div className="flex justify-center mb-8">
          <div
            className={`glass-card px-8 py-4 rounded-3xl border ${
              timer <= 10 ? "border-red-400 animate-pulse" : "border-blue-400"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${
                  timer <= 10 ? "text-red-400" : "text-blue-300"
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
            <h3 className="text-3xl font-bold text-white flex-1">
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
              disabled={showResult || isAnswering}
              className={`p-6 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-red-600 animate-glow scale-110"
                  : "bg-blue-600/20 border border-blue-400/50 hover:bg-blue-700/20"
              } ${
                (showResult || isAnswering) && "opacity-50 cursor-not-allowed"
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-blue-300" />
              )}
            </button>

            <button
              onClick={submitAnswer}
              disabled={
                !transcript || showResult || isAnswering || isListening
              }
              className="px-8 py-4 rounded-2xl bg-green-600/20 border border-green-400/50 hover:bg-green-700/20 text-green-300 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnswering ? (
                <>
                  <div className="w-5 h-5 border-2 border-green-300 border-t-transparent rounded-full animate-spin"></div>
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Answer
                </>
              )}
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm">
            {isListening
              ? "🎤 Listening... Speak your answer"
              : "Click the microphone to speak your answer"}
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-blue-400">
            <h4 className="text-lg font-bold text-blue-300 mb-2">
              Your Answer:
            </h4>
            <p className="text-white text-lg">"{transcript}"</p>
          </div>
        )}

        {showResult && feedback && (
          <div
            className={`glass-card rounded-3xl p-6 mb-6 border-l-4 ${
              feedback.toLowerCase().includes("correct")
                ? "border-green-400"
                : "border-red-400"
            }`}
          >
            <div className="flex items-center mb-2">
              {feedback.toLowerCase().includes("correct") ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
              )}
              <h4 className="text-lg font-bold text-white">AI Feedback:</h4>
            </div>
            <p
              className={`text-lg ${
                feedback.toLowerCase().includes("correct")
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {feedback}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showResult && (
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={nextQuestion}
              className="px-8 py-4 rounded-2xl bg-green-600/20 border border-green-400/50 hover:bg-green-700/20 text-green-300 font-bold transition-colors flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Next Question
            </button>
            <button
              onClick={resetToHome}
              className="px-8 py-4 rounded-2xl bg-purple-600/20 border border-purple-400/50 hover:bg-purple-700/20 text-purple-300 font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Change Topic
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-blue-950 to-slate-900 text-white font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[120vw] h-[120vw] bg-gradient-radial from-indigo-700/30 via-blue-600/10 to-transparent blur-3xl -top-1/2 -left-1/2 animate-spin-slow"></div>
        <div className="absolute w-[100vw] h-[110vw] bg-gradient-radial from-pink-500/10 via-blue-800/20 to-transparent blur-2xl -bottom-1/3 -right-1/3 opacity-90"></div>
      </div>

      {/* Floating Particles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 animate-twinkle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="glass-card px-5 py-2 rounded-2xl flex items-center space-x-2 shadow-md border border-yellow-300/20">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-300">{score}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-2xl border border-white/20 text-gray-200 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            <span>Q: {questionsAnswered}</span>
          </div>
        </div>

        <div
          className="group cursor-pointer hover:scale-110 transition-all duration-500"
          onClick={resetToHome}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-white bg-clip-text text-transparent drop-shadow-2xl tracking-tight uppercase">
            InQuizo
          </h1>
          <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-200 to-blue-500 transition-all duration-500 rounded-full mt-1"></div>
        </div>

        {/* Breadcrumb Navigation */}
        {(selectedDomain || selectedCategory || selectedTopic) && (
          <div className="glass-card px-4 py-2 rounded-2xl border border-white/20 text-gray-200 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="truncate max-w-[200px]">
                {[
                  selectedDomain && QUIZ_STRUCTURE[selectedDomain]?.name,
                  selectedCategory &&
                    QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]
                      ?.name,
                  selectedTopic &&
                    QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]
                      ?.topics[selectedTopic]?.name,
                ]
                  .filter(Boolean)
                  .join(" → ")}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 py-8 grow justify-center">
        {currentView === "domains" && renderDomainSelection()}
        {currentView === "categories" && renderCategorySelection()}
        {currentView === "topics" && renderTopicSelection()}
        {currentView === "quiz" && renderQuizInterface()}

        {/* Speech Recognition Warning */}
        {currentView === "quiz" && !recognitionRef.current && (
          <div className="text-center mt-8">
            <div className="glass-card p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/10 max-w-md mx-auto">
              <p className="text-yellow-300 text-lg">
                ⚠️ Speech Recognition requires Chrome, Edge, or Safari
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8),
              0 0 60px rgba(59, 130, 246, 0.6);
          }
        }
        .animate-glow {
          animation: glow 2s infinite;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .glass-card {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .glass-card {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizDomainSelection;