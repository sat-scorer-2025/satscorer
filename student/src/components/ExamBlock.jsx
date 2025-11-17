import React from 'react';
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
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-[1px] w-full"
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
          </div>
        </div>
      </section>
    </>
  );
};

export default ExamBlock;