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
      physics: {
        name: "Physics",
        icon: "⚛️",
        description: "Study of matter, energy and motion",
        subCategories: {
          mechanics: {
            name: "Mechanics",
            topics: {
              "laws-of-motion": { name: "Laws of Motion" },
              "work-energy-power": { name: "Work, Energy & Power" },
              "momentum-collisions": { name: "Momentum & Collisions" },
              "circular-motion": { name: "Circular Motion" },
              "rotational-mechanics": { name: "Rotational Mechanics" },
              "gravitation": { name: "Gravitation" },
              "oscillations": { name: "Oscillations" },
            },
          },
          thermodynamics: {
            name: "Thermodynamics",
            topics: {
              "temp-heat": { name: "Temperature & Heat" },
              "laws-thermo": { name: "Laws of Thermodynamics" },
              "heat-engines": { name: "Heat Engines" },
              "entropy": { name: "Entropy" },
              "thermal-properties": { name: "Thermal Properties of Matter" },
              "kinetic-theory": { name: "Kinetic Theory of Gases" },
            },
          },
        },
      },
      chemistry: {
        name: "Chemistry",
        icon: "🧬",
        description: "Study of chemical reactions and matter",
        subCategories: {
          "organic-chemistry": {
            name: "Organic Chemistry",
            topics: {
              hydrocarbons: { name: "Hydrocarbons" },
              "alcohols-phenols": { name: "Alcohols & Phenols" },
              "aldehydes-ketones": { name: "Aldehydes & Ketones" },
              "carboxylic-acids": { name: "Carboxylic Acids" },
              polymers: { name: "Polymers" },
              biomolecules: { name: "Biomolecules" },
              "reaction-mechanisms": { name: "Reaction Mechanisms" },
              stereochemistry: { name: "Stereochemistry" },
            },
          },
          "inorganic-chemistry": {
            name: "Inorganic Chemistry",
            topics: {
              "periodic-trends": { name: "Periodic Table Trends" },
              "chemical-bonding": { name: "Chemical Bonding" },
              "coordination-compounds": { name: "Coordination Compounds" },
              "transition-elements": { name: "Transition Elements" },
              metallurgy: { name: "Metallurgy" },
              "block-elements": { name: "s, p, d & f Block Elements" },
            },
          },
          "physical-chemistry": {
            name: "Physical Chemistry",
            topics: {
              "atomic-structure": { name: "Atomic Structure" },
              "chemical-kinetics": { name: "Chemical Kinetics" },
              thermochemistry: { name: "Thermochemistry" },
              electrochemistry: { name: "Electrochemistry" },
              solutions: { name: "Solutions" },
              "surface-chemistry": { name: "Surface Chemistry" },
            },
          },
        },
      },
    },
  },
  programming: {
    name: "Programming & CS",
    icon: "💻",
    description: "Fundamentals, Web Dev, OOP, and more",
    gradient: "from-green-500 to-teal-600",
    categories: {
      fundamentals: {
        name: "Programming Fundamentals",
        icon: "⌨️",
        description: "Core coding concepts and logic",
        subCategories: {
          "core-concepts": {
            name: "Core Concepts",
            topics: {
              "variables-datatypes": { name: "Variables & Data Types" },
              operators: { name: "Operators" },
              conditionals: { name: "Conditional Statements" },
              loops: { name: "Loops" },
              functions: { name: "Functions" },
              scope: { name: "Scope" },
              debugging: { name: "Debugging" },
            },
          },
          oop: {
            name: "Object-Oriented Programming",
            topics: {
              "classes-objects": { name: "Classes & Objects" },
              inheritance: { name: "Inheritance" },
              polymorphism: { name: "Polymorphism" },
              encapsulation: { name: "Encapsulation" },
              abstraction: { name: "Abstraction" },
              interfaces: { name: "Interfaces" },
              "exception-handling": { name: "Exception Handling" },
            },
          },
        },
      },
      "web-dev": {
        name: "Web Development",
        icon: "🌐",
        description: "Frontend and Backend systems",
        subCategories: {
          frontend: {
            name: "Frontend Development",
            topics: {
              "html-basics": { name: "HTML Basics" },
              "css-styling": { name: "CSS Styling" },
              "responsive-design": { name: "Responsive Design" },
              "js-basics": { name: "JavaScript Basics" },
              "dom-manipulation": { name: "DOM Manipulation" },
              "browser-events": { name: "Browser Events" },
              accessibility: { name: "Accessibility" },
            },
          },
          backend: {
            name: "Backend Development",
            topics: {
              "server-basics": { name: "Server Basics" },
              "rest-apis": { name: "REST APIs" },
              authentication: { name: "Authentication" },
              databases: { name: "Databases" },
              middleware: { name: "Middleware" },
              "error-handling": { name: "Error Handling" },
            },
          },
        },
      },
    },
  },
  mathematics: {
    name: "Mathematics",
    icon: "📐",
    description: "Algebra, Calculus, Geometry",
    gradient: "from-purple-500 to-pink-600",
    categories: {
      algebra: {
        name: "Algebra",
        icon: "🔢",
        description: "Equations, Matrices, Polynomials",
        subCategories: {
          "core-algebra": {
            name: "Core Algebra",
            topics: {
              "linear-equations": { name: "Linear Equations" },
              "quadratic-equations": { name: "Quadratic Equations" },
              polynomials: { name: "Polynomials" },
              inequalities: { name: "Inequalities" },
              functions: { name: "Functions" },
              matrices: { name: "Matrices" },
              determinants: { name: "Determinants" },
              "complex-numbers": { name: "Complex Numbers" },
            },
          },
        },
      },
      calculus: {
        name: "Calculus",
        icon: "📈",
        description: "Differentiation, Integration, Limits",
        subCategories: {
          "diff-int": {
            name: "Differentiation & Integration",
            topics: {
              limits: { name: "Limits" },
              continuity: { name: "Continuity" },
              differentiation: { name: "Differentiation" },
              "app-derivatives": { name: "Applications of Derivatives" },
              integration: { name: "Integration" },
              "def-integrals": { name: "Definite Integrals" },
              "diff-equations": { name: "Differential Equations" },
            },
          },
        },
      },
    },
  },
  history: {
    name: "History",
    icon: "📜",
    description: "Ancient, Medieval, and Modern World History",
    gradient: "from-amber-600 to-orange-700",
    categories: {
      periods: {
        name: "Historical Periods",
        icon: "🏛️",
        description: "Explore different eras of human history",
        subCategories: {
          ancient: {
            name: "Ancient Civilizations",
            topics: {
              "indus-valley": { name: "Indus Valley Civilization" },
              "egyptian-civ": { name: "Ancient Egypt" },
              "mesopotamia": { name: "Mesopotamia" },
              "greek-roman": { name: "Greek & Roman Empire" },
            },
          },
          medieval: {
            name: "Medieval Period",
            topics: {
              "crusades": { name: "The Crusades" },
              "feudalism": { name: "Feudalism in Europe" },
              "silk-road": { name: "The Silk Road" },
              "mughal-empire": { name: "The Mughal Empire" },
            },
          },
          modern: {
            name: "Modern History",
            topics: {
              "renaissance": { name: "The Renaissance" },
              "industrial-rev": { name: "Industrial Revolution" },
              "world-war-1": { name: "World War I" },
              "world-war-2": { name: "World War II" },
              "cold-war": { name: "The Cold War" },
            },
          },
        },
      },
    },
  },
  humanities: {
    name: "Humanities",
    icon: "📚",
    description: "History, Geography, Literature",
    gradient: "from-orange-500 to-amber-600",
    categories: {
      history: {
        name: "History",
        icon: "🏛️",
        description: "Ancient to Modern History",
        subCategories: {
          periods: {
            name: "Historical Periods",
            topics: {
              "ancient-civilizations": { name: "Ancient Civilizations" },
              medieval: { name: "Medieval Period" },
              modern: { name: "Modern History" },
              "freedom-struggle": { name: "Indian Freedom Struggle" },
              "world-wars": { name: "World Wars" },
              revolutions: { name: "Revolutions" },
              "cultural-history": { name: "Cultural History" },
            },
          },
        },
      },
      geography: {
        name: "Geography",
        icon: "🌍",
        description: "Earth, Climate, Resources",
        subCategories: {
          "earth-systems": {
            name: "Earth Systems",
            topics: {
              "earth-structure": { name: "Earth Structure" },
              landforms: { name: "Landforms" },
              climate: { name: "Climate Systems" },
              resources: { name: "Natural Resources" },
              population: { name: "Population Studies" },
              environmental: { name: "Environmental Geography" },
            },
          },
        },
      },
    },
  },
  business: {
    name: "Business & Management",
    icon: "💼",
    description: "Principles, Marketing, Sales",
    gradient: "from-emerald-500 to-cyan-slow",
    categories: {
      management: {
        name: "Management",
        icon: "📈",
        description: "Leadership, Planning, Organizing",
        subCategories: {
          principles: {
            name: "Management Principles",
            topics: {
              "m-principles": { name: "Principles of Management" },
              planning: { name: "Planning" },
              organizing: { name: "Organizing" },
              staffing: { name: "Staffing" },
              leadership: { name: "Leadership" },
              motivation: { name: "Motivation" },
              controlling: { name: "Controlling" },
            },
          },
        },
      },
      marketing: {
        name: "Marketing",
        icon: "📣",
        description: "Market Research, Digital Marketing",
        subCategories: {
          concepts: {
            name: "Marketing Concepts",
            topics: {
              "market-concepts": { name: "Marketing Concepts" },
              "market-research": { name: "Market Research" },
              "consumer-behavior": { name: "Consumer Behavior" },
              "digital-marketing": { name: "Digital Marketing" },
              branding: { name: "Branding" },
              advertising: { name: "Advertising" },
              sales: { name: "Sales Management" },
            },
          },
        },
      },
    },
  },
  "personal-dev": {
    name: "Personal Development",
    icon: "👤",
    description: "Communication, EQ, Soft Skills",
    gradient: "from-rose-500 to-pink-600",
    categories: {
      communication: {
        name: "Communication Skills",
        icon: "🗣️",
        description: "Verbal, Non-verbal, Public Speaking",
        subCategories: {
          skills: {
            name: "Core Skills",
            topics: {
              "verbal-comm": { name: "Verbal Communication" },
              "non-verbal": { name: "Non-Verbal Communication" },
              "public-speaking": { name: "Public Speaking" },
              presentation: { name: "Presentation Skills" },
              listening: { name: "Active Listening" },
              assertiveness: { name: "Assertiveness" },
              "body-language": { name: "Body Language" },
            },
          },
        },
      },
      eq: {
        name: "Emotional Intelligence",
        icon: "🧠",
        description: "Self-awareness, Empathy, Social Skills",
        subCategories: {
          concepts: {
            name: "EQ Concepts",
            topics: {
              "self-awareness": { name: "Self-Awareness" },
              "self-control": { name: "Self-Control" },
              motivation: { name: "Motivation" },
              empathy: { name: "Empathy" },
              "social-skills": { name: "Social Skills" },
              "stress-management": { name: "Stress Management" },
            },
          },
        },
      },
    },
  },
  psychology: {
    name: "Psychology",
    icon: "🧘",
    description: "Cognitive, Social, Behavior",
    gradient: "from-yellow-500 to-orange-600",
    categories: {
      cognitive: {
        name: "Cognitive Psychology",
        icon: "🧠",
        description: "Memory, Learning, Perception",
        subCategories: {
          "core-concepts": {
            name: "Core Concepts",
            topics: {
              memory: { name: "Memory" },
              learning: { name: "Learning" },
              perception: { name: "Perception" },
              intelligence: { name: "Intelligence" },
              thinking: { name: "Thinking" },
              "problem-solving": { name: "Problem Solving" },
              "decision-making": { name: "Decision Making" },
            },
          },
        },
      },
      social: {
        name: "Social Psychology",
        icon: "👥",
        description: "Attitudes, Group Behavior",
        subCategories: {
          "core-concepts": {
            name: "Core Concepts",
            topics: {
              attitudes: { name: "Attitudes" },
              influence: { name: "Social Influence" },
              groups: { name: "Group Behavior" },
              leadership: { name: "Leadership" },
              relations: { name: "Interpersonal Relations" },
              prejudice: { name: "Prejudice" },
            },
          },
        },
      },
    },
  },
  technology: {
    name: "Tech Trends",
    icon: "🚀",
    description: "AI, Cyber Security, Blockchain",
    gradient: "from-indigo-500 to-blue-600",
    categories: {
      ai: {
        name: "Artificial Intelligence",
        icon: "🤖",
        description: "ML, Neural Networks, NLP",
        subCategories: {
          "ai-ml": {
            name: "AI & ML",
            topics: {
              "ai-basics": { name: "AI Basics" },
              "machine-learning": { name: "Machine Learning" },
              supervised: { name: "Supervised Learning" },
              unsupervised: { name: "Unsupervised Learning" },
              "neural-networks": { name: "Neural Networks" },
              nlp: { name: "Natural Language Processing" },
              "computer-vision": { name: "Computer Vision" },
              "ai-ethics": { name: "AI Ethics" },
            },
          },
        },
      },
      cybersecurity: {
        name: "Cyber Security",
        icon: "🛡️",
        description: "Protection and Defense",
        subCategories: {
          basics: {
            name: "Security Basics",
            topics: {
              attacks: { name: "Types of Cyber Attacks" },
              malware: { name: "Malware" },
              cryptography: { name: "Cryptography Basics" },
              network: { name: "Network Security" },
              web: { name: "Web Security" },
              "ethical-hacking": { name: "Ethical Hacking" },
              laws: { name: "Cyber Laws" },
            },
          },
        },
      },
    },
  },
  arts: {
    name: "Arts & Creativity",
    icon: "🎨",
    description: "Writing, Visual Arts, Design",
    gradient: "from-pink-500 to-rose-600",
    categories: {
      writing: {
        name: "Creative Writing",
        icon: "✍️",
        description: "Story, Plot, Poetry",
        subCategories: {
          skills: {
            name: "Writing Skills",
            topics: {
              structure: { name: "Story Structure" },
              characters: { name: "Character Development" },
              plot: { name: "Plot Building" },
              dialogue: { name: "Dialogue Writing" },
              poetry: { name: "Poetry" },
              screenwriting: { name: "Screenwriting" },
              editing: { name: "Editing & Proofreading" },
            },
          },
        },
      },
      visual: {
        name: "Visual Arts",
        icon: "🖼️",
        description: "Drawing, Color Theory, Design",
        subCategories: {
          basics: {
            name: "Art Basics",
            topics: {
              drawing: { name: "Drawing Basics" },
              "color-theory": { name: "Color Theory" },
              composition: { name: "Composition" },
              perspective: { name: "Perspective" },
              digital: { name: "Digital Art" },
              graphic: { name: "Graphic Design" },
            },
          },
        },
      },
    },
  },
  games: {
    name: "Games & Sports",
    icon: "🎮",
    description: "Indoor, Outdoor, E-sports",
    gradient: "from-violet-500 to-indigo-600",
    categories: {
      indoor: {
        name: "Indoor Games",
        icon: "🏠",
        description: "Chess, Carrom, Board games",
        subCategories: {
          mental: {
            name: "Mental Sports",
            topics: {
              chess: { name: "Chess" },
              carrom: { name: "Carrom" },
              sudoku: { name: "Sudoku" },
              crossword: { name: "Crossword" },
            },
          },
        },
      },
      outdoor: {
        name: "Outdoor Games",
        icon: "⚽",
        description: "Cricket, Football, Athletics",
        subCategories: {
          ball: {
            name: "Ball Games",
            topics: {
              cricket: { name: "Cricket" },
              football: { name: "Football" },
              basketball: { name: "Basketball" },
              tennis: { name: "Tennis" },
            },
          },
        },
      },
    },
  },
};

