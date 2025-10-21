import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { handlePayment } from '../services/PaymentGateway';
import Footer from '../components/Footer';
import { FaUserGraduate, FaChalkboardTeacher, FaStar, FaAward, FaCalendarAlt, FaClock } from 'react-icons/fa';

// Import local images
import instructorSAT from '../assets/sir.jpg';
import instructorGRE from '../assets/sir.jpg';
import instructorGMAT from '../assets/sir.jpg';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Centralized course data (unchanged)
const courseData = {
  SAT: {
    title: "SAT Mastery: Comprehensive Prep Course",
    description: "Your path to a top SAT score starts here. Master English and Math with expert strategies and extensive practice.",
    about: "This comprehensive SAT course is designed to equip you with the knowledge and test-taking strategies needed to ace the exam. From foundational concepts to advanced problem-solving, our curriculum is built to help you achieve your target score. We focus on breaking down complex topics into simple, understandable lessons and provide you with a wealth of practice questions and mock tests to build confidence.",
    instructorName: "Mr. Praveen Shrivastava",
    instructorBio: "A highly acclaimed education consultant with a Ph.D. in Educational Psychology. Dr. Carter has over 15 years of experience specializing in standardized test preparation and has helped thousands of students get into their dream universities.",
    instructorImage: instructorSAT,
    reviews: [
      { id: 1, name: "Jessica R.", date: "July 12, 2025", rating: 5, comment: "I improved my score by 200 points thanks to this course. The lessons are so clear and easy to follow!" },
      { id: 2, name: "Mark T.", date: "July 20, 2025", rating: 5, comment: "The mock tests were an exact replica of the real exam. I felt completely prepared." },
    ],
    curriculum: [
      { id: 1, title: "Module 1: Reading & Writing Mastery", lessons: ["Lesson 1: Evidence-Based Reading", "Lesson 2: Command of Evidence"] },
      { id: 2, title: "Module 2: Math Concepts & Problem-Solving", lessons: ["Lesson 1: Algebra & Geometry Essentials", "Lesson 2: Advanced Problem-Solving Techniques"] },
    ],
    whatYoullLearn: [
      "Master essential Reading, Writing, and Language skills.",
      "Develop a deep understanding of SAT Math concepts.",
      "Practice with realistic full-length mock tests.",
      "Learn effective time management strategies for exam day."
    ],
    stats: { lessons: 35, duration: "12 Hours", reviews: 650, avgRating: 4.9 },
  },
  GRE: {
    title: "GRE Excellence: Your Key to Grad School",
    description: "Achieve a competitive GRE score with our expert-led course. Focus on Verbal Reasoning, Quantitative Reasoning, and Analytical Writing.",
    about: "Our GRE prep course is meticulously crafted to help you navigate the complexities of the Graduate Record Examinations. We provide in-depth lessons covering all three sections of the exam, along with specialized modules on advanced vocabulary and complex data analysis. The course includes interactive exercises, quizzes, and full-length practice tests to ensure you're ready for test day.",
    instructorName: "Mr. Praveen Shrivastava",
    instructorBio: "A certified GRE instructor with a Master's degree in Statistics from a top university. Sarah has a proven track record of helping students secure admission into prestigious graduate programs worldwide.",
    instructorImage: instructorGRE,
    reviews: [
      { id: 1, name: "David L.", date: "August 5, 2025", rating: 5, comment: "The quantitative section was so well explained. I finally understood concepts I had struggled with before." },
      { id: 2, name: "Emily B.", date: "August 10, 2025", rating: 4, comment: "The course materials are excellent. I just wish there were more video tutorials for the writing section." },
    ],
    curriculum: [
      { id: 1, title: "Module 1: Verbal Reasoning deep dive", lessons: ["Lesson 1: Text Completion & Sentence Equivalence", "Lesson 2: Reading Comprehension Strategies"] },
      { id: 2, title: "Module 2: Quantitative Reasoning Mastery", lessons: ["Lesson 1: Data Interpretation", "Lesson 2: Advanced Algebra and Arithmetic"] },
    ],
    whatYoullLearn: [
      "Improve your vocabulary and analytical writing skills.",
      "Master quantitative reasoning techniques for complex problems.",
      "Receive personalized feedback on your performance.",
      "Practice with adaptive mock tests that simulate the real GRE experience."
    ],
    stats: { lessons: 42, duration: "18 Hours", reviews: 720, avgRating: 4.7 },
  },
  GMAT: {
    title: "GMAT High-Score Accelerator Course",
    description: "Get the GMAT score you need for business school. Our adaptive learning platform tailors your prep to your strengths and weaknesses.",
    about: "Our GMAT course is designed for aspiring business leaders. We use a data-driven approach to help you focus on the most critical areas for improvement. The curriculum is structured to build a strong foundation in Quantitative and Verbal skills, while our mock tests use an adaptive algorithm to simulate the real GMAT experience, providing you with an accurate performance assessment.",
    instructorName: "Mr. Praveen Shrivastava",
    instructorBio: "A GMAT expert and former business school professor. James has helped hundreds of students achieve scores of 700+ and gain admission to top MBA programs worldwide. His teaching focuses on logical reasoning and strategic problem-solving.",
    instructorImage: instructorGMAT,
    reviews: [
      { id: 1, name: "Kevin P.", date: "September 1, 2025", rating: 5, comment: "The course structure is fantastic. I loved how the content adapted based on my performance." },
      { id: 2, name: "Olivia M.", date: "September 8, 2025", rating: 4, comment: "Great content for the price. The practice questions were challenging and perfectly prepared me for the exam." },
    ],
    curriculum: [
      { id: 1, title: "Module 1: Data Sufficiency & Problem Solving", lessons: ["Lesson 1: Quantitative Reasoning Fundamentals", "Lesson 2: Mastering Data Sufficiency"] },
      { id: 2, title: "Module 2: Verbal Reasoning & Integrated Reasoning", lessons: ["Lesson 1: Critical Reasoning", "Lesson 2: Integrated Reasoning & Data Analysis"] },
    ],
    whatYoullLearn: [
      "Develop a deep understanding of GMAT concepts.",
      "Learn to think like a test-maker with advanced strategies.",
      "Simulate the adaptive GMAT experience with our mock tests.",
      "Strengthen your logical and analytical reasoning skills."
    ],
    stats: { lessons: 50, duration: "25 Hours", reviews: 810, avgRating: 4.8 },
  },
};

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isProcessing, setIsProcessing] = useState(false);

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/course/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setCourse(data.course);
        } else {
          setError(data.message || 'Failed to fetch course');
        }
      } catch (err) {
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please log in to purchase this course.');
      navigate('/login');
      return;
    }

    const confirmPurchase = window.confirm(`Ready to start your journey? Buy "${course.title}" for ₹${course.price}.`);
    if (!confirmPurchase) return;

    setIsProcessing(true);
    try {
      const result = await handlePayment(course._id, user.id, course.price);
      if (result && result.message.includes('enrolled')) {
        alert('Payment successful! You are now enrolled. Happy learning!');
        navigate('/studentdashboard/mycourses');
      } else {
        throw new Error('Payment or enrollment failed.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTabClick = (tab, ref) => {
    setActiveTab(tab);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-amber-400 opacity-50" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl font-semibold animate-pulse flex items-center gap-3">
          <FaChalkboardTeacher className="text-indigo-600 animate-spin" /> Loading course details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Something Went Wrong</h2>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <Link
            to="/courses"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold shadow-md"
          >
            Explore Other Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentCourseData = courseData[course.examType.toUpperCase()] || {
    title: course.title,
    description: course.description,
    about: course.about,
    instructorName: "Expert Instructor",
    instructorBio: "A seasoned expert in test preparation.",
    instructorImage: instructorSAT,
    reviews: [],
    curriculum: [],
    whatYoullLearn: [],
    stats: { lessons: 0, duration: "N/A", reviews: 0, avgRating: 0 },
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12">
              <div className="lg:w-2/3">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">{currentCourseData.title}</h1>
                <p className="text-lg md:text-xl text-indigo-100 mb-6">{currentCourseData.description}</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="bg-indigo-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                    <FaChalkboardTeacher /> {course.examType.toUpperCase()}
                  </span>
                  <span className="bg-indigo-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                    <FaClock /> {currentCourseData.stats.duration}
                  </span>
                  <span className="bg-indigo-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                    <FaAward /> {currentCourseData.stats.lessons} Lessons
                  </span>
                  <span className="bg-indigo-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                    <FaStar /> {currentCourseData.stats.avgRating} ({currentCourseData.stats.reviews} reviews)
                  </span>
                </div>
                <button
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                  className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform shadow-lg ${
                    isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-amber-500 hover:scale-105'
                  }`}
                  aria-label={isProcessing ? 'Processing payment' : `Enroll now for ${course.title}`}
                >
                  {isProcessing ? 'Processing...' : `Enroll Now for ₹${course.price}`}
                </button>
              </div>
              <div className="lg:w-1/3 mt-8 lg:mt-0">
                <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Course Price</h3>
                  <div className="text-center text-4xl font-extrabold text-amber-400 mb-6">₹{course.price}</div>
                  <button
                    onClick={handleBuyNow}
                    disabled={isProcessing}
                    className={`w-full px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform shadow-md ${
                      isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-amber-500 hover:scale-105'
                    }`}
                    aria-label={isProcessing ? 'Processing payment' : 'Secure your spot in the course'}
                  >
                    {isProcessing ? 'Processing...' : 'Secure My Spot'}
                  </button>
                  <ul className="text-gray-600 text-sm space-y-3 mt-6">
                    <li className="flex items-center gap-2"><FaCalendarAlt className="text-indigo-600" /> Lifetime Access</li>
                    <li className="flex items-center gap-2"><FaAward className="text-indigo-600" /> Certificate of Completion</li>
                    <li className="flex items-center gap-2"><FaUserGraduate className="text-indigo-600" /> Dedicated Student Support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              {/* Sticky Tabs Navigation */}
              <div className="flex border-b border-gray-200 mb-8 sticky top-16 bg-white z-10 shadow-sm rounded-lg p-2">
                {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab, { Overview: overviewRef, Curriculum: curriculumRef, Instructor: instructorRef, Reviews: reviewsRef }[tab])}
                    className={`flex-1 px-4 py-3 font-semibold text-lg rounded-md transition-all duration-200 ${
                      activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    aria-label={`View ${tab} section`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Section */}
              <div ref={overviewRef} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{currentCourseData.about}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What You'll Achieve</h3>
                <ul className="list-none space-y-3 text-gray-700">
                  {currentCourseData.whatYoullLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaAward className="text-amber-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum Section */}
              <div ref={curriculumRef} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Curriculum</h2>
                <div className="space-y-6">
                  {currentCourseData.curriculum.map((module) => (
                    <div key={module.id} className="border border-purple-200 p-5 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <FaChalkboardTeacher className="text-indigo-600" /> {module.title}
                      </h3>
                      <ul className="list-none space-y-2 text-gray-600">
                        {module.lessons.map((lesson, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <FaClock className="text-gray-400" /> {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Section */}
              <div ref={instructorRef} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Your Instructor</h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={currentCourseData.instructorImage}
                    alt={currentCourseData.instructorName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{currentCourseData.instructorName}</h3>
                    <p className="text-indigo-600 font-medium mb-2">Exam Preparation Expert</p>
                    <p className="text-gray-700 leading-relaxed">{currentCourseData.instructorBio}</p>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div ref={reviewsRef} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Reviews</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex text-xl">{getStarRating(currentCourseData.stats.avgRating)}</div>
                  <span className="text-gray-600 text-lg font-medium">{currentCourseData.stats.avgRating} out of 5</span>
                </div>
                {/* <div className="space-y-6">
                  {currentCourseData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-purple-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-semibold text-gray-900 text-lg">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                        <div className="flex text-base">{getStarRating(review.rating)}</div>
                      </div>
                      <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;