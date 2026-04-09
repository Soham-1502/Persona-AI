"use client";

import { Minus as MinusIcon, Plus as PlusIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqAccordion() {
  const [activeItem, setActiveItem] = useState(1);

  // FAQ data
  const faqItems = [
    {
      id: 1,
      question: "What is PersonaAI?",
      answer:
        "PersonaAI is an all-in-one AI platform designed to help students and young professionals improve their confidence, communication, and learning through personalized coaching and insights.",
    },
    {
      id: 2,
      question: "How does the Confidence Coach help me?",
      answer:
        "The Confidence Coach provides real-time practice for communication. You can speak to the AI and receive instant feedback on your tone, delivery style, and overall confidence, helping you prepare for high-stakes situations like interviews or presentations.",
    },
    {
      id: 3,
      question: "What makes InQuizzo different from regular study tools?",
      answer:
        "InQuizzo uses advanced AI to generate dynamic, personalized quizzes that adapt to your specific learning pace and reveal subject mastery. It focuses on identifying and filling your knowledge gaps rather than just rote memorization.",
    },
    {
      id: 4,
      question: "How does Micro-learning help me?",
      answer:
        "Our Micro-learning module delivers bite-sized, personalized lessons designed for high-impact learning in minimal time. You can master complex topics through focused, small sessions that fit perfectly into your busy schedule.",
    },
    {
      id: 5,
      question: "How do I track my progress on the platform?",
      answer:
        "PersonaAI features a dedicated Performance Analytics dashboard where you can visualize your growth, track daily streaks, and see data-backed insights into your improvement across all modules.",
    },
    {
      id: 6,
      question: "Is my personal data secure?",
      answer:
        "Absolutely. We prioritize your privacy and data security. Your interactions and personal growth data are securely stored and used exclusively to enhance your personalized coaching experience.",
    },
  ];

  const toggleItem = (itemId) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <section id="faq" className="py-14 md:py-28 bg-background relative overflow-hidden">
      <div className="wrapper relative z-10">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-bold text-center text-foreground text-4xl md:text-5xl tracking-tight"
          >
            Got Questions? <span className="text-primary">We’ve Got Answers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto leading-relaxed text-muted-foreground text-lg"
          >
            Everything you need to know about PersonaAI and how it can help you become the best version of yourself.
          </motion.p>
        </div>
        <div className="max-w-[700px] mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.id}
                item={item}
                index={index}
                isActive={activeItem === item.id}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
    </section>
  );
}

// FAQ Item Component
function FAQItem({
  item,
  index,
  isActive,
  onToggle,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isActive
          ? "border-primary/30 bg-primary/[0.02] shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]"
          : "border-border/60 hover:border-primary/20 bg-background/50"
        }`}
    >
      <button
        type="button"
        className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors duration-300"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <span className={`text-lg font-semibold transition-colors duration-300 ${isActive ? "text-primary" : "text-foreground"}`}>
          {item.question}
        </span>
        <span className={`flex-shrink-0 ml-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-primary text-primary-foreground rotate-180" : "bg-muted text-muted-foreground"
          }`}>
          {isActive ? <MinusIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-base leading-relaxed text-muted-foreground/90">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

