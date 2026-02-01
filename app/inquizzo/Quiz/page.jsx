'use client'

import React from "react";
import { useRouter } from "next/navigation";
import {
  Shuffle,
  Target,
  ArrowRight,
  Mic,
  BookOpen,
  Volume2,
} from "lucide-react";

const QuizOptionSelection = () => {
  const router = useRouter();

  const handleRandomQuiz = () => {
    router.push("/inquizzo/RandomQuiz");
  };

  const handleParticularQuiz = () => {
    router.push("/inquizzo/QuizDomainSelection");
  };

  const handleVoiceQuiz = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 rounded-full px-3 py-1">
            <span className="text-yellow-400">⚡</span>
            <span className="text-white font-medium">0</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 rounded-full px-3 py-1">
            <span className="text-white font-medium">Q: 0</span>
          </div>
        </div>
        <h1 className="text-white text-2xl font-bold tracking-wider">
          INQUIZO
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Quiz Mode
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Select your preferred quiz experience and start challenging yourself
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
          {/* Random Questions Option */}
          <div
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleRandomQuiz}
          >
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-2xl border border-gray-600 border-opacity-30 p-8 hover:bg-opacity-60 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shuffle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Random Quiz
                </h3>
                <p className="text-blue-200">Mixed topics for variety</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Questions from various subjects
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Perfect for general knowledge
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Quick start - no setup required
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Surprise yourself with topics
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-medium">
                  Recommended for beginners
                </span>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>

          {/* Particular Questions Option */}
          <div
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleParticularQuiz}
          >
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-2xl border border-gray-600 border-opacity-30 p-8 hover:bg-opacity-60 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Subject Quiz
                </h3>
                <p className="text-blue-200">Focus on specific topics</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Choose your subject and topic
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Targeted learning experience
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Customizable difficulty level
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Deep dive into specializations
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-purple-400 text-sm font-medium">
                  Perfect for focused study
                </span>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>

          {/* Voice Quiz Option */}
          <div
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleVoiceQuiz}
          >
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-2xl border border-gray-600 border-opacity-30 p-8 hover:bg-opacity-60 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Voice Quiz
                </h3>
                <p className="text-blue-200">Speak your way through</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Voice-controlled navigation
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Speak to select domains
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">
                    Answer questions by voice
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">Hands-free experience</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-sm font-medium">
                  Interactive voice mode
                </span>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Domain Selection Method */}
        <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-2xl border border-gray-600 border-opacity-30 p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Domain Selection Methods
            </h3>
            <p className="text-blue-200">
              Choose how you want to select your quiz topics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Manual Selection */}
            <div className="flex items-center space-x-4 bg-gray-700 bg-opacity-30 rounded-lg p-4">
              <div className="w-12 h-12 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Manual Selection</h4>
                <p className="text-gray-300 text-sm">
                  Click and choose from available options
                </p>
              </div>
            </div>

            {/* Voice Selection */}
            <div className="flex items-center space-x-4 bg-gray-700 bg-opacity-30 rounded-lg p-4">
              <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Voice Selection</h4>
                <p className="text-gray-300 text-sm">
                  Say the subject name to select it
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-2xl border border-gray-600 border-opacity-30 p-6">
          <div className="text-center mb-4">
            <Mic className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold mb-2">Voice Commands</h4>
            <p className="text-gray-300 text-sm mb-4">
              Use these voice commands for navigation:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <p className="text-blue-400 font-medium">"Physics"</p>
              <p className="text-gray-400 text-xs">Select Physics domain</p>
            </div>
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <p className="text-blue-400 font-medium">"Biology"</p>
              <p className="text-gray-400 text-xs">Select Biology domain</p>
            </div>
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <p className="text-blue-400 font-medium">"Chemistry"</p>
              <p className="text-gray-400 text-xs">Select Chemistry domain</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Random: Mixed questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span>Subject: Focused topics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Voice: Hands-free mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOptionSelection;
