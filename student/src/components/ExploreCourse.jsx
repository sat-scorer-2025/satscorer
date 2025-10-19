
 
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import image from "../assets/Explore our courses AI.png";

// const ExploreCourse = () => {
//   const navigate = useNavigate();

//   const [shapeColors, setShapeColors] = useState({
//     triangle: 'bg-indigo-500',
//     circle: 'bg-purple-400',
//     smallCircle: 'bg-indigo-300',
//   });

//   const handleShapeClick = (shape) => {
//     const colors = ['bg-indigo-500', 'bg-purple-400', 'bg-indigo-300'];
//     const currentColor = shapeColors[shape];
//     const currentIndex = colors.indexOf(currentColor);
//     const nextIndex = (currentIndex + 1) % colors.length;
//     setShapeColors({
//       ...shapeColors,
//       [shape]: colors[nextIndex],
//     });
//   };

//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
//         rel="stylesheet"
//       />
      
//       <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-100 py-16 sm:py-20 md:py-24 relative overflow-hidden">
//         {/* Geometric Background Shapes */}
//         <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-200 clip-path-triangle animate-pulse opacity-30"></div>
//         <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-36 sm:h-36 bg-purple-200 rounded-full animate-pulse delay-200 opacity-30"></div>
//         <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-300 clip-path-triangle animate-pulse delay-400 opacity-30"></div>

//         <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 bg-white shadow-xl rounded-3xl py-10 md:py-16 relative">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
//             {/* Left Side: Text and Button */}
//             <div className="flex flex-col items-center md:items-start text-center md:text-left">
//               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[Poppins] mb-4 relative leading-tight animate-fadeInUp">
//                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
//                   Explore Our Courses
//                 </span>
//                 <span className="absolute -bottom-2 left-0 w-3/4 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-underline"></span>
//               </h2>
//               <p className="text-base sm:text-lg text-gray-600 mb-6 font-[Poppins] font-medium animate-fadeInUp delay-300">
//                 Unlock your potential with our expert-led courses.<br className="hidden sm:inline" /> 
//                 Prepare smarter for SAT, GRE, and more!
//               </p>
//               <button
//                 onClick={() => navigate("/courses")}
//                 className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
//               >
//                 Explore Now
//               </button>
//             </div>

//             {/* Right Side: Image with Geometric Elements */}
//             <div className="relative w-full flex items-center justify-center p-4">
//               {/* Image Container */}
//               <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg hover:scale-105 transition-all duration-300">
//                 <img
//                   src={image}
//                   alt="Student studying with books and laptop, surrounded by charts showing progress, highlighting the benefits of SAT Scorer courses"
//                   className="w-full h-auto  max-xl:rounded-2xl object-contain drop-shadow-lg"
//                 />
//               </div>

//               {/* Interactive Geometric Shapes */}
//               <div
//                 className={`absolute top-10 left-0 w-12 h-12 sm:w-16 sm:h-16 ${shapeColors.triangle} clip-path-triangle cursor-pointer animate-spin-slow`}
//                 onClick={() => handleShapeClick('triangle')}
//               ></div>
//               <div
//                 className={`absolute bottom-0 right-10 w-16 h-16 sm:w-20 sm:h-20 ${shapeColors.circle} rounded-full cursor-pointer animate-spin-slow delay-200`}
//                 onClick={() => handleShapeClick('circle')}
//               ></div>
//               <div
//                 className={`absolute top-1/2 right-1/4 w-10 h-10 sm:w-12 sm:h-12 ${shapeColors.smallCircle} rounded-full cursor-pointer animate-spin-slow delay-400`}
//                 onClick={() => handleShapeClick('smallCircle')}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Custom CSS for Animations */}
//         <style>{`
//           .clip-path-triangle {
//             clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
//           }
//           .animate-underline {
//             animation: underline 1.5s ease-in-out forwards;
//           }
//           @keyframes underline {
//             0% { width: 0; }
//             100% { width: 75%; }
//           }
//           .animate-fadeInUp {
//             animation: fadeInUp 0.8s ease-out forwards;
//             opacity: 0;
//           }
//           .animate-fadeInUp.delay-300 {
//             animation-delay: 0.3s;
//           }
//           @keyframes fadeInUp {
//             from {
//               transform: translateY(20px);
//               opacity: 0;
//             }
//             to {
//               transform: translateY(0);
//               opacity: 1;
//             }
//           }
//           .animate-spin-slow {
//             animation: spin-slow 15s linear infinite;
//           }
//           @keyframes spin-slow {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           .animate-pulse {
//             animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//           }
//           @keyframes pulse {
//             0%, 100% {
//               opacity: 0.3;
//             }
//             50% {
//               opacity: 0.7;
//             }
//           }
//         `}</style>
//       </section>
//     </>
//   );
// };

