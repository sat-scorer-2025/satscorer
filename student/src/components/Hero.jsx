import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import heroImg from "../assets/gifhat.gif";
import ExamSelectionModal from "../components/ExamSelectionModal";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const handleTryFreeTest = () => (user ? setIsModalOpen(true) : navigate("/login"));
  const handleCloseCard = () => setIsCardVisible(false);

  // Parallax Effect
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("hero-section");
      if (!section) return;
      const scrollY = window.scrollY;
      section.style.backgroundPositionY = `${scrollY * 0.4}px`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);  
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen overflow-hidden flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 via-white to-gray-100"
      style={{
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Background Abstract Static Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Title Section */}
      <div className="relative z-10 text-center mb-6 sm:mb-10 px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-900">
            Your Will & Our Drill
          </span>
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-2 sm:mt-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-blue-500">
            Create the Magic Skill
          </span>
        </h2>
      </div>

      {/* Main Content Row */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-6 sm:gap-10 lg:gap-12">
        {/* Left - Offer Card */}
        {isCardVisible && (
          <div className="w-full lg:w-1/4 order-2 lg:order-1 transform lg:-rotate-6 lg:hover:-rotate-3 transition-transform duration-700 scale-95 sm:scale-100 hidden sm:block">
            <div className="p-4 sm:p-5 rounded-3xl backdrop-blur-lg bg-white/60 border border-white/80 shadow-2xl text-gray-900 z-30 group">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-widest text-indigo-500 font-bold text-xs sm:text-sm">Special Offer</span>
                  <span className="text-[10px] sm:text-xs bg-red-500 text-white rounded-full px-2 py-1 font-bold shadow-md animate-pulse transition-transform group-hover:scale-105">
                    Limited Time
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-sm sm:text-lg font-extrabold text-gray-900 leading-tight">Intensive Vocab & Speed Math</h3>
                  <p className="text-gray-700 mt-1 text-xs sm:text-sm">
                    <span className="line-through text-red-500">₹5,000</span>
                    <span className="font-bold text-base sm:text-xl text-gray-900 ml-1 sm:ml-2">₹2,500</span>
                    <span className="text-gray-500 text-[10px] sm:text-xs block mt-1">/ 3 Months</span>
                  </p>
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors duration-300"
                  onClick={() => navigate("/courses")}
                >
                  Enroll Now
                </button>
                <div className="flex items-center justify-center mt-2 sm:mt-4 border-t pt-2 sm:pt-3 border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-gray-600">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Middle - Body Text */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center space-y-4 sm:space-y-6">
          <p className="text-gray-700 text-base sm:text-lg md:text-xl lg:text-2xl max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            Excel in <span className="font-semibold text-blue-700">SAT, GRE, GMAT</span> and more with personalized study
            plans, expert mentors, and realistic mock tests designed to get you top scores.
          </p>

          {/* Small Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-4 text-gray-600 font-medium text-xs sm:text-sm">
            <p>🎓 20,000+ Students Trained</p>
            <span className="hidden sm:block">•</span>
            <p>👨‍🏫 Trusted by 50+ Expert Mentors</p>
          </div>
        </div>

        {/* Right - Hero Image */}
        <div className="w-full lg:w-1/4 order-3 transform lg:rotate-6 lg:hover:rotate-3 transition-transform duration-700 scale-95 sm:scale-100">
          <div className="relative flex justify-center">
            <img
              src={heroImg}
              alt="SAT Scorer Hero"
              className="w-64 sm:w-80 md:w-96 max-w-full object-contain z-20 relative brightness-110"
              style={{ filter: "brightness(1) contrast(1) saturate(1.5)" }}
            />
          </div>
        </div>
      </div>

      {/* Buttons at Bottom */}
      <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center relative z-10">
        <button
          onClick={() => navigate("/courses")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          Browse Courses
        </button>
        <button
          onClick={handleTryFreeTest}
          className="border-2 border-indigo-600 text-indigo-600 px-6 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          Try Free Test
        </button>
      </div>

      {isModalOpen && <ExamSelectionModal onClose={() => setIsModalOpen(false)} />}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>
    </section>
  );
};

export default Hero;
