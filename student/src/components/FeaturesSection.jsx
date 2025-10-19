import React, { useEffect, useRef } from 'react';
import liveclass from "../assets/Daily.png";
import syllabus from "../assets/practice.png";
import learn from "../assets/Learn.png";

const FeaturesSection = () => {
  const features = [
    {
      title: 'Daily Live Classes',
      description: 'Engage with educators in real-time, ask questions, participate in live polls, and clear your doubts instantly.',
      img: liveclass,
    },
    {
      title: 'Practice and Revise',
      description: 'Boost your learning with our practice section, mock tests, and downloadable lecture notes for anytime revision.',
      img: syllabus,
    },
    {
      title: 'Learn Anytime, Anywhere',
      description: 'Access all live and recorded classes with one subscription, from any device, at your convenience.',
      img: learn,
    },
  ];

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Scroll Animation
  useEffect(() => {
    const handleScroll = () => {
      const cards = cardsRef.current;

      cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight * 0.85) {
          card.classList.add('opacity-100', 'translate-y-0');
          card.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax Tilt Effect (disabled on mobile)
  const handleMouseMove = (e, card) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * 15; // Max tilt 15 degrees
    const tiltY = -(x / rect.width) * 15;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
        rel="stylesheet"
      />
      <section
        ref={sectionRef}
        className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-purple-50 via-white to-indigo-100 relative overflow-hidden backdrop-blur-sm bg-opacity-90"
      >
        {/* Bouncing Balls Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="ball ball-1 hidden md:block"></div>
          <div className="ball ball-2 hidden md:block"></div>
          <div className="ball ball-3"></div>
          <div className="ball ball-4 hidden md:block"></div>
          <div className="ball ball-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {/* Heading */}
          <h2 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-[Poppins] font-extrabold text-center text-indigo-700 mb-8 sm:mb-12 md:mb-16">
            Unlock Your Potential
          </h2>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => (cardsRef.current[index] = el)}
                className="relative bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl p-[1px] opacity-0 translate-y-10 transition-all duration-700 ease-out hover:shadow-xl"
                onMouseMove={(e) => handleMouseMove(e, cardsRef.current[index])}
                onMouseLeave={() => handleMouseLeave(cardsRef.current[index])}
              >
                <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 flex flex-col items-center text-center h-full hover:scale-105 transition-all duration-300 ease-in-out">
                  {/* Image with Accent Border */}
                  <div className="relative w-24 sm:w-28 md:w-32 lg:w-36 h-24 sm:h-28 md:h-32 lg:h-36 mb-4 sm:mb-5 md:mb-6">
                    <div className="absolute inset-0 border-2 border-indigo-200 rounded-full"></div>
                    <img
                      src={feature.img}
                      alt={`${feature.title} Icon`}
                      className='rounded-full'
                      // className="h-px-10 w-px-10 rounded-xl object-contain sm:p-4"
                    />
                  </div>
                  {/* Text Content */}
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-[Poppins] font-bold text-indigo-900 mb-2 sm:mb-3 md:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 md:mb-5 font-[Poppins] font-medium max-w-xs">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom CSS for Parallax Effect and Bouncing Balls Animation */}
        <style>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .ball {
            position: absolute;
            border-radius: 50%;
            animation: bounce 2s infinite ease-in-out;
          }
          .ball-1 {
            width: 10px;
            height: 10px;
            background-color: #4CAF50;
            top: 10%;
            left: 15%;
            animation-delay: 0s;
          }
          .ball-2 {
            width: 8px;
            height: 8px;
            background-color: #2196F3;
            top: 30%;
            left: 70%;
            animation-delay: -0.5s;
          }
          .ball-3 {
            width: 12px;
            height: 12px;
            background-color: #F44336;
            top: 60%;
            left: 25%;
            animation-delay: -1s;
          }
          .ball-4 {
            width: 8px;
            height: 8px;
            background-color: #FF9800;
            top: 50%;
            left: 80%;
            animation-delay: -1.5s;
          }
          .ball-5 {
            width: 10px;
            height: 10px;
            background-color: #9C27B0;
            top: 80%;
            left: 40%;
            animation-delay: -2s;
          }
          @media (max-width: 767px) {
            .ball {
              width: 8px;
              height: 8px;
            }
            .ball-3 {
              width: 10px;
              height: 10px;
            }
            .ball-5 {
              width: 8px;
              height: 8px;
            }
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default FeaturesSection;