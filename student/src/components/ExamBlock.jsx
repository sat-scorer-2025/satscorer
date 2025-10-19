import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

// Import exam images from assets folder
import satImg from '../assets/satlogo.png';
import greImg from '../assets/grelogo.png';
import gmatImg from '../assets/gmatlogo.png';
import ieltsImg from '../assets/ieltslogo.png';

const ExamBlock = () => {
  const exams = [
    {
      name: 'SAT',
      description: 'Prepare for the SAT with comprehensive tests and personalized mentorship.',
      image: satImg,
    },
    {
      name: 'GRE',
      description: 'Ace the GRE with topic-wise and mock tests tailored to your needs.',
      image: greImg,
    },
    {
      name: 'GMAT',
      description: 'Boost your GMAT score with sectional tests and expert guidance.',
      image: gmatImg,
    },
    {
      name: 'IELTS',
      description: 'Excel in IELTS with practice tests and one-on-one mentorship.',
      image: ieltsImg,
    },
  ];

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -256, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 256, behavior: 'smooth' });
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
        rel="stylesheet"
      />
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 bg-white shadow-lg rounded-2xl py-6 sm:py-8 md:py-10 lg:py-12">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-center text-blue-700 font-[Poppins]">
            Ace Your Exam Now
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center text-gray-600 mt-3 sm:mt-4 md:mt-5 mb-6 sm:mb-8 md:mb-10 font-[Poppins] font-medium">
            Explore tailored courses for SAT, GRE, GMAT, and more to achieve your goals.
          </p>
          <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
            <button
              onClick={scrollLeft}
              className="hidden sm:flex text-blue-400 w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center rounded-xl hover:text-blue-500 hover:scale-105 transition-all duration-300 ease-in-out mr-4 sm:mr-6"
              aria-label="Scroll Left"
            >
              ❮
            </button>
            <div
              ref={scrollRef}
              className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 sm:overflow-x-auto overflow-y-hidden sm:scrollbar-hidden w-full"
            >
              <style>{`
                .scrollbar-hidden::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-[1px] flex-none w-full sm:w-60 md:w-64 lg:w-72 sm:max-w-none"
                >
                  <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center text-center h-full hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                    <div className="w-24 sm:w-20 md:w-24 h-24 sm:h-20 md:h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 overflow-hidden">
                      <img src={exam.image} alt={`${exam.name} logo`} className="w-full h-full object-cover rounded-full" />
                    </div>
                    {/* <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-900 mb-2 sm:mb-3 md:mb-4 font-[Poppins]">
                      {exam.name}
                    </h3> */}
                    <div className="hidden sm:block text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4 font-[Poppins] font-normal">
                      {exam.description}
                    </div>
                    <Link
                      to={`/exams/${exam.name.toLowerCase()}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      Explore Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="hidden sm:flex text-blue-400 w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center rounded-xl hover:text-blue-500 hover:scale-105 transition-all duration-300 ease-in-out ml-4 sm:ml-6"
              aria-label="Scroll Right"
            >
              ❯
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExamBlock;