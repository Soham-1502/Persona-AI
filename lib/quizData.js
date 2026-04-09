export const QUIZ_STRUCTURE = {
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
                    "indian-history": {
                        name: "Indian History",
                        topics: {
                            "ch.shivaji-maharaj": { name: "Chhatrapati Shivaji Maharaj history" },
                            "maharana-pratap": { name: "maharana pratap history" },
                            "indus-valley": { name: "Indus Valley Civilization" },
                            "mauryan-empire": { name: "Mauryan Empire" },
                            "gupta-empire": { name: "Gupta Empire" },
                            "mughal-empire": { name: "Mughal Empire" },
                            "colonial-era": { name: "Colonial Era" },
                            "vedic-period": { name: "Vedic Period" },
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

    // ─────────────────────────────────────────────
    // 1. JEE PREPARATION
    // ─────────────────────────────────────────────
    jee: {
        name: "JEE Preparation",
        icon: "🎯",
        description: "JEE Main & Advanced — Physics, Chemistry, Math",
        gradient: "from-blue-600 to-indigo-700",
        categories: {
            "jee-physics": {
                name: "JEE Physics",
                icon: "⚛️",
                description: "High-weightage topics for JEE",
                subCategories: {
                    "electrostatics-em": {
                        name: "Electrostatics & Electromagnetism",
                        topics: {
                            "coulombs-law": { name: "Coulomb's Law" },
                            "electric-field": { name: "Electric Field & Potential" },
                            "gauss-law": { name: "Gauss's Law" },
                            capacitors: { name: "Capacitors & Dielectrics" },
                            "current-electricity": { name: "Current Electricity" },
                            "magnetic-effects": { name: "Magnetic Effects of Current" },
                            "electromagnetic-induction": { name: "Electromagnetic Induction" },
                            "alternating-current": { name: "Alternating Current" },
                        },
                    },
                    "waves-optics": {
                        name: "Waves & Optics",
                        topics: {
                            "wave-motion": { name: "Wave Motion" },
                            "sound-waves": { name: "Sound Waves" },
                            "ray-optics": { name: "Ray Optics" },
                            "wave-optics": { name: "Wave Optics" },
                            "modern-physics": { name: "Modern Physics" },
                            "semiconductor-devices": { name: "Semiconductor Devices" },
                        },
                    },
                },
            },
            "jee-chemistry": {
                name: "JEE Chemistry",
                icon: "🧬",
                description: "Physical, Organic & Inorganic for JEE",
                subCategories: {
                    "equilibrium-thermo": {
                        name: "Equilibrium & Thermodynamics",
                        topics: {
                            "chemical-equilibrium": { name: "Chemical Equilibrium" },
                            "ionic-equilibrium": { name: "Ionic Equilibrium" },
                            "thermodynamics-jee": { name: "Thermodynamics" },
                            "redox-reactions": { name: "Redox Reactions" },
                        },
                    },
                    "jee-organic": {
                        name: "Organic Reactions & Mechanisms",
                        topics: {
                            "named-reactions": { name: "Named Reactions" },
                            "goc": { name: "General Organic Chemistry (GOC)" },
                            "isomerism": { name: "Isomerism" },
                            "halogen-compounds": { name: "Halogen Compounds" },
                            "nitrogen-compounds": { name: "Nitrogen Compounds" },
                        },
                    },
                },
            },
            "jee-math": {
                name: "JEE Mathematics",
                icon: "📐",
                description: "Algebra, Coordinate, Calculus for JEE",
                subCategories: {
                    "coordinate-geometry": {
                        name: "Coordinate Geometry",
                        topics: {
                            "straight-lines": { name: "Straight Lines" },
                            circles: { name: "Circles" },
                            parabola: { name: "Parabola" },
                            ellipse: { name: "Ellipse" },
                            hyperbola: { name: "Hyperbola" },
                        },
                    },
                    "combinatorics-probability": {
                        name: "Combinatorics & Probability",
                        topics: {
                            "permutations-combinations": { name: "Permutations & Combinations" },
                            "binomial-theorem": { name: "Binomial Theorem" },
                            probability: { name: "Probability" },
                            statistics: { name: "Statistics" },
                        },
                    },
                    "jee-calculus": {
                        name: "Advanced Calculus",
                        topics: {
                            "aod": { name: "Application of Derivatives" },
                            "aoi": { name: "Area Under Curves" },
                            "vectors-3d": { name: "Vectors & 3D Geometry" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 2. NEET PREPARATION
    // ─────────────────────────────────────────────
    neet: {
        name: "NEET Preparation",
        icon: "🩺",
        description: "NEET UG — Biology, Physics, Chemistry",
        gradient: "from-green-600 to-emerald-700",
        categories: {
            "neet-biology": {
                name: "NEET Biology",
                icon: "🌿",
                description: "Botany & Zoology for NEET",
                subCategories: {
                    "cell-biology": {
                        name: "Cell Biology & Genetics",
                        topics: {
                            "cell-structure": { name: "Cell Structure & Function" },
                            "cell-division": { name: "Cell Division" },
                            "molecular-basis": { name: "Molecular Basis of Inheritance" },
                            "heredity-variation": { name: "Heredity & Variation" },
                            "evolution": { name: "Evolution" },
                            "biotechnology": { name: "Biotechnology & Applications" },
                        },
                    },
                    "plant-physiology": {
                        name: "Plant Physiology",
                        topics: {
                            "photosynthesis": { name: "Photosynthesis" },
                            "respiration-plants": { name: "Respiration in Plants" },
                            "plant-growth": { name: "Plant Growth & Development" },
                            "transport-plants": { name: "Transport in Plants" },
                            "mineral-nutrition": { name: "Mineral Nutrition" },
                        },
                    },
                    "human-physiology": {
                        name: "Human Physiology",
                        topics: {
                            "digestion-absorption": { name: "Digestion & Absorption" },
                            "breathing-gas-exchange": { name: "Breathing & Gas Exchange" },
                            "body-fluids": { name: "Body Fluids & Circulation" },
                            "excretory-system": { name: "Excretory System" },
                            "locomotion-movement": { name: "Locomotion & Movement" },
                            "neural-control": { name: "Neural Control & Coordination" },
                            "chemical-coordination": { name: "Chemical Coordination" },
                        },
                    },
                    "ecology-environment": {
                        name: "Ecology & Environment",
                        topics: {
                            "organisms-populations": { name: "Organisms & Populations" },
                            "ecosystem": { name: "Ecosystem" },
                            "biodiversity": { name: "Biodiversity & Conservation" },
                            "environmental-issues": { name: "Environmental Issues" },
                        },
                    },
                },
            },
            "neet-physics": {
                name: "NEET Physics",
                icon: "⚛️",
                description: "Key physics chapters for NEET",
                subCategories: {
                    "fluid-properties": {
                        name: "Fluids & Properties of Matter",
                        topics: {
                            "fluid-statics": { name: "Fluid Statics" },
                            "fluid-dynamics": { name: "Fluid Dynamics" },
                            "surface-tension": { name: "Surface Tension" },
                            "viscosity": { name: "Viscosity" },
                            "elasticity": { name: "Elasticity" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 3. UPSC CIVIL SERVICES
    // ─────────────────────────────────────────────
    upsc: {
        name: "UPSC Civil Services",
        icon: "🏛️",
        description: "Prelims & Mains — GS, Polity, Economy, Environment",
        gradient: "from-orange-600 to-red-700",
        categories: {
            "general-studies-1": {
                name: "GS Paper I — History & Geography",
                icon: "🌏",
                description: "Indian & World History, Indian Geography",
                subCategories: {
                    "modern-india": {
                        name: "Modern Indian History",
                        topics: {
                            "freedom-struggle": { name: "Freedom Struggle" },
                            "social-reform-movements": { name: "Social Reform Movements" },
                            "gandhi-era": { name: "Gandhian Era" },
                            "partition-independence": { name: "Partition & Independence" },
                        },
                    },
                    "indian-geography": {
                        name: "Indian Geography",
                        topics: {
                            "physical-geography-india": { name: "Physical Geography of India" },
                            "monsoon-climate": { name: "Monsoon & Climate" },
                            "rivers-drainage": { name: "Rivers & Drainage Systems" },
                            "agriculture-india": { name: "Agriculture in India" },
                            "natural-resources-india": { name: "Natural Resources" },
                        },
                    },
                    "world-geography": {
                        name: "World Geography",
                        topics: {
                            "geomorphology": { name: "Geomorphology" },
                            "climatology": { name: "Climatology" },
                            "oceanography": { name: "Oceanography" },
                            "world-resources": { name: "World Resources & Distribution" },
                        },
                    },
                },
            },
            "general-studies-2": {
                name: "GS Paper II — Polity & Governance",
                icon: "⚖️",
                description: "Indian Constitution, Governance, IR",
                subCategories: {
                    "indian-constitution": {
                        name: "Indian Constitution",
                        topics: {
                            "preamble-features": { name: "Preamble & Salient Features" },
                            "fundamental-rights": { name: "Fundamental Rights" },
                            "dpsp": { name: "Directive Principles (DPSP)" },
                            "parliament": { name: "Parliament & Legislature" },
                            "executive": { name: "Executive" },
                            "judiciary": { name: "Judiciary" },
                            "federalism": { name: "Centre-State Relations" },
                            "amendments": { name: "Constitutional Amendments" },
                        },
                    },
                    "governance": {
                        name: "Governance & Social Justice",
                        topics: {
                            "e-governance": { name: "E-Governance" },
                            "citizen-charters": { name: "Citizen Charters" },
                            "transparency-accountability": { name: "Transparency & Accountability" },
                            "welfare-schemes": { name: "Government Welfare Schemes" },
                        },
                    },
                    "international-relations": {
                        name: "International Relations",
                        topics: {
                            "india-neighbours": { name: "India & Its Neighbours" },
                            "bilateral-relations": { name: "Bilateral Relations" },
                            "international-organisations": { name: "International Organisations" },
                            "foreign-policy": { name: "India's Foreign Policy" },
                        },
                    },
                },
            },
            "general-studies-3": {
                name: "GS Paper III — Economy & Environment",
                icon: "📊",
                description: "Indian Economy, Environment, Security",
                subCategories: {
                    "indian-economy": {
                        name: "Indian Economy",
                        topics: {
                            "planning-development": { name: "Planning & Development" },
                            "inclusive-growth": { name: "Inclusive Growth" },
                            "agriculture-economy": { name: "Agriculture & Allied Sectors" },
                            "infrastructure": { name: "Infrastructure" },
                            "investment-models": { name: "Investment Models" },
                            "monetary-fiscal-policy": { name: "Monetary & Fiscal Policy" },
                        },
                    },
                    "environment-upsc": {
                        name: "Environment & Ecology",
                        topics: {
                            "biodiversity-conservation": { name: "Biodiversity Conservation" },
                            "climate-change": { name: "Climate Change" },
                            "environmental-laws": { name: "Environmental Laws" },
                            "disaster-management": { name: "Disaster Management" },
                        },
                    },
                    "science-tech": {
                        name: "Science & Technology",
                        topics: {
                            "space-technology": { name: "Space Technology (ISRO)" },
                            "defence-technology": { name: "Defence Technology" },
                            "it-computers": { name: "IT & Computers" },
                            "biotech-nanotechnology": { name: "Biotechnology & Nanotechnology" },
                        },
                    },
                },
            },
            "general-studies-4": {
                name: "GS Paper IV — Ethics",
                icon: "🤝",
                description: "Ethics, Integrity, Aptitude",
                subCategories: {
                    "ethics-concepts": {
                        name: "Ethics Concepts",
                        topics: {
                            "foundations-ethics": { name: "Foundations of Ethics" },
                            "attitude": { name: "Attitude & Aptitude" },
                            "emotional-intelligence-upsc": { name: "Emotional Intelligence" },
                            "public-service-values": { name: "Public Service Values" },
                            "corruption": { name: "Probity & Anti-Corruption" },
                            "case-studies": { name: "Case Studies" },
                        },
                    },
                },
            },
            "current-affairs": {
                name: "Current Affairs",
                icon: "📰",
                description: "Monthly current affairs for UPSC",
                subCategories: {
                    "national-international": {
                        name: "National & International Affairs",
                        topics: {
                            "government-schemes": { name: "Government Schemes & Policies" },
                            "economy-news": { name: "Economy & Finance News" },
                            "environment-news": { name: "Environment & Ecology News" },
                            "science-tech-news": { name: "Science & Technology News" },
                            "awards-appointments": { name: "Awards & Appointments" },
                            "sports-news": { name: "Sports" },
                            "international-news": { name: "International Affairs" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 4. ECONOMICS
    // ─────────────────────────────────────────────
    economics: {
        name: "Economics",
        icon: "📊",
        description: "Micro, Macro, Indian & International Economy",
        gradient: "from-cyan-500 to-teal-600",
        categories: {
            microeconomics: {
                name: "Microeconomics",
                icon: "🏪",
                description: "Consumer behavior, markets, firm theory",
                subCategories: {
                    "demand-supply": {
                        name: "Demand & Supply",
                        topics: {
                            "law-of-demand": { name: "Law of Demand" },
                            "law-of-supply": { name: "Law of Supply" },
                            elasticity: { name: "Elasticity" },
                            "consumer-equilibrium": { name: "Consumer Equilibrium" },
                            "indifference-curves": { name: "Indifference Curves" },
                        },
                    },
                    "market-structures": {
                        name: "Market Structures",
                        topics: {
                            "perfect-competition": { name: "Perfect Competition" },
                            monopoly: { name: "Monopoly" },
                            "monopolistic-competition": { name: "Monopolistic Competition" },
                            oligopoly: { name: "Oligopoly" },
                            "factor-markets": { name: "Factor Markets" },
                        },
                    },
                },
            },
            macroeconomics: {
                name: "Macroeconomics",
                icon: "🌐",
                description: "National income, banking, trade",
                subCategories: {
                    "national-income": {
                        name: "National Income & Output",
                        topics: {
                            "gdp-gnp": { name: "GDP & GNP" },
                            "inflation-deflation": { name: "Inflation & Deflation" },
                            "employment-theories": { name: "Employment Theories" },
                            "fiscal-policy": { name: "Fiscal Policy" },
                            "monetary-policy": { name: "Monetary Policy" },
                            "trade-balance": { name: "Balance of Trade & Payments" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 5. BIOLOGY (STANDALONE)
    // ─────────────────────────────────────────────
    biology: {
        name: "Biology",
        icon: "🌿",
        description: "Genetics, Anatomy, Ecology, Microbiology",
        gradient: "from-lime-500 to-green-600",
        categories: {
            "human-body": {
                name: "Human Body Systems",
                icon: "🫀",
                description: "Anatomy and Physiology",
                subCategories: {
                    "body-systems": {
                        name: "Body Systems",
                        topics: {
                            "circulatory-system": { name: "Circulatory System" },
                            "nervous-system": { name: "Nervous System" },
                            "endocrine-system": { name: "Endocrine System" },
                            "immune-system": { name: "Immune System" },
                            "skeletal-muscular": { name: "Skeletal & Muscular System" },
                            "reproductive-system": { name: "Reproductive System" },
                        },
                    },
                },
            },
            genetics: {
                name: "Genetics & Molecular Biology",
                icon: "🧬",
                description: "DNA, RNA, Heredity",
                subCategories: {
                    "molecular-genetics": {
                        name: "Molecular Genetics",
                        topics: {
                            "dna-structure": { name: "DNA Structure & Replication" },
                            "rna-protein-synthesis": { name: "RNA & Protein Synthesis" },
                            "mendelian-genetics": { name: "Mendelian Genetics" },
                            "mutations": { name: "Mutations & Genetic Disorders" },
                            "gene-expression": { name: "Gene Expression" },
                        },
                    },
                },
            },
            microbiology: {
                name: "Microbiology",
                icon: "🦠",
                description: "Viruses, Bacteria, Fungi",
                subCategories: {
                    "microorganisms": {
                        name: "Microorganisms",
                        topics: {
                            bacteria: { name: "Bacteria" },
                            viruses: { name: "Viruses" },
                            fungi: { name: "Fungi" },
                            "protozoa": { name: "Protozoa" },
                            "diseases-pathogens": { name: "Diseases & Pathogens" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 6. MEDICINE & HEALTH SCIENCES
    // ─────────────────────────────────────────────
    medicine: {
        name: "Medicine & Health Sciences",
        icon: "🏥",
        description: "Anatomy, Pharmacology, Clinical Sciences",
        gradient: "from-red-500 to-rose-600",
        categories: {
            "clinical-medicine": {
                name: "Clinical Medicine",
                icon: "🩺",
                description: "Diagnosis, diseases, treatment",
                subCategories: {
                    "internal-medicine": {
                        name: "Internal Medicine",
                        topics: {
                            "cardiovascular-diseases": { name: "Cardiovascular Diseases" },
                            "respiratory-diseases": { name: "Respiratory Diseases" },
                            "gastrointestinal-diseases": { name: "Gastrointestinal Diseases" },
                            diabetes: { name: "Diabetes & Metabolic Disorders" },
                            nephrology: { name: "Nephrology" },
                            neurology: { name: "Neurology" },
                        },
                    },
                },
            },
            pharmacology: {
                name: "Pharmacology",
                icon: "💊",
                description: "Drugs, mechanisms, side effects",
                subCategories: {
                    "drug-classes": {
                        name: "Drug Classes",
                        topics: {
                            "analgesics": { name: "Analgesics & Pain Management" },
                            antibiotics: { name: "Antibiotics" },
                            "cardiovascular-drugs": { name: "Cardiovascular Drugs" },
                            "cns-drugs": { name: "CNS Drugs" },
                            "pharmacokinetics": { name: "Pharmacokinetics" },
                            "drug-interactions": { name: "Drug Interactions" },
                        },
                    },
                },
            },
            nutrition: {
                name: "Nutrition & Dietetics",
                icon: "🥗",
                description: "Macronutrients, Vitamins, Deficiencies",
                subCategories: {
                    "nutritional-science": {
                        name: "Nutritional Science",
                        topics: {
                            "macronutrients": { name: "Macronutrients" },
                            "vitamins-minerals": { name: "Vitamins & Minerals" },
                            "dietary-deficiencies": { name: "Dietary Deficiency Diseases" },
                            "bmi-obesity": { name: "BMI & Obesity" },
                            "clinical-nutrition": { name: "Clinical Nutrition" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 7. ENGINEERING & APPLIED SCIENCES
    // ─────────────────────────────────────────────
    engineering: {
        name: "Engineering",
        icon: "⚙️",
        description: "Civil, Mechanical, Electrical, Computer Engineering",
        gradient: "from-slate-500 to-gray-700",
        categories: {
            "civil-engineering": {
                name: "Civil Engineering",
                icon: "🏗️",
                description: "Structures, Materials, Surveying",
                subCategories: {
                    "structural-engineering": {
                        name: "Structural Engineering",
                        topics: {
                            "beams-columns": { name: "Beams & Columns" },
                            "concrete-structures": { name: "Concrete Structures" },
                            "steel-structures": { name: "Steel Structures" },
                            "soil-mechanics": { name: "Soil Mechanics" },
                            "fluid-mechanics": { name: "Fluid Mechanics" },
                            "surveying": { name: "Surveying & Measurement" },
                        },
                    },
                },
            },
            "mechanical-engineering": {
                name: "Mechanical Engineering",
                icon: "🔧",
                description: "Machines, Thermodynamics, Manufacturing",
                subCategories: {
                    "core-mechanical": {
                        name: "Core Concepts",
                        topics: {
                            "engineering-mechanics": { name: "Engineering Mechanics" },
                            "theory-of-machines": { name: "Theory of Machines" },
                            "manufacturing-processes": { name: "Manufacturing Processes" },
                            "heat-transfer": { name: "Heat Transfer" },
                            "ic-engines": { name: "IC Engines" },
                        },
                    },
                },
            },
            "electrical-engineering": {
                name: "Electrical Engineering",
                icon: "⚡",
                description: "Circuits, Machines, Power Systems",
                subCategories: {
                    "core-electrical": {
                        name: "Core Concepts",
                        topics: {
                            "circuit-analysis": { name: "Circuit Analysis" },
                            "network-theorems": { name: "Network Theorems" },
                            "transformers": { name: "Transformers" },
                            "motors-generators": { name: "Motors & Generators" },
                            "power-systems": { name: "Power Systems" },
                            "control-systems": { name: "Control Systems" },
                            "signals-systems": { name: "Signals & Systems" },
                        },
                    },
                },
            },
            "computer-science-engg": {
                name: "Computer Science Engineering",
                icon: "💾",
                description: "Data Structures, OS, Networks, DBMS",
                subCategories: {
                    "core-cs": {
                        name: "Core CS Subjects",
                        topics: {
                            "data-structures-algo": { name: "Data Structures & Algorithms" },
                            "operating-systems": { name: "Operating Systems" },
                            "computer-networks": { name: "Computer Networks" },
                            "dbms": { name: "Database Management Systems" },
                            "compiler-design": { name: "Compiler Design" },
                            "software-engineering": { name: "Software Engineering" },
                            "computer-architecture": { name: "Computer Architecture" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 8. LAW & LEGAL STUDIES
    // ─────────────────────────────────────────────
    law: {
        name: "Law & Legal Studies",
        icon: "⚖️",
        description: "Constitutional, Criminal, Corporate & Cyber Law",
        gradient: "from-zinc-600 to-slate-700",
        categories: {
            "constitutional-law": {
                name: "Constitutional Law",
                icon: "📜",
                description: "Fundamental rights, judiciary, federalism",
                subCategories: {
                    "constitutional-provisions": {
                        name: "Constitutional Provisions",
                        topics: {
                            "basic-structure": { name: "Basic Structure Doctrine" },
                            "writs": { name: "Constitutional Writs" },
                            "emergency-provisions": { name: "Emergency Provisions" },
                            "parliamentary-procedures": { name: "Parliamentary Procedures" },
                            "judicial-review": { name: "Judicial Review" },
                        },
                    },
                },
            },
            "criminal-law": {
                name: "Criminal Law",
                icon: "🔏",
                description: "IPC, CrPC, Evidence Act",
                subCategories: {
                    "ipc-crpc": {
                        name: "IPC & CrPC",
                        topics: {
                            "general-exceptions": { name: "General Exceptions (IPC)" },
                            "offences-against-body": { name: "Offences Against Body" },
                            "offences-against-property": { name: "Offences Against Property" },
                            "arrest-bail": { name: "Arrest, Bail & Remand" },
                            "trial-procedure": { name: "Trial Procedure" },
                            "evidence-act": { name: "Indian Evidence Act" },
                        },
                    },
                },
            },
            "corporate-law": {
                name: "Corporate & Business Law",
                icon: "🏢",
                description: "Companies Act, Contracts, IP Law",
                subCategories: {
                    "business-laws": {
                        name: "Business Laws",
                        topics: {
                            "contract-law": { name: "Contract Law" },
                            "companies-act": { name: "Companies Act" },
                            "insolvency-law": { name: "Insolvency & Bankruptcy" },
                            "intellectual-property": { name: "Intellectual Property Rights" },
                            "competition-law": { name: "Competition Law" },
                            "consumer-protection": { name: "Consumer Protection Act" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 9. ACCOUNTANCY & FINANCE
    // ─────────────────────────────────────────────
    "accountancy-finance": {
        name: "Accountancy & Finance",
        icon: "💰",
        description: "Financial Accounting, Taxation, Investment",
        gradient: "from-emerald-600 to-green-700",
        categories: {
            accounting: {
                name: "Financial Accounting",
                icon: "📒",
                description: "Journal, Ledger, Financial Statements",
                subCategories: {
                    "accounting-basics": {
                        name: "Accounting Basics",
                        topics: {
                            "accounting-concepts": { name: "Accounting Concepts & Principles" },
                            "journal-ledger": { name: "Journal & Ledger" },
                            "trial-balance": { name: "Trial Balance" },
                            "final-accounts": { name: "Final Accounts" },
                            "depreciation": { name: "Depreciation" },
                            "partnership-accounts": { name: "Partnership Accounts" },
                            "company-accounts": { name: "Company Accounts" },
                        },
                    },
                },
            },
            taxation: {
                name: "Taxation",
                icon: "🧾",
                description: "Income Tax, GST, Corporate Tax",
                subCategories: {
                    "indian-taxation": {
                        name: "Indian Taxation",
                        topics: {
                            "income-tax-basics": { name: "Income Tax Basics" },
                            "heads-of-income": { name: "Heads of Income" },
                            "deductions": { name: "Deductions & Exemptions" },
                            "gst": { name: "GST (Goods & Services Tax)" },
                            "tds-tcs": { name: "TDS & TCS" },
                            "corporate-tax": { name: "Corporate Tax" },
                        },
                    },
                },
            },
            "personal-finance": {
                name: "Personal Finance & Investment",
                icon: "📈",
                description: "Stock markets, mutual funds, insurance",
                subCategories: {
                    "investment-basics": {
                        name: "Investment Basics",
                        topics: {
                            "stock-market": { name: "Stock Market Basics" },
                            "mutual-funds": { name: "Mutual Funds" },
                            "bonds-debentures": { name: "Bonds & Debentures" },
                            "insurance": { name: "Insurance" },
                            "real-estate-investment": { name: "Real Estate Investment" },
                            "financial-planning": { name: "Financial Planning" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 10. LANGUAGES
    // ─────────────────────────────────────────────
    languages: {
        name: "Languages",
        icon: "🗣️",
        description: "English, Hindi, Sanskrit, Regional Languages",
        gradient: "from-violet-500 to-purple-700",
        categories: {
            english: {
                name: "English Language",
                icon: "🇬🇧",
                description: "Grammar, Vocabulary, Writing",
                subCategories: {
                    grammar: {
                        name: "English Grammar",
                        topics: {
                            "parts-of-speech": { name: "Parts of Speech" },
                            "tenses": { name: "Tenses" },
                            "subject-verb-agreement": { name: "Subject-Verb Agreement" },
                            "articles-prepositions": { name: "Articles & Prepositions" },
                            "voice-narration": { name: "Active/Passive Voice & Narration" },
                            "conjunctions-clauses": { name: "Conjunctions & Clauses" },
                            "punctuation": { name: "Punctuation" },
                        },
                    },
                    "vocabulary-comprehension": {
                        name: "Vocabulary & Comprehension",
                        topics: {
                            "synonyms-antonyms": { name: "Synonyms & Antonyms" },
                            idioms: { name: "Idioms & Phrases" },
                            "reading-comprehension": { name: "Reading Comprehension" },
                            "one-word-substitution": { name: "One Word Substitution" },
                            "para-jumbles": { name: "Para Jumbles" },
                            "fill-in-blanks": { name: "Fill in the Blanks" },
                        },
                    },
                },
            },
            hindi: {
                name: "Hindi Language",
                icon: "🇮🇳",
                description: "Grammar, Literature, Composition",
                subCategories: {
                    "hindi-grammar": {
                        name: "Hindi Grammar (व्याकरण)",
                        topics: {
                            "sandhi": { name: "संधि (Sandhi)" },
                            "samaas": { name: "समास (Samaas)" },
                            "karak": { name: "कारक (Karak)" },
                            "alankar": { name: "अलंकार (Alankar)" },
                            "rasa-chand": { name: "रस व छंद (Rasa & Chand)" },
                            "hindi-vocab": { name: "Vocabulary & Meanings" },
                        },
                    },
                },
            },
            sanskrit: {
                name: "Sanskrit",
                icon: "📿",
                description: "Sanskrit grammar and literature",
                subCategories: {
                    "sanskrit-grammar": {
                        name: "Sanskrit Grammar",
                        topics: {
                            "dhatu-roop": { name: "Dhatu Roop (Verb Forms)" },
                            "shabd-roop": { name: "Shabd Roop (Noun Forms)" },
                            "sandhi-sanskrit": { name: "Sandhi" },
                            "samaas-sanskrit": { name: "Samaas" },
                            "translation": { name: "Translation Practice" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 11. REASONING & APTITUDE
    // ─────────────────────────────────────────────
    "reasoning-aptitude": {
        name: "Reasoning & Aptitude",
        icon: "🧩",
        description: "Verbal, Non-Verbal, Quantitative Aptitude",
        gradient: "from-fuchsia-500 to-violet-600",
        categories: {
            "verbal-reasoning": {
                name: "Verbal Reasoning",
                icon: "💬",
                description: "Analogies, Series, Syllogisms",
                subCategories: {
                    "verbal-concepts": {
                        name: "Verbal Concepts",
                        topics: {
                            analogies: { name: "Analogies" },
                            "series-completion": { name: "Series Completion" },
                            "blood-relations": { name: "Blood Relations" },
                            "direction-sense": { name: "Direction Sense" },
                            syllogisms: { name: "Syllogisms" },
                            "coding-decoding": { name: "Coding-Decoding" },
                            "seating-arrangement": { name: "Seating Arrangement" },
                            "puzzles": { name: "Puzzles" },
                        },
                    },
                },
            },
            "non-verbal-reasoning": {
                name: "Non-Verbal Reasoning",
                icon: "🔷",
                description: "Patterns, Matrices, Mirror Images",
                subCategories: {
                    "visual-reasoning": {
                        name: "Visual Reasoning",
                        topics: {
                            "pattern-completion": { name: "Pattern Completion" },
                            matrices: { name: "Matrices" },
                            "mirror-images": { name: "Mirror & Water Images" },
                            "figure-series": { name: "Figure Series" },
                            "paper-folding": { name: "Paper Folding & Cutting" },
                            "cubes-dice": { name: "Cubes & Dice" },
                        },
                    },
                },
            },
            "quantitative-aptitude": {
                name: "Quantitative Aptitude",
                icon: "🔢",
                description: "Arithmetic, Algebra, Data Interpretation",
                subCategories: {
                    "arithmetic": {
                        name: "Arithmetic",
                        topics: {
                            "number-system": { name: "Number System" },
                            "hcf-lcm": { name: "HCF & LCM" },
                            "percentage": { name: "Percentage" },
                            "profit-loss": { name: "Profit & Loss" },
                            "ratio-proportion": { name: "Ratio & Proportion" },
                            "time-work": { name: "Time & Work" },
                            "time-speed-distance": { name: "Time, Speed & Distance" },
                            "simple-compound-interest": { name: "Simple & Compound Interest" },
                            "averages-mixtures": { name: "Averages & Mixtures" },
                        },
                    },
                    "data-interpretation": {
                        name: "Data Interpretation",
                        topics: {
                            "bar-graphs": { name: "Bar Graphs" },
                            "line-graphs": { name: "Line Graphs" },
                            "pie-charts": { name: "Pie Charts" },
                            "tables": { name: "Data Tables" },
                            "caselets": { name: "Caselets" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 12. ENVIRONMENT & ECOLOGY
    // ─────────────────────────────────────────────
    "environment-ecology": {
        name: "Environment & Ecology",
        icon: "🌱",
        description: "Ecosystems, Climate Change, Conservation",
        gradient: "from-green-500 to-lime-600",
        categories: {
            "ecology-basics": {
                name: "Ecology",
                icon: "🌿",
                description: "Biomes, food webs, ecosystem dynamics",
                subCategories: {
                    "ecosystem-concepts": {
                        name: "Ecosystem Concepts",
                        topics: {
                            "biomes": { name: "Biomes of the World" },
                            "food-chains": { name: "Food Chains & Food Webs" },
                            "energy-flow": { name: "Energy Flow" },
                            "biogeochemical-cycles": { name: "Biogeochemical Cycles" },
                            "ecological-succession": { name: "Ecological Succession" },
                            "population-ecology": { name: "Population Ecology" },
                        },
                    },
                },
            },
            "climate-change": {
                name: "Climate Change & Sustainability",
                icon: "🌡️",
                description: "Global warming, renewable energy, treaties",
                subCategories: {
                    "climate-science": {
                        name: "Climate Science",
                        topics: {
                            "greenhouse-effect": { name: "Greenhouse Effect" },
                            "global-warming": { name: "Global Warming" },
                            "carbon-credits": { name: "Carbon Credits & Trading" },
                            "renewable-energy": { name: "Renewable Energy Sources" },
                            "paris-agreement": { name: "International Treaties (Paris, Kyoto)" },
                            "pollution-types": { name: "Types of Pollution" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 13. DIGITAL GAMES & E-SPORTS
    // ─────────────────────────────────────────────
    "digital-games": {
        name: "Digital Games & E-Sports",
        icon: "🕹️",
        description: "Video Game Knowledge, Strategy, E-Sports",
        gradient: "from-cyan-600 to-blue-700",
        categories: {
            "game-knowledge": {
                name: "Video Game Knowledge",
                icon: "🎮",
                description: "Gaming genres, history, mechanics",
                subCategories: {
                    "gaming-genres": {
                        name: "Gaming Genres & History",
                        topics: {
                            "fps-games": { name: "First-Person Shooters (FPS)" },
                            "rpg-games": { name: "Role-Playing Games (RPG)" },
                            "strategy-games": { name: "Strategy Games (RTS/TBS)" },
                            "moba-games": { name: "MOBA Games" },
                            "battle-royale": { name: "Battle Royale Genre" },
                            "game-history": { name: "History of Video Games" },
                            "gaming-platforms": { name: "Gaming Platforms & Consoles" },
                        },
                    },
                },
            },
            "esports": {
                name: "E-Sports",
                icon: "🏆",
                description: "Competitive gaming, tournaments, teams",
                subCategories: {
                    "esports-titles": {
                        name: "Popular E-Sports Titles",
                        topics: {
                            "valorant": { name: "Valorant" },
                            "csgo-cs2": { name: "Counter-Strike (CS2)" },
                            "dota2": { name: "Dota 2" },
                            "lol": { name: "League of Legends" },
                            "bgmi-pubg": { name: "BGMI / PUBG Mobile" },
                            "free-fire": { name: "Garena Free Fire" },
                            "esports-tournaments": { name: "Major E-Sports Tournaments" },
                        },
                    },
                },
            },
            "mobile-gaming": {
                name: "Mobile Gaming",
                icon: "📱",
                description: "Popular mobile titles, tips, rankings",
                subCategories: {
                    "mobile-titles": {
                        name: "Mobile Game Titles",
                        topics: {
                            "clash-of-clans": { name: "Clash of Clans" },
                            "clash-royale": { name: "Clash Royale" },
                            "minecraft": { name: "Minecraft" },
                            "pokemon-go": { name: "Pokémon GO" },
                            "candy-crush": { name: "Candy Crush & Puzzle Games" },
                            "mobile-rpg": { name: "Mobile RPG Games" },
                        },
                    },
                },
            },
            "game-design": {
                name: "Game Design & Development",
                icon: "🛠️",
                description: "Mechanics, level design, game engines",
                subCategories: {
                    "game-dev-basics": {
                        name: "Game Development Basics",
                        topics: {
                            "game-mechanics": { name: "Game Mechanics" },
                            "level-design": { name: "Level Design" },
                            "game-engines": { name: "Game Engines (Unity, Unreal)" },
                            "game-monetization": { name: "Game Monetization Models" },
                            "game-audio": { name: "Game Audio & Music" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 14. PUZZLE & BOARD GAMES (EXPANDED)
    // ─────────────────────────────────────────────
    "puzzle-board-games": {
        name: "Puzzle & Board Games",
        icon: "♟️",
        description: "Chess Advanced, Strategy Games, Puzzles",
        gradient: "from-stone-500 to-neutral-700",
        categories: {
            "chess-advanced": {
                name: "Chess (Advanced)",
                icon: "♟️",
                description: "Openings, tactics, endgames",
                subCategories: {
                    "chess-strategy": {
                        name: "Chess Strategy",
                        topics: {
                            "chess-openings": { name: "Chess Openings" },
                            "middlegame-tactics": { name: "Middlegame Tactics" },
                            "endgame-techniques": { name: "Endgame Techniques" },
                            "famous-games": { name: "Famous Chess Games" },
                            "chess-notation": { name: "Chess Notation & Rules" },
                        },
                    },
                },
            },
            "strategy-board-games": {
                name: "Strategy Board Games",
                icon: "🎲",
                description: "Rules and strategies for board games",
                subCategories: {
                    "popular-board-games": {
                        name: "Popular Board Games",
                        topics: {
                            "scrabble": { name: "Scrabble" },
                            "monopoly": { name: "Monopoly" },
                            "ludo": { name: "Ludo" },
                            "snakes-ladders": { name: "Snakes & Ladders" },
                            "catan": { name: "Catan" },
                            "risk-game": { name: "Risk" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 15. MUSIC & PERFORMING ARTS
    // ─────────────────────────────────────────────
    music: {
        name: "Music & Performing Arts",
        icon: "🎵",
        description: "Music Theory, Indian Classical, Instruments",
        gradient: "from-pink-500 to-fuchsia-600",
        categories: {
            "music-theory": {
                name: "Music Theory",
                icon: "🎼",
                description: "Notes, scales, harmony, rhythm",
                subCategories: {
                    "western-theory": {
                        name: "Western Music Theory",
                        topics: {
                            "notes-scales": { name: "Notes & Scales" },
                            "chords-harmony": { name: "Chords & Harmony" },
                            rhythm: { name: "Rhythm & Time Signatures" },
                            "intervals": { name: "Intervals" },
                            "music-notation": { name: "Music Notation" },
                        },
                    },
                },
            },
            "indian-classical": {
                name: "Indian Classical Music",
                icon: "🪘",
                description: "Ragas, Talas, Hindustani & Carnatic",
                subCategories: {
                    "hindustani-carnatic": {
                        name: "Hindustani & Carnatic",
                        topics: {
                            "ragas": { name: "Ragas" },
                            "talas": { name: "Talas (Rhythm Cycles)" },
                            "swaras": { name: "Swaras (Notes)" },
                            "gharanas": { name: "Gharanas & Traditions" },
                            "carnatic-basics": { name: "Carnatic Music Basics" },
                        },
                    },
                },
            },
            instruments: {
                name: "Musical Instruments",
                icon: "🎸",
                description: "String, wind, percussion instruments",
                subCategories: {
                    "instrument-types": {
                        name: "Instrument Families",
                        topics: {
                            "string-instruments": { name: "String Instruments" },
                            "wind-instruments": { name: "Wind Instruments" },
                            "percussion-instruments": { name: "Percussion Instruments" },
                            "keyboard-instruments": { name: "Keyboard Instruments" },
                            "indian-instruments": { name: "Indian Classical Instruments" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 16. PHILOSOPHY
    // ─────────────────────────────────────────────
    philosophy: {
        name: "Philosophy",
        icon: "🤔",
        description: "Ethics, Logic, Epistemology, Indian Philosophy",
        gradient: "from-stone-600 to-amber-800",
        categories: {
            "western-philosophy": {
                name: "Western Philosophy",
                icon: "🏛️",
                description: "Major schools of Western thought",
                subCategories: {
                    "major-philosophers": {
                        name: "Major Philosophers & Schools",
                        topics: {
                            "socrates-plato": { name: "Socrates & Plato" },
                            "aristotle": { name: "Aristotle" },
                            "rationalism": { name: "Rationalism" },
                            "empiricism": { name: "Empiricism" },
                            "existentialism": { name: "Existentialism" },
                            "utilitarianism": { name: "Utilitarianism" },
                            "kantian-ethics": { name: "Kantian Ethics" },
                        },
                    },
                },
            },
            "indian-philosophy": {
                name: "Indian Philosophy",
                icon: "🕉️",
                description: "Vedanta, Buddhism, Jainism, Nyaya",
                subCategories: {
                    "schools-of-thought": {
                        name: "Schools of Indian Thought",
                        topics: {
                            "vedanta": { name: "Vedanta" },
                            "yoga-philosophy": { name: "Yoga Philosophy" },
                            "buddhism-philosophy": { name: "Buddhist Philosophy" },
                            "jainism-philosophy": { name: "Jain Philosophy" },
                            "nyaya-vaisheshika": { name: "Nyaya & Vaisheshika" },
                            "sankhya": { name: "Sankhya" },
                        },
                    },
                },
            },
            logic: {
                name: "Logic & Critical Thinking",
                icon: "🧠",
                description: "Arguments, fallacies, formal logic",
                subCategories: {
                    "logic-concepts": {
                        name: "Logic Concepts",
                        topics: {
                            "deductive-inductive": { name: "Deductive & Inductive Reasoning" },
                            "logical-fallacies": { name: "Logical Fallacies" },
                            "formal-logic": { name: "Formal Logic" },
                            "critical-thinking": { name: "Critical Thinking Skills" },
                            "argument-analysis": { name: "Argument Analysis" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 17. POLITICAL SCIENCE
    // ─────────────────────────────────────────────
    "political-science": {
        name: "Political Science",
        icon: "🗳️",
        description: "Political Theories, IR, Comparative Politics",
        gradient: "from-red-600 to-orange-600",
        categories: {
            "political-theory": {
                name: "Political Theory",
                icon: "📜",
                description: "Democracy, sovereignty, rights",
                subCategories: {
                    "core-concepts-polsci": {
                        name: "Core Political Concepts",
                        topics: {
                            "democracy": { name: "Democracy" },
                            "sovereignty": { name: "Sovereignty" },
                            "rights-liberty": { name: "Rights & Liberty" },
                            "equality": { name: "Equality" },
                            "justice": { name: "Justice" },
                            "nationalism": { name: "Nationalism" },
                            "secularism": { name: "Secularism" },
                        },
                    },
                },
            },
            "comparative-politics": {
                name: "Comparative Politics",
                icon: "🌍",
                description: "Political systems around the world",
                subCategories: {
                    "systems": {
                        name: "Political Systems",
                        topics: {
                            "presidential-parliamentary": { name: "Presidential vs Parliamentary" },
                            "federal-unitary": { name: "Federal vs Unitary Systems" },
                            "electoral-systems": { name: "Electoral Systems" },
                            "party-systems": { name: "Political Party Systems" },
                            "civil-society": { name: "Civil Society & NGOs" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 18. SOCIOLOGY
    // ─────────────────────────────────────────────
    sociology: {
        name: "Sociology",
        icon: "👥",
        description: "Society, Culture, Social Institutions",
        gradient: "from-amber-500 to-yellow-600",
        categories: {
            "social-institutions": {
                name: "Social Institutions",
                icon: "🏫",
                description: "Family, religion, education, economy",
                subCategories: {
                    "institutions": {
                        name: "Key Institutions",
                        topics: {
                            "family-marriage": { name: "Family & Marriage" },
                            "education-society": { name: "Education & Society" },
                            "religion-society": { name: "Religion & Society" },
                            "caste-system": { name: "Caste System in India" },
                            "tribal-communities": { name: "Tribal Communities" },
                            "gender-society": { name: "Gender & Society" },
                        },
                    },
                },
            },
            "social-change": {
                name: "Social Change & Issues",
                icon: "⚡",
                description: "Modernization, urbanization, social problems",
                subCategories: {
                    "social-issues": {
                        name: "Social Issues",
                        topics: {
                            "urbanization": { name: "Urbanization" },
                            "poverty-inequality": { name: "Poverty & Inequality" },
                            "communalism": { name: "Communalism" },
                            "social-movements": { name: "Social Movements" },
                            "globalization-society": { name: "Globalization & Society" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 19. ASTRONOMY & SPACE SCIENCE
    // ─────────────────────────────────────────────
    astronomy: {
        name: "Astronomy & Space Science",
        icon: "🔭",
        description: "Planets, Stars, Cosmology, Space Missions",
        gradient: "from-indigo-700 to-violet-900",
        categories: {
            "solar-system": {
                name: "Solar System",
                icon: "☀️",
                description: "Planets, moons, asteroids",
                subCategories: {
                    "planets-moons": {
                        name: "Planets & Moons",
                        topics: {
                            "inner-planets": { name: "Inner Planets (Mercury–Mars)" },
                            "outer-planets": { name: "Outer Planets (Jupiter–Neptune)" },
                            "earth-moon": { name: "Earth & Moon" },
                            "asteroids-comets": { name: "Asteroids & Comets" },
                            "dwarf-planets": { name: "Dwarf Planets" },
                        },
                    },
                },
            },
            "stars-galaxies": {
                name: "Stars & Galaxies",
                icon: "🌌",
                description: "Stellar evolution, galaxies, black holes",
                subCategories: {
                    "stellar-concepts": {
                        name: "Stellar Concepts",
                        topics: {
                            "stellar-evolution": { name: "Stellar Evolution" },
                            "black-holes": { name: "Black Holes" },
                            "supernovae": { name: "Supernovae & Neutron Stars" },
                            "galaxies-types": { name: "Types of Galaxies" },
                            "milky-way": { name: "The Milky Way" },
                        },
                    },
                },
            },
            "space-missions": {
                name: "Space Missions & Exploration",
                icon: "🚀",
                description: "ISRO, NASA, ESA missions",
                subCategories: {
                    "missions": {
                        name: "Notable Missions",
                        topics: {
                            "isro-missions": { name: "ISRO Missions (Chandrayaan, Mangalyaan)" },
                            "nasa-missions": { name: "NASA Missions (Apollo, Artemis)" },
                            "james-webb": { name: "James Webb Space Telescope" },
                            "mars-missions": { name: "Mars Missions" },
                            "human-spaceflight": { name: "Human Spaceflight" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 20. ARCHITECTURE & DESIGN
    // ─────────────────────────────────────────────
    "architecture-design": {
        name: "Architecture & Design",
        icon: "🏛️",
        description: "Architecture history, styles, and design principles",
        gradient: "from-stone-500 to-amber-700",
        categories: {
            "architectural-history": {
                name: "Architectural History",
                icon: "🏯",
                description: "Ancient to modern architectural styles",
                subCategories: {
                    "styles-periods": {
                        name: "Styles & Periods",
                        topics: {
                            "ancient-architecture": { name: "Ancient Architecture" },
                            "islamic-architecture": { name: "Islamic Architecture" },
                            "mughal-architecture": { name: "Mughal Architecture in India" },
                            "gothic-baroque": { name: "Gothic & Baroque" },
                            "modern-architecture": { name: "Modern Architecture" },
                            "sustainable-design": { name: "Sustainable Architecture" },
                        },
                    },
                },
            },
            "interior-design": {
                name: "Interior Design",
                icon: "🪑",
                description: "Space planning, furniture, aesthetics",
                subCategories: {
                    "design-principles": {
                        name: "Design Principles",
                        topics: {
                            "space-planning": { name: "Space Planning" },
                            "color-in-design": { name: "Color in Interior Design" },
                            "furniture-styles": { name: "Furniture Styles" },
                            "lighting-design": { name: "Lighting Design" },
                            "ergonomics": { name: "Ergonomics" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 21. FASHION & TEXTILE
    // ─────────────────────────────────────────────
    "fashion-textile": {
        name: "Fashion & Textile",
        icon: "👗",
        description: "Fashion History, Textiles, Design Principles",
        gradient: "from-rose-400 to-pink-600",
        categories: {
            "fashion-design": {
                name: "Fashion Design",
                icon: "✂️",
                description: "Silhouettes, fashion theory, styling",
                subCategories: {
                    "fashion-concepts": {
                        name: "Fashion Concepts",
                        topics: {
                            "fashion-history": { name: "History of Fashion" },
                            "elements-design": { name: "Elements of Design" },
                            "colour-fashion": { name: "Color Theory in Fashion" },
                            "fabric-knowledge": { name: "Fabric & Textile Knowledge" },
                            "fashion-illustration": { name: "Fashion Illustration" },
                            "sustainable-fashion": { name: "Sustainable Fashion" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 22. PHYSICAL EDUCATION & SPORTS SCIENCE
    // ─────────────────────────────────────────────
    "physical-education": {
        name: "Physical Education",
        icon: "🏋️",
        description: "Fitness, Sports Science, Anatomy for Athletes",
        gradient: "from-orange-400 to-red-500",
        categories: {
            "sports-science": {
                name: "Sports Science",
                icon: "🔬",
                description: "Exercise physiology, biomechanics",
                subCategories: {
                    "science-of-fitness": {
                        name: "Science of Fitness",
                        topics: {
                            "exercise-physiology": { name: "Exercise Physiology" },
                            "biomechanics": { name: "Biomechanics" },
                            "sports-nutrition": { name: "Sports Nutrition" },
                            "training-methods": { name: "Training Methods" },
                            "injury-prevention": { name: "Injury Prevention & Recovery" },
                            "doping-ethics": { name: "Doping & Sports Ethics" },
                        },
                    },
                },
            },
            "yoga-fitness": {
                name: "Yoga & Mind-Body Fitness",
                icon: "🧘",
                description: "Asanas, Pranayama, Meditation",
                subCategories: {
                    "yoga-practice": {
                        name: "Yoga Practice",
                        topics: {
                            "asanas": { name: "Asanas (Postures)" },
                            "pranayama": { name: "Pranayama (Breathing)" },
                            "meditation-techniques": { name: "Meditation Techniques" },
                            "types-of-yoga": { name: "Types of Yoga" },
                            "yoga-history": { name: "History of Yoga" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 23. PHOTOGRAPHY & FILM
    // ─────────────────────────────────────────────
    "photography-film": {
        name: "Photography & Film",
        icon: "📷",
        description: "Photography basics, filmmaking, cinematography",
        gradient: "from-gray-600 to-zinc-800",
        categories: {
            photography: {
                name: "Photography",
                icon: "📸",
                description: "Exposure, composition, editing",
                subCategories: {
                    "photo-basics": {
                        name: "Photography Basics",
                        topics: {
                            "exposure-triangle": { name: "Exposure Triangle" },
                            "composition-rules": { name: "Composition Rules" },
                            "camera-types": { name: "Camera Types & Parts" },
                            "lighting-photography": { name: "Lighting in Photography" },
                            "photo-editing": { name: "Photo Editing Basics" },
                            "photo-genres": { name: "Photography Genres" },
                        },
                    },
                },
            },
            filmmaking: {
                name: "Filmmaking & Cinema",
                icon: "🎬",
                description: "Screenplay, direction, cinematography",
                subCategories: {
                    "film-theory": {
                        name: "Film Theory & Practice",
                        topics: {
                            "screenplay-writing": { name: "Screenplay Writing" },
                            "cinematography": { name: "Cinematography" },
                            "film-editing": { name: "Film Editing" },
                            "direction": { name: "Direction & Mise-en-scène" },
                            "film-genres": { name: "Film Genres" },
                            "world-cinema": { name: "World Cinema History" },
                            "bollywood": { name: "Indian Cinema (Bollywood)" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 24. COOKING & CULINARY ARTS
    // ─────────────────────────────────────────────
    culinary: {
        name: "Cooking & Culinary Arts",
        icon: "👨🍳",
        description: "Cooking techniques, cuisines, food science",
        gradient: "from-yellow-400 to-orange-500",
        categories: {
            "cooking-techniques": {
                name: "Cooking Techniques",
                icon: "🍳",
                description: "Methods, knives, heat application",
                subCategories: {
                    "core-techniques": {
                        name: "Core Techniques",
                        topics: {
                            "knife-skills": { name: "Knife Skills" },
                            "dry-heat-cooking": { name: "Dry Heat Cooking" },
                            "moist-heat-cooking": { name: "Moist Heat Cooking" },
                            "baking-basics": { name: "Baking Basics" },
                            "food-safety": { name: "Food Safety & Hygiene" },
                            "fermentation": { name: "Fermentation & Preservation" },
                        },
                    },
                },
            },
            "world-cuisines": {
                name: "World Cuisines",
                icon: "🌍",
                description: "Indian, Italian, Chinese, French cuisine",
                subCategories: {
                    "cuisines": {
                        name: "Global Cuisines",
                        topics: {
                            "indian-cuisine": { name: "Indian Cuisine (Regional)" },
                            "italian-cuisine": { name: "Italian Cuisine" },
                            "chinese-cuisine": { name: "Chinese Cuisine" },
                            "french-cuisine": { name: "French Cuisine" },
                            "japanese-cuisine": { name: "Japanese Cuisine" },
                            "middle-eastern": { name: "Middle Eastern Cuisine" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 25. DATA SCIENCE & STATISTICS
    // ─────────────────────────────────────────────
    "data-science": {
        name: "Data Science & Statistics",
        icon: "📉",
        description: "Statistics, Machine Learning, Data Analysis",
        gradient: "from-blue-500 to-cyan-600",
        categories: {
            statistics: {
                name: "Statistics",
                icon: "📊",
                description: "Descriptive & inferential statistics",
                subCategories: {
                    "stat-basics": {
                        name: "Statistical Methods",
                        topics: {
                            "descriptive-stats": { name: "Descriptive Statistics" },
                            "probability-distributions": { name: "Probability Distributions" },
                            "hypothesis-testing": { name: "Hypothesis Testing" },
                            "regression-analysis": { name: "Regression Analysis" },
                            "sampling": { name: "Sampling Techniques" },
                            "bayes-theorem": { name: "Bayesian Statistics" },
                        },
                    },
                },
            },
            "ml-ds": {
                name: "Machine Learning & Data Analysis",
                icon: "🤖",
                description: "Algorithms, data preprocessing, visualization",
                subCategories: {
                    "ml-concepts": {
                        name: "ML Concepts",
                        topics: {
                            "data-preprocessing": { name: "Data Preprocessing" },
                            "feature-engineering": { name: "Feature Engineering" },
                            "classification": { name: "Classification Algorithms" },
                            "clustering": { name: "Clustering Algorithms" },
                            "model-evaluation": { name: "Model Evaluation & Metrics" },
                            "deep-learning-intro": { name: "Intro to Deep Learning" },
                            "data-visualization": { name: "Data Visualization" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 26. MYTHOLOGY & FOLKLORE
    // ─────────────────────────────────────────────
    mythology: {
        name: "Mythology & Folklore",
        icon: "🐉",
        description: "Indian, Greek, Norse, Egyptian Mythology",
        gradient: "from-amber-700 to-yellow-800",
        categories: {
            "indian-mythology": {
                name: "Indian Mythology",
                icon: "🕉️",
                description: "Hindu, Buddhist & Jain mythology",
                subCategories: {
                    "hindu-texts": {
                        name: "Hindu Epics & Texts",
                        topics: {
                            "ramayana": { name: "Ramayana" },
                            "mahabharata": { name: "Mahabharata" },
                            "bhagavad-gita": { name: "Bhagavad Gita" },
                            "puranas": { name: "Puranas" },
                            "vedas-upanishads": { name: "Vedas & Upanishads" },
                            "deities": { name: "Hindu Deities & Pantheon" },
                        },
                    },
                },
            },
            "world-mythology": {
                name: "World Mythology",
                icon: "🌍",
                description: "Greek, Norse, Egyptian, Chinese myths",
                subCategories: {
                    "mythological-traditions": {
                        name: "Mythological Traditions",
                        topics: {
                            "greek-myths": { name: "Greek Mythology" },
                            "norse-myths": { name: "Norse Mythology" },
                            "egyptian-myths": { name: "Egyptian Mythology" },
                            "roman-myths": { name: "Roman Mythology" },
                            "chinese-mythology": { name: "Chinese Mythology" },
                            "celtic-mythology": { name: "Celtic Mythology" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 27. GENERAL KNOWLEDGE & CURRENT AFFAIRS
    // ─────────────────────────────────────────────
    "general-knowledge": {
        name: "General Knowledge",
        icon: "🌐",
        description: "India, World, Science GK, Daily Current Affairs",
        gradient: "from-teal-500 to-cyan-600",
        categories: {
            "india-gk": {
                name: "India GK",
                icon: "🇮🇳",
                description: "States, capitals, culture, records",
                subCategories: {
                    "india-facts": {
                        name: "India Facts",
                        topics: {
                            "states-capitals": { name: "States & Capitals" },
                            "national-symbols": { name: "National Symbols" },
                            "first-in-india": { name: "Firsts in India" },
                            "india-rankings": { name: "India in Rankings & Records" },
                            "famous-indians": { name: "Famous Indians" },
                            "festivals-india": { name: "Festivals of India" },
                        },
                    },
                },
            },
            "world-gk": {
                name: "World GK",
                icon: "🌍",
                description: "Countries, capitals, world records",
                subCategories: {
                    "world-facts": {
                        name: "World Facts",
                        topics: {
                            "countries-capitals": { name: "Countries & Capitals" },
                            "world-records": { name: "World Records" },
                            "international-organisations-gk": { name: "International Organisations" },
                            "wonders-of-world": { name: "Wonders of the World" },
                            "famous-personalities": { name: "Famous World Personalities" },
                        },
                    },
                },
            },
            "science-gk": {
                name: "Science GK",
                icon: "🔬",
                description: "Inventions, discoveries, Nobel prizes",
                subCategories: {
                    "inventions-discoveries": {
                        name: "Inventions & Discoveries",
                        topics: {
                            "famous-inventions": { name: "Famous Inventions" },
                            "scientific-discoveries": { name: "Scientific Discoveries" },
                            "nobel-prizes": { name: "Nobel Prize Winners" },
                            "si-units": { name: "SI Units & Constants" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 28. COMPETITIVE EXAMS (OTHER)
    // ─────────────────────────────────────────────
    "competitive-exams": {
        name: "Competitive Exams",
        icon: "📝",
        description: "SSC, Banking, Railway, Defence Exams",
        gradient: "from-sky-500 to-blue-600",
        categories: {
            "ssc-exams": {
                name: "SSC Exams (CGL, CHSL, MTS)",
                icon: "📋",
                description: "Quant, Reasoning, English, GK for SSC",
                subCategories: {
                    "ssc-subjects": {
                        name: "SSC Core Subjects",
                        topics: {
                            "ssc-quant": { name: "Quantitative Aptitude" },
                            "ssc-reasoning": { name: "General Intelligence & Reasoning" },
                            "ssc-english": { name: "English Language" },
                            "ssc-gk": { name: "General Awareness" },
                        },
                    },
                },
            },
            "banking-exams": {
                name: "Banking Exams (IBPS, SBI PO/Clerk)",
                icon: "🏦",
                description: "Quant, Reasoning, Banking Awareness",
                subCategories: {
                    "banking-subjects": {
                        name: "Banking Exam Subjects",
                        topics: {
                            "banking-awareness": { name: "Banking Awareness & Financial GK" },
                            "data-interpretation-bank": { name: "Data Interpretation" },
                            "banking-reasoning": { name: "Reasoning Ability" },
                            "computer-awareness": { name: "Computer Awareness" },
                            "english-bank": { name: "English Language" },
                        },
                    },
                },
            },
            "defence-exams": {
                name: "Defence Exams (NDA, CDS, AFCAT)",
                icon: "🎖️",
                description: "Math, English, GK for defence aspirants",
                subCategories: {
                    "defence-subjects": {
                        name: "Defence Exam Subjects",
                        topics: {
                            "nda-math": { name: "NDA Mathematics" },
                            "defence-gk": { name: "General Knowledge (Defence Oriented)" },
                            "defence-english": { name: "English (Defence Exams)" },
                            "current-defence-affairs": { name: "Defence Current Affairs" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 29. SOCIAL MEDIA & DIGITAL LITERACY
    // ─────────────────────────────────────────────
    "digital-literacy": {
        name: "Digital Literacy & Social Media",
        icon: "📱",
        description: "Internet safety, social media, fact-checking",
        gradient: "from-sky-400 to-indigo-500",
        categories: {
            "internet-safety": {
                name: "Internet Safety",
                icon: "🛡️",
                description: "Privacy, scams, digital hygiene",
                subCategories: {
                    "online-safety": {
                        name: "Online Safety",
                        topics: {
                            "privacy-settings": { name: "Privacy Settings & Data" },
                            "phishing-scams": { name: "Phishing & Online Scams" },
                            "digital-footprint": { name: "Digital Footprint" },
                            "fake-news-detection": { name: "Fake News Detection" },
                            "cyberbullying": { name: "Cyberbullying Awareness" },
                        },
                    },
                },
            },
            "social-media-literacy": {
                name: "Social Media Literacy",
                icon: "📲",
                description: "Platforms, algorithms, content creation",
                subCategories: {
                    "platform-knowledge": {
                        name: "Platform Knowledge",
                        topics: {
                            "instagram-yt": { name: "Instagram & YouTube Basics" },
                            "linkedin": { name: "LinkedIn & Professional Networking" },
                            "content-creation": { name: "Content Creation Basics" },
                            "seo-basics": { name: "SEO Basics" },
                            "social-media-marketing": { name: "Social Media Marketing" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 30. ENTREPRENEURSHIP & STARTUPS
    // ─────────────────────────────────────────────
    entrepreneurship: {
        name: "Entrepreneurship & Startups",
        icon: "🚀",
        description: "Business ideation, funding, growth hacking",
        gradient: "from-purple-600 to-indigo-700",
        categories: {
            "startup-basics": {
                name: "Startup Fundamentals",
                icon: "💡",
                description: "Ideation, MVP, business models",
                subCategories: {
                    "startup-concepts": {
                        name: "Startup Concepts",
                        topics: {
                            "ideation": { name: "Ideation & Problem Solving" },
                            "mvp": { name: "Minimum Viable Product (MVP)" },
                            "business-models": { name: "Business Model Canvas" },
                            "market-validation": { name: "Market Validation" },
                            "lean-startup": { name: "Lean Startup Methodology" },
                        },
                    },
                },
            },
            "funding-growth": {
                name: "Funding & Growth",
                icon: "💸",
                description: "VC, angel investing, scaling",
                subCategories: {
                    "funding-stages": {
                        name: "Funding Stages & Growth",
                        topics: {
                            "bootstrapping": { name: "Bootstrapping" },
                            "angel-vc": { name: "Angel Investment & VC" },
                            "fundraising-pitch": { name: "Fundraising & Pitching" },
                            "growth-hacking": { name: "Growth Hacking" },
                            "startup-ecosystem-india": { name: "Indian Startup Ecosystem" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 31. HEALTH & WELLNESS
    // ─────────────────────────────────────────────
    "health-wellness": {
        name: "Health & Wellness",
        icon: "💚",
        description: "Mental health, preventive care, first aid",
        gradient: "from-teal-400 to-green-500",
        categories: {
            "mental-health": {
                name: "Mental Health",
                icon: "🧠",
                description: "Disorders, therapy, coping strategies",
                subCategories: {
                    "mental-health-topics": {
                        name: "Mental Health Topics",
                        topics: {
                            "anxiety-depression": { name: "Anxiety & Depression" },
                            "stress-management-mh": { name: "Stress Management" },
                            "therapy-counseling": { name: "Therapy & Counselling Types" },
                            "sleep-health": { name: "Sleep & Health" },
                            "mindfulness": { name: "Mindfulness Practices" },
                            "psychiatric-disorders": { name: "Psychiatric Disorders" },
                        },
                    },
                },
            },
            "first-aid": {
                name: "First Aid & Emergency",
                icon: "🚑",
                description: "CPR, wound care, emergency response",
                subCategories: {
                    "first-aid-procedures": {
                        name: "First Aid Procedures",
                        topics: {
                            "cpr": { name: "CPR & Basic Life Support" },
                            "wound-care": { name: "Wound Care & Bandaging" },
                            "burns-fractures": { name: "Burns & Fractures" },
                            "choking": { name: "Choking & Heimlich Maneuver" },
                            "snake-bites": { name: "Snake Bites & Poisoning" },
                            "disaster-first-aid": { name: "First Aid in Disasters" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 32. ROBOTICS & AUTOMATION
    // ─────────────────────────────────────────────
    "robotics-automation": {
        name: "Robotics & Automation",
        icon: "🤖",
        description: "Robotics, IoT, Industry 4.0, 3D Printing",
        gradient: "from-zinc-500 to-slate-600",
        categories: {
            robotics: {
                name: "Robotics",
                icon: "🦾",
                description: "Robot types, sensors, programming",
                subCategories: {
                    "robotics-concepts": {
                        name: "Robotics Concepts",
                        topics: {
                            "robot-types": { name: "Types of Robots" },
                            "robot-sensors": { name: "Sensors & Actuators" },
                            "kinematics": { name: "Kinematics & Dynamics" },
                            "robot-programming": { name: "Robot Programming" },
                            "ai-robots": { name: "AI in Robotics" },
                        },
                    },
                },
            },
            iot: {
                name: "Internet of Things (IoT)",
                icon: "🌐",
                description: "Smart devices, sensors, protocols",
                subCategories: {
                    "iot-concepts": {
                        name: "IoT Concepts",
                        topics: {
                            "iot-basics": { name: "IoT Basics & Architecture" },
                            "smart-home": { name: "Smart Home Devices" },
                            "iot-protocols": { name: "IoT Protocols (MQTT, CoAP)" },
                            "edge-computing": { name: "Edge Computing" },
                            "iot-security": { name: "IoT Security" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 33. WORLD RELIGIONS & SPIRITUAL STUDIES
    // ─────────────────────────────────────────────
    "world-religions": {
        name: "World Religions & Spirituality",
        icon: "🕊️",
        description: "Hinduism, Islam, Christianity, Buddhism, Sikhism",
        gradient: "from-yellow-400 to-amber-600",
        categories: {
            "eastern-religions": {
                name: "Eastern Religions",
                icon: "☸️",
                description: "Hinduism, Buddhism, Jainism, Sikhism",
                subCategories: {
                    "indian-religions": {
                        name: "Indian Religions",
                        topics: {
                            "hinduism": { name: "Hinduism — Core Beliefs" },
                            "buddhism": { name: "Buddhism — Teachings & Schools" },
                            "jainism": { name: "Jainism" },
                            "sikhism": { name: "Sikhism" },
                            "zoroastrianism": { name: "Zoroastrianism (Parsi)" },
                            "muslim": { name: "Muslim" },
                            "christianity": { name: "Christianity" },
                            "judaism": { name: "Judaism" },
                        },
                    },
                },
            },
            "western-religions": {
                name: "Western Religions",
                icon: "✝️",
                description: "Christianity, Islam, Judaism",
                subCategories: {
                    "abrahamic-religions": {
                        name: "Abrahamic Traditions",
                        topics: {
                            "christianity": { name: "Christianity" },
                            "islam": { name: "Islam" },
                            "judaism": { name: "Judaism" },
                            "comparative-religion": { name: "Comparative Religion" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 34. TRIVIA & FUN QUIZZES
    // ─────────────────────────────────────────────
    "trivia-fun": {
        name: "Trivia & Fun Quizzes",
        icon: "🎉",
        description: "Pop culture, movies, sports trivia, brain teasers",
        gradient: "from-pink-400 to-red-500",
        categories: {
            "pop-culture": {
                name: "Pop Culture",
                icon: "🎬",
                description: "Movies, TV shows, music, memes",
                subCategories: {
                    "entertainment": {
                        name: "Entertainment Trivia",
                        topics: {
                            "bollywood-trivia": { name: "Bollywood Trivia" },
                            "hollywood-trivia": { name: "Hollywood Trivia" },
                            "tv-shows": { name: "TV Shows & Web Series" },
                            "music-trivia": { name: "Music & Artists Trivia" },
                            "meme-culture": { name: "Meme & Internet Culture" },
                        },
                    },
                },
            },
            "sports-trivia": {
                name: "Sports Trivia",
                icon: "🏅",
                description: "Olympics, records, famous athletes",
                subCategories: {
                    "sports-facts": {
                        name: "Sports Facts & Records",
                        topics: {
                            "olympics-trivia": { name: "Olympics Trivia" },
                            "cricket-trivia": { name: "Cricket Trivia" },
                            "football-trivia": { name: "Football Trivia" },
                            "sports-records": { name: "World Sports Records" },
                        },
                    },
                },
            },
            "brain-teasers": {
                name: "Brain Teasers & Riddles",
                icon: "🧩",
                description: "Riddles, lateral thinking, logic puzzles",
                subCategories: {
                    "puzzles-riddles": {
                        name: "Puzzles & Riddles",
                        topics: {
                            "riddles": { name: "Classic Riddles" },
                            "lateral-thinking": { name: "Lateral Thinking Puzzles" },
                            "math-riddles": { name: "Math Riddles" },
                            "optical-illusions": { name: "Optical Illusions" },
                            "word-games": { name: "Word Games" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 35. AGRICULTURE & RURAL DEVELOPMENT
    // ─────────────────────────────────────────────
    "agriculture": {
        name: "Agriculture & Rural Development",
        icon: "🌾",
        description: "Crop science, soil, irrigation, schemes",
        gradient: "from-lime-600 to-green-700",
        categories: {
            "crop-science": {
                name: "Crop Science",
                icon: "🌱",
                description: "Soil, seeds, cropping systems",
                subCategories: {
                    "agri-basics": {
                        name: "Agriculture Basics",
                        topics: {
                            "soil-science": { name: "Soil Science & Fertility" },
                            "crop-production": { name: "Crop Production Methods" },
                            "irrigation": { name: "Irrigation Methods" },
                            "fertilizers-pesticides": { name: "Fertilizers & Pesticides" },
                            "horticulture": { name: "Horticulture" },
                            "organic-farming": { name: "Organic Farming" },
                        },
                    },
                },
            },
            "rural-development": {
                name: "Rural Development & Policy",
                icon: "🏘️",
                description: "Schemes, cooperatives, rural economy",
                subCategories: {
                    "rural-schemes": {
                        name: "Schemes & Programmes",
                        topics: {
                            "mgnrega": { name: "MGNREGA" },
                            "pm-kisan": { name: "PM-KISAN & Kisan Schemes" },
                            "cooperative-farming": { name: "Cooperative Farming" },
                            "agri-market": { name: "Agricultural Markets (APMC, e-NAM)" },
                            "food-security": { name: "Food Security in India" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 36. PSYCHOLOGY
    // ─────────────────────────────────────────────
    psychology: {
        name: "Psychology",
        icon: "🧠",
        description: "Human behaviour, cognition, disorders, research methods",
        gradient: "from-pink-500 to-rose-600",
        categories: {
            "cognitive-psychology": {
                name: "Cognitive Psychology",
                icon: "💭",
                description: "Memory, perception, thinking, language",
                subCategories: {
                    "cognition-basics": {
                        name: "Cognition Basics",
                        topics: {
                            "memory-types": { name: "Types of Memory" },
                            "attention-perception": { name: "Attention & Perception" },
                            "problem-solving": { name: "Problem Solving & Creativity" },
                            "language-cognition": { name: "Language & Thought" },
                            "cognitive-biases": { name: "Cognitive Biases" },
                            "decision-making": { name: "Decision Making" },
                        },
                    },
                },
            },
            "developmental-psychology": {
                name: "Developmental Psychology",
                icon: "👶",
                description: "Lifespan development, Piaget, Erikson",
                subCategories: {
                    "lifespan-dev": {
                        name: "Lifespan Development",
                        topics: {
                            "piaget-stages": { name: "Piaget's Cognitive Stages" },
                            "erikson-stages": { name: "Erikson's Psychosocial Stages" },
                            "attachment-theory": { name: "Attachment Theory" },
                            "adolescent-development": { name: "Adolescent Development" },
                            "ageing-psychology": { name: "Psychology of Ageing" },
                        },
                    },
                },
            },
            "abnormal-psychology": {
                name: "Abnormal Psychology",
                icon: "🔍",
                description: "Psychological disorders, diagnosis, treatment",
                subCategories: {
                    "disorders": {
                        name: "Psychological Disorders",
                        topics: {
                            "mood-disorders": { name: "Mood Disorders" },
                            "anxiety-disorders": { name: "Anxiety Disorders" },
                            "personality-disorders": { name: "Personality Disorders" },
                            "schizophrenia": { name: "Schizophrenia Spectrum" },
                            "ocd-ptsd": { name: "OCD & PTSD" },
                            "dsm-icd": { name: "DSM & ICD Classification" },
                        },
                    },
                },
            },
            "social-psychology": {
                name: "Social Psychology",
                icon: "👥",
                description: "Influence, conformity, attitudes, group behaviour",
                subCategories: {
                    "social-influence": {
                        name: "Social Influence",
                        topics: {
                            "conformity-obedience": { name: "Conformity & Obedience" },
                            "attitudes-persuasion": { name: "Attitudes & Persuasion" },
                            "group-dynamics": { name: "Group Dynamics" },
                            "prejudice-discrimination": { name: "Prejudice & Discrimination" },
                            "milgram-stanford": { name: "Famous Experiments (Milgram, Stanford)" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 37. ECONOMICS
    // ─────────────────────────────────────────────
    economics: {
        name: "Economics",
        icon: "📊",
        description: "Micro, Macro, Indian Economy, International Trade",
        gradient: "from-cyan-600 to-blue-700",
        categories: {
            microeconomics: {
                name: "Microeconomics",
                icon: "🔬",
                description: "Demand, supply, market structures",
                subCategories: {
                    "market-theory": {
                        name: "Market Theory",
                        topics: {
                            "demand-supply": { name: "Demand & Supply" },
                            "elasticity": { name: "Elasticity" },
                            "consumer-theory": { name: "Consumer Theory" },
                            "production-cost": { name: "Production & Cost" },
                            "market-structures": { name: "Market Structures (Perfect, Monopoly, Oligopoly)" },
                            "factor-markets": { name: "Factor Markets" },
                        },
                    },
                },
            },
            macroeconomics: {
                name: "Macroeconomics",
                icon: "🌐",
                description: "GDP, inflation, fiscal & monetary policy",
                subCategories: {
                    "macro-concepts": {
                        name: "Macro Concepts",
                        topics: {
                            "national-income": { name: "National Income & GDP" },
                            "inflation-deflation": { name: "Inflation & Deflation" },
                            "unemployment": { name: "Unemployment" },
                            "fiscal-policy": { name: "Fiscal Policy" },
                            "monetary-policy-macro": { name: "Monetary Policy" },
                            "business-cycles": { name: "Business Cycles" },
                            "keynes-classical": { name: "Keynesian vs Classical Economics" },
                        },
                    },
                },
            },
            "indian-economy-eco": {
                name: "Indian Economy",
                icon: "🇮🇳",
                description: "Planning, sectors, poverty, reforms",
                subCategories: {
                    "india-economy-topics": {
                        name: "Key Topics",
                        topics: {
                            "five-year-plans": { name: "Five Year Plans & NITI Aayog" },
                            "poverty-inequality-eco": { name: "Poverty & Inequality" },
                            "sectors-economy": { name: "Primary, Secondary & Tertiary Sectors" },
                            "liberalisation-1991": { name: "1991 Liberalisation Reforms" },
                            "banking-rbi": { name: "Banking & RBI" },
                            "balance-of-payments": { name: "Balance of Payments" },
                        },
                    },
                },
            },
            "international-trade": {
                name: "International Trade & Finance",
                icon: "🌍",
                description: "Trade theories, WTO, forex",
                subCategories: {
                    "trade-concepts": {
                        name: "Trade Concepts",
                        topics: {
                            "comparative-advantage": { name: "Comparative Advantage" },
                            "trade-barriers": { name: "Trade Barriers & Tariffs" },
                            "wto-agreements": { name: "WTO & Trade Agreements" },
                            "forex-exchange": { name: "Foreign Exchange" },
                            "globalization-trade": { name: "Globalisation & Trade" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 38. BIOTECHNOLOGY & GENETICS
    // ─────────────────────────────────────────────
    "biotech-genetics": {
        name: "Biotechnology & Genetics",
        icon: "🧬",
        description: "DNA, genetic engineering, CRISPR, bioinformatics",
        gradient: "from-emerald-500 to-teal-700",
        categories: {
            "molecular-genetics": {
                name: "Molecular Genetics",
                icon: "🔬",
                description: "DNA structure, replication, gene expression",
                subCategories: {
                    "dna-rna": {
                        name: "DNA, RNA & Gene Expression",
                        topics: {
                            "dna-structure": { name: "DNA Structure & Replication" },
                            "transcription-translation": { name: "Transcription & Translation" },
                            "mutations": { name: "Mutations & Repair" },
                            "epigenetics": { name: "Epigenetics" },
                            "gene-regulation": { name: "Gene Regulation" },
                        },
                    },
                },
            },
            "genetic-engineering": {
                name: "Genetic Engineering & Biotech",
                icon: "⚗️",
                description: "Recombinant DNA, CRISPR, GMOs",
                subCategories: {
                    "biotech-tools": {
                        name: "Biotechnology Tools",
                        topics: {
                            "recombinant-dna": { name: "Recombinant DNA Technology" },
                            "pcr": { name: "PCR Techniques" },
                            "crispr-cas9": { name: "CRISPR-Cas9" },
                            "gmo": { name: "Genetically Modified Organisms (GMOs)" },
                            "gene-therapy": { name: "Gene Therapy" },
                            "cloning": { name: "Cloning Techniques" },
                        },
                    },
                },
            },
            "bioinformatics": {
                name: "Bioinformatics",
                icon: "💻",
                description: "Genomics, proteomics, databases",
                subCategories: {
                    "computational-biology": {
                        name: "Computational Biology",
                        topics: {
                            "sequence-alignment": { name: "Sequence Alignment" },
                            "genome-databases": { name: "Genomic Databases" },
                            "phylogenetics": { name: "Phylogenetics" },
                            "proteomics": { name: "Proteomics" },
                            "drug-discovery-bio": { name: "Drug Discovery & Biotech" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 39. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
    // ─────────────────────────────────────────────
    "ai-ml": {
        name: "Artificial Intelligence & ML",
        icon: "🤖",
        description: "AI concepts, ML algorithms, deep learning, NLP",
        gradient: "from-violet-600 to-blue-700",
        categories: {
            "ai-fundamentals": {
                name: "AI Fundamentals",
                icon: "🧠",
                description: "AI history, search, knowledge representation",
                subCategories: {
                    "ai-basics": {
                        name: "AI Basics",
                        topics: {
                            "ai-history": { name: "History of AI" },
                            "search-algorithms": { name: "Search Algorithms (BFS, DFS, A*)" },
                            "knowledge-representation": { name: "Knowledge Representation" },
                            "expert-systems": { name: "Expert Systems" },
                            "turing-test": { name: "Turing Test & AI Philosophy" },
                        },
                    },
                },
            },
            "machine-learning": {
                name: "Machine Learning",
                icon: "📈",
                description: "Supervised, unsupervised, reinforcement learning",
                subCategories: {
                    "ml-algorithms": {
                        name: "ML Algorithms",
                        topics: {
                            "supervised-learning": { name: "Supervised Learning" },
                            "unsupervised-learning": { name: "Unsupervised Learning" },
                            "reinforcement-learning": { name: "Reinforcement Learning" },
                            "regression-classification": { name: "Regression & Classification" },
                            "clustering": { name: "Clustering Algorithms" },
                            "model-evaluation": { name: "Model Evaluation & Overfitting" },
                        },
                    },
                },
            },
            "deep-learning": {
                name: "Deep Learning",
                icon: "🔗",
                description: "Neural networks, CNNs, RNNs, transformers",
                subCategories: {
                    "neural-networks": {
                        name: "Neural Networks",
                        topics: {
                            "ann-basics": { name: "Artificial Neural Networks" },
                            "cnn": { name: "Convolutional Neural Networks (CNN)" },
                            "rnn-lstm": { name: "RNN & LSTM" },
                            "transformers": { name: "Transformers & Attention" },
                            "generative-ai": { name: "Generative AI & GANs" },
                            "transfer-learning": { name: "Transfer Learning" },
                        },
                    },
                },
            },
            "nlp": {
                name: "Natural Language Processing",
                icon: "💬",
                description: "Text processing, sentiment analysis, LLMs",
                subCategories: {
                    "nlp-concepts": {
                        name: "NLP Concepts",
                        topics: {
                            "text-preprocessing": { name: "Text Preprocessing" },
                            "word-embeddings": { name: "Word Embeddings" },
                            "sentiment-analysis": { name: "Sentiment Analysis" },
                            "machine-translation": { name: "Machine Translation" },
                            "large-language-models": { name: "Large Language Models (LLMs)" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 40. CYBERSECURITY
    // ─────────────────────────────────────────────
    cybersecurity: {
        name: "Cybersecurity",
        icon: "🔐",
        description: "Network security, ethical hacking, cryptography",
        gradient: "from-slate-600 to-gray-800",
        categories: {
            "network-security": {
                name: "Network Security",
                icon: "🌐",
                description: "Firewalls, VPNs, intrusion detection",
                subCategories: {
                    "network-sec-topics": {
                        name: "Network Security Topics",
                        topics: {
                            "firewalls-ids": { name: "Firewalls & IDS/IPS" },
                            "vpn": { name: "VPNs & Tunnelling" },
                            "network-attacks": { name: "Network Attacks (DDoS, MITM)" },
                            "wireless-security": { name: "Wireless Security" },
                            "network-protocols-sec": { name: "Secure Network Protocols" },
                        },
                    },
                },
            },
            "ethical-hacking": {
                name: "Ethical Hacking & Pen Testing",
                icon: "🕵️",
                description: "Vulnerability assessment, penetration testing",
                subCategories: {
                    "hacking-phases": {
                        name: "Hacking Phases",
                        topics: {
                            "reconnaissance": { name: "Reconnaissance & Footprinting" },
                            "scanning-enumeration": { name: "Scanning & Enumeration" },
                            "exploitation": { name: "Exploitation Basics" },
                            "social-engineering": { name: "Social Engineering" },
                            "web-app-security": { name: "Web Application Security" },
                            "owasp-top10": { name: "OWASP Top 10" },
                        },
                    },
                },
            },
            cryptography: {
                name: "Cryptography",
                icon: "🔑",
                description: "Encryption, hashing, PKI",
                subCategories: {
                    "crypto-concepts": {
                        name: "Cryptography Concepts",
                        topics: {
                            "symmetric-encryption": { name: "Symmetric Encryption (AES, DES)" },
                            "asymmetric-encryption": { name: "Asymmetric Encryption (RSA)" },
                            "hashing": { name: "Hashing Algorithms (SHA, MD5)" },
                            "digital-signatures": { name: "Digital Signatures & Certificates" },
                            "blockchain-crypto": { name: "Blockchain & Cryptography" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 41. DATA SCIENCE & STATISTICS
    // ─────────────────────────────────────────────
    "data-science": {
        name: "Data Science & Statistics",
        icon: "📉",
        description: "Statistics, data analysis, visualization, big data",
        gradient: "from-blue-500 to-cyan-600",
        categories: {
            statistics: {
                name: "Statistics",
                icon: "📊",
                description: "Descriptive, inferential, probability",
                subCategories: {
                    "stats-concepts": {
                        name: "Statistical Concepts",
                        topics: {
                            "descriptive-stats": { name: "Descriptive Statistics" },
                            "probability-theory": { name: "Probability Theory" },
                            "distributions": { name: "Probability Distributions" },
                            "hypothesis-testing": { name: "Hypothesis Testing" },
                            "confidence-intervals": { name: "Confidence Intervals" },
                            "regression-stats": { name: "Regression Analysis" },
                            "anova": { name: "ANOVA" },
                        },
                    },
                },
            },
            "data-analysis": {
                name: "Data Analysis & Visualisation",
                icon: "🗂️",
                description: "Pandas, Excel, charts, dashboards",
                subCategories: {
                    "analysis-tools": {
                        name: "Analysis Tools & Techniques",
                        topics: {
                            "data-cleaning": { name: "Data Cleaning & Preprocessing" },
                            "exploratory-analysis": { name: "Exploratory Data Analysis (EDA)" },
                            "data-visualization-tools": { name: "Data Visualisation (Tableau, Power BI)" },
                            "excel-analysis": { name: "Data Analysis with Excel" },
                            "sql-data": { name: "SQL for Data Analysis" },
                        },
                    },
                },
            },
            "big-data": {
                name: "Big Data Technologies",
                icon: "🗄️",
                description: "Hadoop, Spark, cloud data platforms",
                subCategories: {
                    "big-data-tools": {
                        name: "Big Data Tools",
                        topics: {
                            "hadoop": { name: "Hadoop Ecosystem" },
                            "apache-spark": { name: "Apache Spark" },
                            "data-warehousing": { name: "Data Warehousing" },
                            "nosql": { name: "NoSQL Databases" },
                            "cloud-data-platforms": { name: "Cloud Data Platforms (AWS, GCP, Azure)" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 42. CURRENT AFFAIRS & GK
    // ─────────────────────────────────────────────
    "current-affairs": {
        name: "Current Affairs & GK",
        icon: "🗞️",
        description: "National & international events, awards, schemes",
        gradient: "from-red-500 to-orange-600",
        categories: {
            "national-affairs": {
                name: "National Affairs",
                icon: "🇮🇳",
                description: "India's politics, economy, and society",
                subCategories: {
                    "india-current": {
                        name: "India in Focus",
                        topics: {
                            "govt-policies": { name: "Government Policies & Schemes" },
                            "economy-news": { name: "Economy & Budget Highlights" },
                            "science-tech-india": { name: "Science & Technology — India" },
                            "sports-india": { name: "Sports — India" },
                            "awards-honours": { name: "National Awards & Honours" },
                        },
                    },
                },
            },
            "international-affairs": {
                name: "International Affairs",
                icon: "🌍",
                description: "Global events, diplomacy, organisations",
                subCategories: {
                    "world-events": {
                        name: "World Events",
                        topics: {
                            "global-politics": { name: "Global Politics & Elections" },
                            "un-bodies": { name: "United Nations & Bodies" },
                            "climate-summit": { name: "Climate Summits & COP" },
                            "global-economy-news": { name: "Global Economy News" },
                            "international-awards": { name: "International Awards (Nobel, etc.)" },
                        },
                    },
                },
            },
            "static-gk": {
                name: "Static GK",
                icon: "📚",
                description: "Books, dams, stadiums, national symbols",
                subCategories: {
                    "india-facts": {
                        name: "India Facts",
                        topics: {
                            "national-symbols": { name: "National Symbols of India" },
                            "states-capitals": { name: "States, Capitals & UTs" },
                            "famous-dams-rivers": { name: "Famous Dams & Rivers" },
                            "books-authors": { name: "Books & Authors" },
                            "firsts-india": { name: "Firsts in India" },
                            "stadiums-cities": { name: "Stadiums & Cities" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 43. MEDICAL SCIENCES
    // ─────────────────────────────────────────────
    "medical-sciences": {
        name: "Medical Sciences",
        icon: "🩺",
        description: "Anatomy, pathology, pharmacology, clinical medicine",
        gradient: "from-red-400 to-rose-600",
        categories: {
            anatomy: {
                name: "Human Anatomy",
                icon: "🫀",
                description: "Body systems, organs, tissues",
                subCategories: {
                    "body-systems": {
                        name: "Body Systems",
                        topics: {
                            "skeletal-system": { name: "Skeletal System" },
                            "muscular-system": { name: "Muscular System" },
                            "cardiovascular-system": { name: "Cardiovascular System" },
                            "respiratory-system": { name: "Respiratory System" },
                            "nervous-system": { name: "Nervous System" },
                            "endocrine-system": { name: "Endocrine System" },
                            "digestive-system": { name: "Digestive System" },
                        },
                    },
                },
            },
            pathology: {
                name: "Pathology & Disease",
                icon: "🦠",
                description: "Diseases, infections, diagnostics",
                subCategories: {
                    "disease-concepts": {
                        name: "Disease Concepts",
                        topics: {
                            "infectious-diseases": { name: "Infectious Diseases" },
                            "chronic-diseases": { name: "Chronic Diseases (Diabetes, Hypertension)" },
                            "cancer-oncology": { name: "Cancer & Oncology Basics" },
                            "diagnostic-tests": { name: "Diagnostic Tests & Interpretation" },
                            "immunity-vaccines": { name: "Immunity & Vaccines" },
                        },
                    },
                },
            },
            pharmacology: {
                name: "Pharmacology",
                icon: "💊",
                description: "Drug classes, mechanisms, side effects",
                subCategories: {
                    "drug-basics": {
                        name: "Drug Basics",
                        topics: {
                            "pharmacokinetics": { name: "Pharmacokinetics" },
                            "pharmacodynamics": { name: "Pharmacodynamics" },
                            "antibiotic-classes": { name: "Antibiotic Classes" },
                            "cardiovascular-drugs": { name: "Cardiovascular Drugs" },
                            "analgesics-nsaids": { name: "Analgesics & NSAIDs" },
                            "drug-interactions": { name: "Drug Interactions & Side Effects" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 44. ENVIRONMENTAL SCIENCE & CLIMATE CHANGE
    // ─────────────────────────────────────────────
    "climate-change": {
        name: "Climate Change & Sustainability",
        icon: "🌡️",
        description: "Global warming, renewable energy, sustainable development",
        gradient: "from-lime-500 to-emerald-700",
        categories: {
            "global-warming": {
                name: "Global Warming & Greenhouse Effect",
                icon: "🔥",
                description: "Causes, impacts, tipping points",
                subCategories: {
                    "warming-concepts": {
                        name: "Warming Concepts",
                        topics: {
                            "greenhouse-effect": { name: "Greenhouse Effect" },
                            "carbon-cycle": { name: "Carbon Cycle" },
                            "global-temperature-rise": { name: "Global Temperature Rise" },
                            "polar-ice-melting": { name: "Polar Ice Melting & Sea Level" },
                            "climate-tipping-points": { name: "Climate Tipping Points" },
                        },
                    },
                },
            },
            "renewable-energy": {
                name: "Renewable Energy",
                icon: "⚡",
                description: "Solar, wind, hydro, green hydrogen",
                subCategories: {
                    "energy-types": {
                        name: "Energy Types",
                        topics: {
                            "solar-energy": { name: "Solar Energy" },
                            "wind-energy": { name: "Wind Energy" },
                            "hydropower": { name: "Hydropower" },
                            "green-hydrogen": { name: "Green Hydrogen" },
                            "biomass-energy": { name: "Biomass & Biofuel" },
                            "energy-storage": { name: "Energy Storage Technologies" },
                        },
                    },
                },
            },
            "sustainable-development": {
                name: "Sustainable Development",
                icon: "♻️",
                description: "SDGs, circular economy, green policies",
                subCategories: {
                    "sdg-topics": {
                        name: "SDGs & Green Policies",
                        topics: {
                            "un-sdgs": { name: "UN Sustainable Development Goals" },
                            "paris-agreement": { name: "Paris Agreement" },
                            "circular-economy": { name: "Circular Economy" },
                            "carbon-footprint": { name: "Carbon Footprint & Offsetting" },
                            "green-buildings": { name: "Green Buildings & Infrastructure" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 45. COMPETITIVE EXAMS — BANKING & SSC
    // ─────────────────────────────────────────────
    "banking-ssc": {
        name: "Banking & SSC Preparation",
        icon: "🏦",
        description: "IBPS, SBI, SSC CGL/CHSL — GA, Quant, English",
        gradient: "from-yellow-500 to-amber-700",
        categories: {
            "banking-exams": {
                name: "Banking Exams (IBPS/SBI)",
                icon: "🏧",
                description: "PO, Clerk, RRB — syllabus topics",
                subCategories: {
                    "banking-topics": {
                        name: "Banking Syllabus",
                        topics: {
                            "banking-awareness": { name: "Banking Awareness" },
                            "financial-awareness": { name: "Financial & Economic Awareness" },
                            "rbi-functions": { name: "RBI — Functions & Policies" },
                            "computer-knowledge-bank": { name: "Computer Knowledge (Banking)" },
                            "english-banking": { name: "English for Banking" },
                            "quant-banking": { name: "Quantitative Aptitude — Banking" },
                        },
                    },
                },
            },
            "ssc-exams": {
                name: "SSC Exams (CGL/CHSL/MTS)",
                icon: "📋",
                description: "General Awareness, Reasoning, English, Maths",
                subCategories: {
                    "ssc-topics": {
                        name: "SSC Syllabus",
                        topics: {
                            "ssc-gk": { name: "General Awareness (SSC)" },
                            "ssc-reasoning": { name: "Reasoning (SSC)" },
                            "ssc-english": { name: "English Comprehension (SSC)" },
                            "ssc-maths": { name: "Quantitative Aptitude (SSC)" },
                            "ssc-gs-science": { name: "General Science (SSC)" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 46. MUSIC & PERFORMING ARTS
    // ─────────────────────────────────────────────
    "music-arts": {
        name: "Music & Performing Arts",
        icon: "🎵",
        description: "Indian classical, Western music, dance, theatre",
        gradient: "from-fuchsia-400 to-purple-600",
        categories: {
            "indian-classical-music": {
                name: "Indian Classical Music",
                icon: "🎶",
                description: "Hindustani & Carnatic traditions",
                subCategories: {
                    "hindustani-carnatic": {
                        name: "Hindustani & Carnatic",
                        topics: {
                            "ragas": { name: "Ragas & Their Characteristics" },
                            "talas-rhythm": { name: "Talas & Rhythm" },
                            "gharanas": { name: "Gharanas & Lineages" },
                            "carnatic-basics": { name: "Carnatic Music Basics" },
                            "instruments-india": { name: "Classical Instruments of India" },
                            "famous-musicians": { name: "Legendary Indian Musicians" },
                        },
                    },
                },
            },
            "western-music": {
                name: "Western Music Theory",
                icon: "🎼",
                description: "Notation, chords, music history",
                subCategories: {
                    "music-theory": {
                        name: "Music Theory",
                        topics: {
                            "notes-scales": { name: "Notes, Scales & Keys" },
                            "chords-harmony": { name: "Chords & Harmony" },
                            "music-history-west": { name: "History of Western Music" },
                            "genres": { name: "Music Genres" },
                            "famous-composers": { name: "Famous Composers (Bach, Beethoven, Mozart)" },
                        },
                    },
                },
            },
            "dance-theatre": {
                name: "Dance & Theatre",
                icon: "💃",
                description: "Classical dances, drama, stagecraft",
                subCategories: {
                    "classical-dances": {
                        name: "Classical Indian Dances",
                        topics: {
                            "bharatanatyam": { name: "Bharatanatyam" },
                            "kathak": { name: "Kathak" },
                            "odissi-kuchipudi": { name: "Odissi & Kuchipudi" },
                            "folk-dances": { name: "Folk Dances of India" },
                            "theatre-drama": { name: "Theatre & Drama Basics" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 47. LITERATURE & CREATIVE WRITING
    // ─────────────────────────────────────────────
    "music-arts": {
        name: "Music & Performing Arts",
        icon: "🎵",
        description: "Indian classical, Western music, dance, theatre",
        gradient: "from-fuchsia-400 to-purple-600",
        categories: {
            "indian-classical-music": {
                name: "Indian Classical Music",
                icon: "🎶",
                description: "Hindustani & Carnatic traditions",
                subCategories: {
                    "hindustani-carnatic": {
                        name: "Hindustani & Carnatic",
                        topics: {
                            "ragas": { name: "Ragas & Their Characteristics" },
                            "talas-rhythm": { name: "Talas & Rhythm" },
                            "gharanas": { name: "Gharanas & Lineages" },
                            "carnatic-basics": { name: "Carnatic Music Basics" },
                            "instruments-india": { name: "Classical Instruments of India" },
                            "famous-musicians": { name: "Legendary Indian Musicians" },
                        },
                    },
                },
            },
            "western-music": {
                name: "Western Music Theory",
                icon: "🎼",
                description: "Notation, chords, music history",
                subCategories: {
                    "music-theory": {
                        name: "Music Theory",
                        topics: {
                            "notes-scales": { name: "Notes, Scales & Keys" },
                            "chords-harmony": { name: "Chords & Harmony" },
                            "music-history-west": { name: "History of Western Music" },
                            "genres": { name: "Music Genres" },
                            "famous-composers": { name: "Famous Composers (Bach, Beethoven, Mozart)" },
                        },
                    },
                },
            },
            "dance-theatre": {
                name: "Dance & Theatre",
                icon: "💃",
                description: "Classical dances, drama, stagecraft",
                subCategories: {
                    "classical-dances": {
                        name: "Classical Indian Dances",
                        topics: {
                            "bharatanatyam": { name: "Bharatanatyam" },
                            "kathak": { name: "Kathak" },
                            "odissi-kuchipudi": { name: "Odissi & Kuchipudi" },
                            "folk-dances": { name: "Folk Dances of India" },
                            "theatre-drama": { name: "Theatre & Drama Basics" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 47. LITERATURE & CREATIVE WRITING
    // ─────────────────────────────────────────────
    "literature-writing": {
        name: "Literature & Creative Writing",
        icon: "📖",
        description: "World literature, Indian writings, poetry, fiction",
        gradient: "from-amber-400 to-orange-600",
        categories: {
            "world-literature": {
                name: "World Literature",
                icon: "🌐",
                description: "Classic and modern world literary works",
                subCategories: {
                    "literary-classics": {
                        name: "Literary Classics",
                        topics: {
                            "shakespeare": { name: "Shakespeare — Plays & Sonnets" },
                            "greek-literature": { name: "Greek & Roman Literature" },
                            "modern-novels": { name: "Modern Novels & Authors" },
                            "literary-movements": { name: "Literary Movements (Romanticism, Modernism)" },
                            "nobel-literature": { name: "Nobel Laureates in Literature" },
                        },
                    },
                },
            },
            "indian-literature": {
                name: "Indian Literature",
                icon: "🇮🇳",
                description: "Tagore, Premchand, regional literatures",
                subCategories: {
                    "indian-authors": {
                        name: "Indian Authors & Works",
                        topics: {
                            "tagore": { name: "Rabindranath Tagore" },
                            "premchand": { name: "Munshi Premchand" },
                            "modern-indian-english": { name: "Modern Indian Writing in English" },
                            "regional-literatures": { name: "Regional Literatures (Marathi, Tamil, Bengali)" },
                            "ancient-texts": { name: "Ancient Texts (Ramayana, Mahabharata, Vedas)" },
                        },
                    },
                },
            },
            "creative-writing": {
                name: "Creative Writing",
                icon: "✍️",
                description: "Poetry, fiction, non-fiction techniques",
                subCategories: {
                    "writing-techniques": {
                        name: "Writing Techniques",
                        topics: {
                            "poetry-forms": { name: "Poetry Forms & Devices" },
                            "short-story": { name: "Short Story Writing" },
                            "narrative-techniques": { name: "Narrative Techniques" },
                            "character-development": { name: "Character Development" },
                            "editing-proofreading": { name: "Editing & Proofreading" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 48. NUCLEAR PHYSICS & MODERN PHYSICS
    // ─────────────────────────────────────────────
    "nuclear-modern-physics": {
        name: "Nuclear & Modern Physics",
        icon: "☢️",
        description: "Radioactivity, nuclear reactions, quantum mechanics",
        gradient: "from-yellow-600 to-orange-700",
        categories: {
            "nuclear-physics": {
                name: "Nuclear Physics",
                icon: "⚛️",
                description: "Atomic nucleus, radioactivity, fission & fusion",
                subCategories: {
                    "nuclear-concepts": {
                        name: "Nuclear Concepts",
                        topics: {
                            "nucleus-structure": { name: "Structure of the Nucleus" },
                            "radioactivity": { name: "Radioactivity & Decay" },
                            "nuclear-fission": { name: "Nuclear Fission" },
                            "nuclear-fusion": { name: "Nuclear Fusion" },
                            "nuclear-reactors": { name: "Nuclear Reactors" },
                            "radiation-safety": { name: "Radiation Safety" },
                        },
                    },
                },
            },
            "quantum-mechanics": {
                name: "Quantum Mechanics",
                icon: "🌀",
                description: "Wave-particle duality, Schrödinger, quantum numbers",
                subCategories: {
                    "quantum-concepts": {
                        name: "Quantum Concepts",
                        topics: {
                            "wave-particle-duality": { name: "Wave-Particle Duality" },
                            "schrodinger-equation": { name: "Schrödinger Equation" },
                            "quantum-numbers": { name: "Quantum Numbers" },
                            "uncertainty-principle": { name: "Heisenberg's Uncertainty Principle" },
                            "quantum-entanglement": { name: "Quantum Entanglement" },
                            "photoelectric-effect": { name: "Photoelectric Effect" },
                        },
                    },
                },
            },
            "relativity": {
                name: "Theory of Relativity",
                icon: "🌌",
                description: "Special & general relativity, spacetime",
                subCategories: {
                    "relativity-concepts": {
                        name: "Relativity Concepts",
                        topics: {
                            "special-relativity": { name: "Special Relativity" },
                            "general-relativity": { name: "General Relativity" },
                            "time-dilation": { name: "Time Dilation & Length Contraction" },
                            "mass-energy-equivalence": { name: "E = mc² & Mass-Energy Equivalence" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 49. GEOGRAPHY — ADVANCED
    // ─────────────────────────────────────────────
    "geography-advanced": {
        name: "Advanced Geography",
        icon: "🗺️",
        description: "Physical, human, economic & cartography",
        gradient: "from-teal-500 to-cyan-700",
        categories: {
            "physical-geography": {
                name: "Physical Geography",
                icon: "⛰️",
                description: "Geomorphology, climatology, oceanography",
                subCategories: {
                    "physical-geo-topics": {
                        name: "Physical Geography Topics",
                        topics: {
                            "plate-tectonics": { name: "Plate Tectonics" },
                            "rocks-minerals": { name: "Rocks & Minerals" },
                            "volcanoes-earthquakes": { name: "Volcanoes & Earthquakes" },
                            "ocean-currents": { name: "Ocean Currents" },
                            "atmospheric-layers": { name: "Atmospheric Layers" },
                            "glaciers-ice": { name: "Glaciers & Ice Ages" },
                        },
                    },
                },
            },
            "human-geography": {
                name: "Human Geography",
                icon: "👨👩👧👦",
                description: "Settlement, migration, cultural geography",
                subCategories: {
                    "human-geo-topics": {
                        name: "Human Geography Topics",
                        topics: {
                            "population-distribution": { name: "Population Distribution" },
                            "migration-patterns": { name: "Migration Patterns" },
                            "urbanisation-geo": { name: "Urbanisation" },
                            "cultural-geography": { name: "Cultural Geography" },
                            "geopolitics": { name: "Geopolitics & Borders" },
                        },
                    },
                },
            },
            "economic-geography": {
                name: "Economic Geography",
                icon: "🏭",
                description: "Industries, trade routes, resources",
                subCategories: {
                    "eco-geo-topics": {
                        name: "Economic Geography Topics",
                        topics: {
                            "world-industries": { name: "World Industries & Locations" },
                            "trade-routes": { name: "Major Trade Routes" },
                            "mineral-resources": { name: "Mineral Resources — World" },
                            "agri-geography": { name: "Agricultural Geography" },
                            "transport-geography": { name: "Transport & Communication" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 50. CLOUD COMPUTING & DEVOPS
    // ─────────────────────────────────────────────
    "cloud-devops": {
        name: "Cloud Computing & DevOps",
        icon: "☁️",
        description: "AWS, GCP, Azure, Docker, Kubernetes, CI/CD",
        gradient: "from-sky-500 to-blue-700",
        categories: {
            "cloud-fundamentals": {
                name: "Cloud Fundamentals",
                icon: "🌥️",
                description: "IaaS, PaaS, SaaS, major providers",
                subCategories: {
                    "cloud-basics": {
                        name: "Cloud Basics",
                        topics: {
                            "cloud-service-models": { name: "IaaS, PaaS & SaaS" },
                            "deployment-models": { name: "Cloud Deployment Models" },
                            "aws-core": { name: "AWS Core Services" },
                            "azure-core": { name: "Microsoft Azure Core Services" },
                            "gcp-core": { name: "Google Cloud Platform Basics" },
                            "cloud-security": { name: "Cloud Security" },
                        },
                    },
                },
            },
            devops: {
                name: "DevOps Practices",
                icon: "🔄",
                description: "CI/CD, containers, monitoring",
                subCategories: {
                    "devops-tools": {
                        name: "DevOps Tools & Practices",
                        topics: {
                            "cicd-pipelines": { name: "CI/CD Pipelines" },
                            "docker": { name: "Docker & Containerisation" },
                            "kubernetes": { name: "Kubernetes Orchestration" },
                            "git-version-control": { name: "Git & Version Control" },
                            "infrastructure-as-code": { name: "Infrastructure as Code (Terraform, Ansible)" },
                            "monitoring-logging": { name: "Monitoring & Logging" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 51. ANCIENT INDIAN CIVILISATION & CULTURE
    // ─────────────────────────────────────────────
    "ancient-india-culture": {
        name: "Ancient Indian Civilisation & Culture",
        icon: "🏺",
        description: "Vedic period, art, architecture, science, philosophy",
        gradient: "from-orange-700 to-yellow-600",
        categories: {
            "vedic-ancient": {
                name: "Vedic & Pre-Vedic India",
                icon: "🕉️",
                description: "Indus valley, Vedas, epics",
                subCategories: {
                    "ancient-topics": {
                        name: "Ancient Civilisation Topics",
                        topics: {
                            "harappan-culture": { name: "Harappan / Indus Valley Culture" },
                            "vedas-upanishads": { name: "Vedas & Upanishads" },
                            "mahabharata-ramayana": { name: "Mahabharata & Ramayana" },
                            "sixteen-mahajanapadas": { name: "Sixteen Mahajanapadas" },
                            "maurya-culture": { name: "Mauryan Art & Culture" },
                        },
                    },
                },
            },
            "ancient-science-art": {
                name: "Ancient Indian Science & Art",
                icon: "🔭",
                description: "Contributions in math, astronomy, medicine, art",
                subCategories: {
                    "india-contributions": {
                        name: "Indian Contributions",
                        topics: {
                            "aryabhata-brahmagupta": { name: "Aryabhata & Brahmagupta" },
                            "ayurveda-charaka": { name: "Ayurveda & Charaka Samhita" },
                            "india-art-sculpture": { name: "Ancient Indian Art & Sculpture" },
                            "temple-architecture-ancient": { name: "Temple Architecture Styles" },
                            "ancient-trade": { name: "Ancient Trade & Maritime History" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 52. MEDIA & JOURNALISM
    // ─────────────────────────────────────────────
    "media-journalism": {
        name: "Media & Journalism",
        icon: "📰",
        description: "Mass communication, journalism ethics, media laws",
        gradient: "from-zinc-400 to-gray-700",
        categories: {
            "mass-communication": {
                name: "Mass Communication",
                icon: "📡",
                description: "Media theories, types, audience",
                subCategories: {
                    "communication-theories": {
                        name: "Communication Theories",
                        topics: {
                            "models-communication": { name: "Models of Communication" },
                            "media-effects-theory": { name: "Media Effects Theories" },
                            "agenda-setting": { name: "Agenda Setting Theory" },
                            "public-opinion": { name: "Public Opinion & Media" },
                            "digital-media-evolution": { name: "Evolution of Digital Media" },
                        },
                    },
                },
            },
            "journalism-skills": {
                name: "Journalism Skills",
                icon: "🖊️",
                description: "Reporting, editing, investigative journalism",
                subCategories: {
                    "journo-techniques": {
                        name: "Journalism Techniques",
                        topics: {
                            "news-writing": { name: "News Writing & Inverted Pyramid" },
                            "investigative-journalism": { name: "Investigative Journalism" },
                            "press-photography": { name: "Press Photography & Photojournalism" },
                            "broadcast-journalism": { name: "Broadcast Journalism" },
                            "media-ethics": { name: "Media Ethics & Objectivity" },
                            "press-laws-india": { name: "Press Laws in India" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 53. EARTH SCIENCE & GEOLOGY
    // ─────────────────────────────────────────────
    "earth-science": {
        name: "Earth Science & Geology",
        icon: "🌍",
        description: "Geomorphology, mineralogy, natural disasters",
        gradient: "from-stone-600 to-brown-700",
        categories: {
            geology: {
                name: "Geology",
                icon: "🪨",
                description: "Rock cycle, minerals, geological time",
                subCategories: {
                    "geology-concepts": {
                        name: "Geology Concepts",
                        topics: {
                            "rock-cycle": { name: "Rock Cycle" },
                            "minerals-ores": { name: "Minerals & Ores" },
                            "geological-time-scale": { name: "Geological Time Scale" },
                            "fossil-record": { name: "Fossil Record" },
                            "soil-formation": { name: "Soil Formation" },
                        },
                    },
                },
            },
            "natural-disasters": {
                name: "Natural Disasters",
                icon: "🌪️",
                description: "Earthquakes, cyclones, floods, tsunamis",
                subCategories: {
                    "disaster-types": {
                        name: "Types of Disasters",
                        topics: {
                            "earthquakes-seismic": { name: "Earthquakes & Seismology" },
                            "volcanoes-disaster": { name: "Volcanic Eruptions" },
                            "cyclones-hurricanes": { name: "Cyclones & Hurricanes" },
                            "floods-management": { name: "Floods & Flood Management" },
                            "tsunamis": { name: "Tsunamis" },
                            "drought-desertification": { name: "Drought & Desertification" },
                        },
                    },
                },
            },
            "oceanography-adv": {
                name: "Oceanography",
                icon: "🌊",
                description: "Ocean zones, currents, marine resources",
                subCategories: {
                    "ocean-topics": {
                        name: "Ocean Topics",
                        topics: {
                            "ocean-zones": { name: "Ocean Zones & Depth" },
                            "ocean-currents-adv": { name: "Major Ocean Currents" },
                            "marine-resources": { name: "Marine Resources" },
                            "coral-reefs": { name: "Coral Reefs & Threats" },
                            "ocean-pollution": { name: "Ocean Pollution" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 54. HUMAN RIGHTS & GENDER STUDIES
    // ─────────────────────────────────────────────
    "human-rights-gender": {
        name: "Human Rights & Gender Studies",
        icon: "✊",
        description: "International human rights, gender equality, LGBTQ+",
        gradient: "from-pink-400 to-indigo-600",
        categories: {
            "human-rights": {
                name: "Human Rights",
                icon: "🕊️",
                description: "UDHR, international laws, refugee rights",
                subCategories: {
                    "hr-frameworks": {
                        name: "Human Rights Frameworks",
                        topics: {
                            "udhr": { name: "Universal Declaration of Human Rights" },
                            "iccpr-icescr": { name: "ICCPR & ICESCR Covenants" },
                            "right-to-equality": { name: "Right to Equality" },
                            "refugee-rights": { name: "Refugee Rights (UNHCR)" },
                            "human-rights-india": { name: "Human Rights in India (NHRC)" },
                            "child-rights": { name: "Child Rights (UNCRC)" },
                        },
                    },
                },
            },
            "gender-studies": {
                name: "Gender Studies",
                icon: "⚧️",
                description: "Feminism, gender equality, LGBTQ+ rights",
                subCategories: {
                    "gender-concepts": {
                        name: "Gender Concepts",
                        topics: {
                            "feminism-waves": { name: "Waves of Feminism" },
                            "gender-vs-sex": { name: "Gender vs. Sex" },
                            "lgbtq-rights": { name: "LGBTQ+ Rights & Issues" },
                            "women-empowerment": { name: "Women Empowerment Schemes (India)" },
                            "gender-pay-gap": { name: "Gender Pay Gap" },
                            "patriarchy-society": { name: "Patriarchy & Social Norms" },
                        },
                    },
                },
            },
        },
    },

    // ─────────────────────────────────────────────
    // 55. COMPETITIVE EXAMS — STATE PSC
    // ─────────────────────────────────────────────
    "state-psc": {
        name: "State PSC Preparation",
        icon: "📝",
        description: "MPSC, RPSC, BPSC, UPPCS — History, Polity, Economy",
        gradient: "from-amber-600 to-yellow-700",
        categories: {
            "maharashtra-mpsc": {
                name: "MPSC (Maharashtra)",
                icon: "🦁",
                description: "Maharashtra geography, history, polity, economy",
                subCategories: {
                    "mpsc-topics": {
                        name: "MPSC Key Topics",
                        topics: {
                            "maharashtra-history": { name: "History of Maharashtra" },
                            "maharashtra-geography": { name: "Geography of Maharashtra" },
                            "maharashtra-polity": { name: "Maharashtra Polity & Governance" },
                            "maharashtra-economy": { name: "Maharashtra Economy" },
                            "maharashtra-culture": { name: "Art & Culture of Maharashtra" },
                        },
                    },
                },
            },
            "rajasthan-rpsc": {
                name: "RPSC (Rajasthan)",
                icon: "🏰",
                description: "Rajasthan history, culture, geography, economy",
                subCategories: {
                    "rpsc-topics": {
                        name: "RPSC Key Topics",
                        topics: {
                            "rajasthan-history": { name: "History of Rajasthan" },
                            "rajasthan-geography": { name: "Geography of Rajasthan" },
                            "rajasthan-culture": { name: "Culture & Heritage of Rajasthan" },
                            "rajasthan-economy": { name: "Economy of Rajasthan" },
                        },
                    },
                },
            },
            "general-state-psc": {
                name: "General State PSC Topics",
                icon: "🗂️",
                description: "Common topics across all state PSC exams",
                subCategories: {
                    "common-psc": {
                        name: "Common PSC Topics",
                        topics: {
                            "state-history-gk": { name: "State-wise Historical GK" },
                            "panchayati-raj": { name: "Panchayati Raj System" },
                            "state-economy-basics": { name: "State Economy Basics" },
                            "local-self-govt": { name: "Local Self-Government" },
                            "state-polity": { name: "State Polity & Legislature" },
                        },
                    },
                },
            },
        },
    },
};
