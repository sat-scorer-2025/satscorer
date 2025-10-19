import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/course`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses);
          setFilteredCourses(data.courses);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (selectedExam !== 'all') {
      filtered = filtered.filter((course) => course.examType.toLowerCase() === selectedExam);
    }
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [selectedExam, searchQuery, courses]);

  const examTypes = ['all', 'sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-gray-800 animate-pulse">Loading Courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-red-600 font-semibold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const featuredCourse = filteredCourses[0];

  return (
    <>
      <div className="-translate-y-16 bg-gray-50 text-gray-900 font-sans mt-16">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center py-32"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=1920&q=80')`,
          }}
        >
          {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-85"></div> */}
          <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-down">
              Master Your Future
            </h1>
            <p className="text-xl md:text-3xl max-w-3xl mx-auto mb-10 animate-fade-in-down delay-200">
              Excel with our expertly crafted SAT, GRE, IELTS, and more courses.
            </p>
            <Link
              to="/courses"
              className="inline-block px-12 py-4 bg-indigo-500 text-white rounded-full font-semibold text-lg hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Discover Courses
            </Link>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Explore Our Courses</h2>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.085l3.16 3.16a.5.5 0 01-.707.707l-3.16-3.16A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
            {examTypes.map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedExam === exam
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {exam === 'all' ? 'All' : exam.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Featured Course */}
          {featuredCourse && (
            <div className="mb-16 border-b border-gray-200 pb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">
                Featured Course
              </h3>
              <div className="flex justify-center">
                <CourseCard
                  course={{
                    id: featuredCourse._id,
                    title: featuredCourse.title,
                    examType: featuredCourse.examType,
                    startDate: featuredCourse.startDate
                      ? new Date(featuredCourse.startDate).toLocaleDateString()
                      : 'TBD',
                    endDate: featuredCourse.endDate
                      ? new Date(featuredCourse.endDate).toLocaleDateString()
                      : 'TBD',
                    price: featuredCourse.price.toString(),
                    thumbnail:
                      featuredCourse.thumbnail || 'https://via.placeholder.com/600x400',
                    about: featuredCourse.about || 'No description available',
                    isFeatured: true,
                  }}
                />
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={course._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CourseCard
                    course={{
                      id: course._id,
                      title: course.title,
                      examType: course.examType,
                      startDate: course.startDate
                        ? new Date(course.startDate).toLocaleDateString()
                        : 'TBD',
                      endDate: course.endDate
                        ? new Date(course.endDate).toLocaleDateString()
                        : 'TBD',
                      price: course.price.toString(),
                      thumbnail: course.thumbnail || 'https://via.placeholder.com/600x400',
                      about: course.about || 'No description available',
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full text-xl font-medium">
                No courses found. Adjust your search or filters.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courses;

