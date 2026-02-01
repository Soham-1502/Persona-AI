'use client'

import React, { useState } from "react";
// Change this import:
import Link from "next/link"; 

const ShowcaseSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const scrollToCards = () => {
    const cardsSection = document.getElementById("cards");
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const items = [
    {
      title: "Quiz Game",
      subtitle: "Challenge Your Mind",
      img: "https://img.freepik.com/free-vector/purple-background-with-quiz-word-colorful-people_52683-126.jpg?t=st=1753267959~exp=1753271559~hmac=ac1f06df21d513125e1acbef9a01e6f987f382258a6ce986fbf20fbeb261f323&w=996",
      link: "/inquizzo/Quiz",
    },
    {
      title: "MCQ Practice",
      subtitle: "Test Your Knowledge",
      img: "https://img.freepik.com/free-vector/flat-university-concept-background_23-2148189717.jpg?t=st=1753268087~exp=1753271687~hmac=8f99379caf53d56b195ca1bf8bd74a255f5bb9068824c75bc42b3c3a1f958a6b&w=996",
      link: "/Mcq",
    },
    {
      title: "Coming Soon",
      subtitle: "More Features",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80",
      link: "#",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <img
          src="https://img.freepik.com/free-photo/young-smiling-man-working-with-laptop-office_1268-21465.jpg?t=st=1753264392~exp=1753267992~hmac=997643843143685a5e2c49dde98e7f89e9604c3cd36c894e005ac889da3dffba&w=1380"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-2"></div>
        <span className="text-white text-1xl hover:scale-110 cursor-pointer transition-all font-bold">InQuizo</span>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight ">
          InQuizo
        </h1>
        <h2 className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
          Voice-Controlled Quiz Platform
        </h2>
        <p className="text-lg text-white/80 mb-12 max-w-2xl">
          Experience the future of learning with our advanced voice-controlled quiz system
        </p>

        <button
          onClick={scrollToCards} 
          className="border-orange-200 bg-purple-600 hover:bg-purple-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View Demo
        </button>
      </div>

      {/* Cards Section */}
      <div id="cards" className="relative z-10 py-20">
        <div className="container mx-auto px-8">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Explore InQuizo Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              /* Use Next.js Link with 'href' instead of 'to' */
              <Link
                href={item.link}
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-white/80 text-sm">{item.subtitle}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-24 fill-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
        </svg>
      </div>
    </div>
  );
};

export default ShowcaseSection;