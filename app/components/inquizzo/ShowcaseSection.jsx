// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const ShowcaseSection = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   const items = [
//     {
//       title: "Home",
//       subtitle: "Welcome to InQuizo",
//       img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
//       link: "/Home",
//     },
//     {
//       title: "Quiz Game",
//       subtitle: "Challenge Your Mind",
//       img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
//       link: "/Quiz",
//     },
//     {
//       title: "MCQ Practice",
//       subtitle: "Test Your Knowledge",
//       img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//       link: "/Mcq",
//     },
//     {
//       title: "Coming Soon",
//       subtitle: "More Features",
//       img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
//       link: "#",
//     },
//   ];

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       {/* Background overlay with blur effect */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
//         <img
//           src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
//           alt="Background"
//           className="w-full h-full object-cover opacity-30"
//         />
//       </div>

//       {/* Navigation Bar */}
//       <nav className="relative z-20 flex justify-between items-center px-8 py-6">
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-lg">📚</span>
//           </div>
//           <span className="text-white text-2xl font-bold">InQuizo</span>
//         </div>
//         <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
//           Buy InQuizo
//         </button>
//       </nav>

//       {/* Main Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
//         <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
//           InQuizo
//         </h1>
//         <h2 className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
//           Voice-Controlled Quiz Platform
//         </h2>
//         <p className="text-lg text-white/80 mb-12 max-w-2xl">
//           Experience the future of learning with our advanced voice-controlled
//           quiz system
//         </p>

//         <Link to="/Quiz">
//           <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
//             View Demo
//           </button>
//         </Link>
//       </div>

//       {/* Feature Cards Section */}
//       <div className="relative z-10 py-20">
//         <div className="container mx-auto px-8">
//           <h3 className="text-3xl font-bold text-white text-center mb-12">
//             Explore InQuizo Features
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {items.map((item, index) => (
//               <Link
//                 to={item.link}
//                 key={index}
//                 className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//               >
//                 <div className="aspect-[4/3] overflow-hidden">
//                   <img
//                     src={item.img}
//                     alt={item.title}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
//                 </div>

//                 <div className="absolute bottom-0 left-0 right-0 p-6">
//                   <h4 className="text-xl font-bold text-white mb-2">
//                     {item.title}
//                   </h4>
//                   <p className="text-white/80 text-sm">{item.subtitle}</p>
//                 </div>

//                 {/* Hover Arrow */}
//                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
//                     <span className="text-white text-lg">→</span>
//                   </div>
//                 </div>

//                 {/* Hover Border Effect */}
//                 <div className="absolute inset-0 border-2 border-green-500/0 group-hover:border-green-500/50 rounded-xl transition-colors duration-300"></div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bottom Wave Effect */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <svg
//           className="w-full h-24 fill-white"
//           viewBox="0 0 1200 120"
//           preserveAspectRatio="none"
//         >
//           <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default ShowcaseSection;
