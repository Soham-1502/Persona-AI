export const modulesData = [
  {
    id: "confidencecoach",
    name: "Confidence Coach",
    icon: "Mic",
    submodules: [
      {
        id: "voice",
        name: "Voice Training",
        progress: 80,
        lastActive: "2025-01-20",
      },
      {
        id: "eye",
        name: "Eye Contact",
        progress: 20,
        lastActive: "2025-01-18",
      },
      {
        id: "posture",
        name: "Posture Training",
        progress: 0,
        lastActive: null,
      },
    ],
  },
  {
    id: "inquizzo",
    name: "InQuizzo",
    icon: "Brain",
    submodules: [
      { id: "warmup", name: "Warm-up Quizzes", progress: 100 },
      { id: "timed", name: "Timed Speaking", progress: 40 },
    ],
  },
  {
    id: "microlearning",
    name: "Micro-Learning",
    icon: "GraduationCap",
    submodules: [{ id: "daily", name: "Daily Micro Lessons", progress: 0 }],
  },
  // {
  //   id: "socialmentor",
  //   name: "Social Mentor",
  //   icon: "Users",
  //   submodules: [
  //     { id: "scenario", name: "Conversation Scenarios", progress: 60 },
  //   ],
  // },
];
