"use client"; // Added to enable hooks (useState, useEffect) in Next.js

import React, { useState, useEffect } from "react";
// Remove react-router-dom imports
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// Add Next.js navigation imports
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import axios from "axios";

const Hero = () => {
  const router = useRouter(); // Use this if you need manual navigation later
  const messages = ["Welcome to InQuizo,", "Fuel Your Mind. Flex Your Voice."];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    // Check if window is defined to avoid errors during SSR
    if (typeof window === "undefined") return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) startTypewriterEffect();
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const getBestVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.name.includes("Google US English")) ||
      voices.find((v) => v.name.includes("Google UK English")) ||
      voices.find((v) => v.name.includes("Zira")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0]
    );
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return resolve();
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getBestVoice();
      utterance.rate = 0.85;
      utterance.pitch = 1.15;
      utterance.volume = 1;
      utterance.lang = "en-US";

      utterance.onend = resolve;
      utterance.onerror = resolve;

      window.speechSynthesis.speak(utterance);
    });
  };

  const typeMessage = async (index) => {
    const message = messages[index];
    setCurrentText("");
    setIsTyping(true);

    const speechPromise = speakText(message);

    for (let i = 0; i <= message.length; i++) {
      setCurrentText(message.slice(0, i));
      await new Promise((r) => setTimeout(r, 85));
    }

    setIsTyping(false);
    await speechPromise;
  };

  const startTypewriterEffect = async () => {
    await typeMessage(0);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentMessageIndex(1);
    await typeMessage(1);
    setAllComplete(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const renderMessage = () => {
    if (currentMessageIndex === 1) {
      return (
        <>
          <div className="text-white mb-1">Welcome to InQuizo</div>
          <span className="text-yellow-400">
            {currentText}
            {(isTyping || !allComplete) && (
              <span
                className={`${
                  showCursor ? "opacity-100" : "opacity-0"
                } transition-opacity duration-150`}
              >
                |
              </span>
            )}
          </span>
        </>
      );
    }

    return (
      <span className="text-white">
        {currentText}
        {(isTyping || !allComplete) && (
          <span
            className={`${
              showCursor ? "opacity-100" : "opacity-0"
            } text-yellow-400 transition-opacity duration-150`}
          >
            |
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="radial-animated-bg min-h-screen flex items-center justify-center text-white text-center px-4 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-[#070e1d] via-[#1b176b] to-[#000000]">
      <div>
        <h1 className="text-6xl text-white md:text-7xl font-bold mb-6 leading-tight font-inter">
          {renderMessage()}
        </h1>

        {allComplete && (
          <div className="animate-fade-in mt-12 flex flex-col items-center space-y-4">
            {/* 🚀 Changed 'to' to 'href' for Next.js Link */}
            <Link href="/inquizzo/Home">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Start Quiz 🚀
              </button>
            </Link>

            {/* 🔐 Changed 'to' to 'href' for Next.js Link */}
            {/* <Link href="/(auth)login">
              <button className="bg-white hover:bg-gray-200 text-black font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                Login 🔐
              </button>
            </Link> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;