const QuizDomainSelection = () => {
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
                <p className="text-gray-400 mb-4">{category.description}</p>
                <div className="flex items-center text-blue-400 font-semibold">
                  <span>
                    {Object.keys(category.subCategories).length} Collections
                  </span>
                  <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
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
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <button
          onClick={() => {
            setCurrentView("categories");
            setSelectedCategory(null);
            updateURL(selectedDomain, null, null, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Categories</span>
        </button>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h2 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {category.name}
          </h2>
          <p className="text-gray-300 text-xl">Select a sub-category context</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(category.subCategories).map(([key, subCat]) => (
            <div
              key={key}
              onClick={() => handleSubCategorySelect(key)}
              className="group glass-card p-8 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30"
            >
              <h3 className="text-2xl font-bold mb-4 text-white text-center">
                {subCat.name}
              </h3>
              <div className="flex items-center justify-center text-blue-400 font-semibold">
                <span>{Object.keys(subCat.topics).length} Topics</span>
                <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTopicSelection = () => {
    const subCat =
      QUIZ_STRUCTURE[selectedDomain].categories[selectedCategory].subCategories[
      selectedSubCategory
      ];

    return (
      <div className="w-full max-w-6xl mx-auto animate-fadeIn">
        <button
          onClick={() => {
            setCurrentView("subCategories");
            setSelectedSubCategory(null);
            updateURL(selectedDomain, selectedCategory, null, null);
          }}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform" />
          <span className="text-lg">Back to Sub-Categories</span>
        </button>

        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {subCat.name}
          </h2>
          <p className="text-gray-300 text-xl">Finally, pick your specific topic</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(subCat.topics).map(([key, topic]) => (
            <div
              key={key}
              onClick={() => handleTopicSelect(key)}
              className="group glass-card p-6 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30"
            >
              <h3 className="text-xl font-bold mb-2 text-white">
                {topic.name}
              </h3>
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
              disabled={isAnswering}
              className={`p-6 rounded-full transition-all duration-300 ${isListening
                ? "bg-red-600 animate-glow scale-110"
                : "bg-blue-600/20 border border-blue-400/50 hover:bg-blue-700/20"
                } ${isAnswering && "opacity-50 cursor-not-allowed"
                }`}
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

          {/* Interim transcript while listening */}
          {isListening && transcript && (
            <p className="text-center text-blue-300 italic text-sm mb-2">"{transcript}"</p>
          )}

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
            className={`glass-card rounded-3xl p-6 mb-6 border-l-4 ${feedback.toLowerCase().includes("correct") || feedback.includes("✅")
              ? "border-green-400"
              : "border-red-400"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {feedback.toLowerCase().includes("correct") || feedback.includes("✅") ? (
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 mr-2" />
                )}
                <h4 className="text-xl font-bold text-white">AI Evaluation</h4>
              </div>
              <div className="glass-card px-3 py-1 rounded-xl border border-yellow-400/30 text-yellow-300 font-bold">
                +{lastGainedScore} Points
              </div>
            </div>
            <p className="text-white text-lg leading-relaxed mb-4">
              {feedback}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showResult && !showSessionEnd && (
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

        {/* Session End Screen */}
        {showSessionEnd && (
          <div className="glass-card rounded-3xl p-10 border border-yellow-400/40 shadow-2xl text-center mt-8 bg-gradient-to-br from-yellow-900/30 to-purple-900/30">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-yellow-300 mb-2">Session Complete!</h3>
            <p className="text-xl text-white/80 mb-1">{SESSION_LENGTH} questions answered</p>
            <p className="text-4xl font-extrabold text-white mb-6">Session Score: {sessionScore}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={downloadPDF}
                className="px-8 py-3 rounded-xl text-white font-semibold border border-red-400/40 bg-red-600/20 hover:bg-red-700/30 transition-colors shadow-md"
                type="button"
              >
                📄 Download PDF
              </button>
              <button
                onClick={downloadHistory}
                className="px-8 py-3 rounded-xl text-white font-semibold border border-blue-400/40 bg-blue-600/20 hover:bg-blue-700/30 transition-colors shadow-md"
                type="button"
              >
                📥 Download Text
              </button>
              <button
                onClick={startNewSession}
                className="px-8 py-4 rounded-xl text-white font-bold border border-purple-400/40 bg-purple-600/20 hover:bg-purple-700/30 transition-colors shadow-md"
                type="button"
              >
                🔄 New Session
              </button>
              <button
                onClick={resetToHome}
                className="px-8 py-4 rounded-xl text-white font-bold border border-gray-400/40 bg-gray-600/20 hover:bg-gray-700/30 transition-colors shadow-md"
                type="button"
              >
                🏠 Change Topic
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-linear-to-br from-gray-950 via-blue-950 to-slate-900 text-white font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[120vw] h-[120vw] bg-gradient-radial from-indigo-700/30 via-blue-600/10 to-transparent blur-3xl -top-1/2 -left-1/2 animate-spin-slow"></div>
        <div className="absolute w-screen h-[110vw] bg-gradient-radial from-pink-500/10 via-blue-800/20 to-transparent blur-2xl -bottom-1/3 -right-1/3 opacity-90"></div>
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
          <div className="h-1 w-0 group-hover:w-full bg-linear-to-r from-yellow-200 to-blue-500 transition-all duration-500 rounded-full mt-1"></div>
        </div>

        {/* Breadcrumb Navigation */}
        {(selectedDomain || selectedCategory || selectedSubCategory || selectedTopic) && (
          <div className="glass-card px-4 py-2 rounded-2xl border border-white/20 text-gray-200 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="truncate max-w-64">
                {[
                  selectedDomain && QUIZ_STRUCTURE[selectedDomain]?.name,
                  selectedCategory &&
                  QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]
                    ?.name,
                  selectedSubCategory &&
                  QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]
                    ?.subCategories[selectedSubCategory]?.name,
                  selectedTopic &&
                  QUIZ_STRUCTURE[selectedDomain]?.categories[selectedCategory]
                    ?.subCategories[selectedSubCategory]?.topics[selectedTopic]?.name,
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

      {/* ── Difficulty Selector (floating bottom-right) ── */}
      {currentView === "quiz" && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
          <p className="text-white/60 text-xs font-semibold mb-1 uppercase tracking-widest">Difficulty</p>
          {["easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              onClick={() => {
                const prev = selectedDifficulty;
                setSelectedDifficulty(level);
                // If the user changes it mid-quiz, refresh immediately to show a question at the new level
                if (currentView === "quiz" && !isLoading && prev !== level) {
                  nextQuestion(level);
                }
              }}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase transition-all duration-200 border shadow-lg
                ${selectedDifficulty === level
                  ? level === "easy"
                    ? "bg-green-500 border-green-300 text-white scale-105"
                    : level === "medium"
                      ? "bg-yellow-500 border-yellow-300 text-white scale-105"
                      : "bg-red-500 border-red-300 text-white scale-105"
                  : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
                }`}
            >
              {level === "easy" ? "🟢" : level === "medium" ? "🟡" : "🔴"} {level}
            </button>
          ))}
          {/* Session progress */}
          <div className="mt-2 text-center text-white/50 text-xs">
            Session: {sessionQCount}/{SESSION_LENGTH}
          </div>
        </div>
      )}

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