// export default ExploreCourse;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../assets/Explore our courses AI.png";

const ExploreCourse = () => {
  const navigate = useNavigate();

  const [shapeColors, setShapeColors] = useState({
    triangle: 'bg-indigo-500',
    circle: 'bg-purple-400',
    smallCircle: 'bg-indigo-300',
  });

  const handleShapeClick = (shape) => {
    const colors = ['bg-indigo-500', 'bg-purple-400', 'bg-indigo-300'];
    const currentColor = shapeColors[shape];
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setShapeColors({
      ...shapeColors,
      [shape]: colors[nextIndex],
    });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
        rel="stylesheet"
      />
      
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-100 py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Geometric Background Shapes */}
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-200 clip-path-triangle animate-pulse opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-36 sm:h-36 bg-purple-200 rounded-full animate-pulse delay-200 opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-300 clip-path-triangle animate-pulse delay-400 opacity-30"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 bg-white shadow-xl rounded-3xl py-10 md:py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side: Text and Button */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[Poppins] mb-4 relative leading-tight animate-fadeInUp">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Explore Our Courses
                </span>
                <span className="absolute -bottom-2 left-0 w-3/4 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-underline"></span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 font-[Poppins] font-medium animate-fadeInUp delay-300">
                Unlock your potential with our expert-led courses.<br className="hidden sm:inline" /> 
                Prepare smarter for SAT, GRE, and more!
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Explore Now
              </button>
            </div>

            {/* Right Side: Image with Geometric Elements */}
            <div className="relative w-full flex items-center justify-center p-4">
              {/* Image Container */}
              <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <img
                  src={image}
                  alt="Student studying with books and laptop, surrounded by charts showing progress, highlighting the benefits of SAT Scorer courses"
                  className="w-4/5 mx-auto h-auto object-contain drop-shadow-lg transition-all duration-300"
                />
              </div>

              {/* Interactive Geometric Shapes */}
              <div
                className={`absolute top-10 left-0 w-12 h-12 sm:w-16 sm:h-16 ${shapeColors.triangle} clip-path-triangle cursor-pointer animate-spin-slow`}
                onClick={() => handleShapeClick('triangle')}
              ></div>
              <div
                className={`absolute bottom-0 right-10 w-16 h-16 sm:w-20 sm:h-20 ${shapeColors.circle} rounded-full cursor-pointer animate-spin-slow delay-200`}
                onClick={() => handleShapeClick('circle')}
              ></div>
              <div
                className={`absolute top-1/2 right-1/4 w-10 h-10 sm:w-12 sm:h-12 ${shapeColors.smallCircle} rounded-full cursor-pointer animate-spin-slow delay-400`}
                onClick={() => handleShapeClick('smallCircle')}
              ></div>
            </div>
          </div>
        </div>

        {/* Custom CSS for Animations */}
        <style>{`
          .clip-path-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          .animate-underline {
            animation: underline 1.5s ease-in-out forwards;
          }
          @keyframes underline {
            0% { width: 0; }
            100% { width: 75%; }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }
          .animate-fadeInUp.delay-300 {
            animation-delay: 0.3s;
          }
          @keyframes fadeInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-spin-slow {
            animation: spin-slow 15s linear infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default ExploreCourse;