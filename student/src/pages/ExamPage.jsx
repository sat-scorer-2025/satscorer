import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CourseCard from '../components/CourseCard';
import HandholdingCard from '../components/HandholdingCard';
import { examData } from '../data/examData';

const ExamPage = () => {
  const { examType } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const details = examData[examType?.toLowerCase()] || examData['sat'];

  const reviews = [
    { name: 'Ananya Sharma', rating: 5, comment: 'The SAT course transformed my prep! Scored 1540 and got into UCLA. The mocks were incredibly accurate.' },
    { name: 'Rohan Gupta', rating: 4, comment: 'GRE coaching was excellent, but I needed more practice for Quantitative. Scored 320 overall.' },
    { name: 'Priya Menon', rating: 5, comment: 'IELTS prep helped me achieve band 8.0. The speaking practice sessions were a game-changer!' },
    { name: 'Vikram Singh', rating: 4, comment: 'GMAT Data Insights prep was spot-on, but more mock tests would help. Targeting ISB next.' },
    { name: 'Sneha Patel', rating: 5, comment: 'ACT Science prep was perfect for my CBSE background. Scored 33 and aiming for MIT!' },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses from:', `${API_URL}/api/course/`);
        const response = await fetch(`${API_URL}/api/course/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched courses:', data);

        if (data.courses) {
          const filteredCourses = data.courses.filter(
            (course) => course.examType?.toUpperCase() === examType?.toUpperCase()
          );
          setCourses(filteredCourses);
        } else {
          setError(data.message || 'No courses found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Network error: Unable to connect to the server');
        toast.error(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    if (examType) {
      fetchCourses();
    } else {
      setError('Invalid exam type');
      setLoading(false);
    }
  }, [examType, API_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 font-sans transition-all duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 text-white py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCA0MCBMMTAwIDAgQzE1MCAwIDIwMCA0MCAyMDAgNDAgQzIwMCA0MCAxNTAgNDAgMTAwIDQwIEw0MCA0MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiLz48L3N2Zz4=')] animate-pulse"></div>
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-300 animate-fade-in">
            {details.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-100">{details.overview}</p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-r from-white to-gray-50 transition-all duration-500">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Introduction</h2>
        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto">{details.introduction}</p>
      </section>

      {/* Syllabus Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-white relative before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Syllabus</h2>
        <div className="max-w-4xl mx-auto text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap font-mono">
          {details.syllabus}
        </div>
      </section>

      {/* Exam Pattern Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Exam Pattern</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Format & Time</h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">{details.examPattern}</p>
          </div>
          <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Scoring</h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">{details.examPattern.split(';')[2] || 'Varies by exam'}</p>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Why Take This Exam?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {details.reasons.split(';').map((reason, index) => (
            <div key={index} className="flex items-start p-4 hover:translate-x-2 transition-transform duration-300">
              <div className={`w-3 h-3 ${index % 2 === 0 ? 'bg-blue-600' : 'bg-purple-600'} rounded-full mt-1 mr-3 sm:mr-4 flex-shrink-0`}></div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">{reason.trim()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Aspects Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Key Aspects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {details.keyAspects.split('\n').map((aspect, index) => (
            <div key={index} className="flex items-start p-4 hover:translate-x-2 transition-transform duration-300">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-1 mr-3 sm:mr-4 flex-shrink-0"></div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">{aspect}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preparation Guide Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Preparation Guide</h2>
        <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm">
          <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-4 sm:mb-6">{details.preparation}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base">
              Take Free Practice Test
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base">
              Enroll in Coaching
            </button>
          </div>
        </div>
      </section>

      {/* Important Considerations Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Important Considerations</h2>
        <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-sm">
          <p className="text-sm sm:text-base leading-relaxed text-red-800 mb-4 sm:mb-6">{details.considerations}</p>
          <ul className="list-disc list-inside text-red-700 text-sm sm:text-base space-y-2">
            <li>Registration deadline: 4-6 weeks before exam date.</li>
            <li>Refund policy: Non-refunded after registration.</li>
            <li>Accommodations: Request 7 weeks in advance via official portals.</li>
            <li>ID verification: Passport mandatory for Indian test-takers.</li>
            <li>Test center availability: Confirm in Tier-2 cities like Kochi or Jaipur.</li>
          </ul>
        </div>
      </section>

      {/* Related Courses Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Courses for {details.name}</h2>
        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <svg className="animate-spin mx-auto h-10 sm:h-12 w-10 sm:w-12 text-blue-700 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <p className="text-base sm:text-lg">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">
            <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base sm:text-lg">{error}</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="flex flex-row gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible">
            {courses.map((course, index) => (
              <div
                key={course._id}
                className="flex-none w-72 sm:w-80 snap-center transform hover:scale-105 transition-transform duration-300 md:flex-auto"
              >
                <CourseCard
                  course={{
                    id: course._id,
                    title: course.title,
                    examType: course.examType,
                    startDate: course.startDate ? new Date(course.startDate).toLocaleDateString('en-IN') : 'TBD',
                    endDate: course.endDate ? new Date(course.endDate).toLocaleDateString('en-IN') : 'TBD',
                    price: course.price.toString(),
                    thumbnail: course.thumbnail || 'https://via.placeholder.com/600x400',
                    about: course.about || `Comprehensive preparation for ${details.name}`,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-base sm:text-lg text-gray-600">No courses available for {details.name} at the moment.</p>
            <button
              onClick={() => navigate('/contactus')}
              className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
            >
              Request a Course
            </button>
          </div>
        )}
      </section>

      {/* Student Reviews Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-wide">Student Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-base sm:text-lg mr-3 sm:mr-4">
                  {review.name[0]}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800">{review.name}</h3>
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 2.295a1 0 00.95.69h2.387c.966 0 1.37 1.24.588 1.81l-1.8 1.309a1 0 00-.364 1.118l.845 2.6a1 1 0 01-1.457 1.037l-2.3-.97a1 0 00-1.175 0l-2.3.97a1 1 0 01-1.457-1.037l.845-2.6a1 0 00-.364-1.118l-1.8-1.309c-.782-.57-.388-1.81.588-1.81h2.387a1 0 00.95-.69l1.07-2.295z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Handholding Card Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-r from-blue-800 to-purple-800 text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-cyan-300 after:to-pink-300">
        <HandholdingCard examName={details.name} />
      </section>
    </div>
  );
};

export default ExamPage;