import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import photo from '../assets/sir.jpg'
const AboutUs = () => {
  return (
    <>
      <section className="bg-gray-50 py-12 px-6 md:px-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-100 py-20 rounded-2xl max-w-7xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-blue-600 mb-6 font-serif tracking-tight">
            About SAT Scorer
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Transforming dreams into reality with expert guidance and personalized test preparation for SAT, GRE, GMAT, and IELTS.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="max-w-7xl mx-auto my-16 animate-fade-in-up animation-delay-200">
          <h2 className="text-3xl md:text-4xl font-semibold text-indigo-900 mb-10 text-center font-serif">
            Our Story
          </h2>
          <div className="flex flex-col md:flex-row gap-10 bg-white p-10 rounded-2xl shadow-lg">
            <div className="md:w-1/2">
              <div className="flex items-start mb-8">
                <span className="text-indigo-600 text-3xl mr-4">🎯</span>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Founded in 2020, SAT Scorer was established by Praveen Shrivastava, a seasoned educator with over 25 years of experience in standardized test preparation. Our mission is to empower students to excel in international exams like SAT, GRE, GMAT, and IELTS through personalized study plans and innovative teaching methods.
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-indigo-600 text-3xl mr-4">🌍</span>
                <p className="text-gray-700 text-lg leading-relaxed">
                  With a global perspective from his MS in the USA and experience in the UK, Praveen has guided over 20,000 students worldwide, helping them secure admissions to top universities in the US, UK, and Canada. Our adaptive learning techniques and strategic insights ensure every student reaches their highest potential.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-indigo-600">20,000+</p>
                <p className="text-xl text-gray-600 mt-3">Students Empowered Globally</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto border-t-2 border-gray-200 my-16"></div>

        {/* Mentor Section */}
        <div className="max-w-7xl mx-auto my-16 animate-fade-in-up animation-delay-400">
          <h2 className="text-3xl md:text-4xl font-semibold text-indigo-900 mb-12 text-center font-serif">
            Meet Our Lead Mentor
          </h2>
          <div className="flex justify-center">
            <div className="relative flex flex-col items-center bg-white p-10 rounded-3xl shadow-xl border-t-4 border-indigo-600 hover:scale-105 transition-transform duration-300 max-w-lg">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center mb-6 border-4 border-indigo-100">
                <span className="text-gray-500 text-sm text-center"><img className="rounded-full" src={photo} alt="" /></span>
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900">
                Praveen Shrivastava
              </h3>
              <p className="text-indigo-600 font-medium mt-2">
                Education Consultant & Test Prep Specialist
              </p>
              <p className="text-gray-700 text-center mt-4 leading-relaxed">
                With over 25 years of experience, Praveen Shrivastava specializes in SAT, GRE, GMAT, and IELTS preparation. Holding an MS from the USA, he has tutored at prestigious institutions like UCLA and guided students globally, including in New Jersey and Seattle. His unique teaching methods, including mnemonic-based vocabulary training and strategic test-taking techniques, have helped thousands achieve top scores. Praveen’s engaging oration and personalized coaching make complex concepts accessible, ensuring student success.
              </p>
              <div className="mt-6">
                <a
                  href="tel:+917987340207"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
                >
                  📧 Contact Praveen
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto border-t-2 border-gray-200 my-16"></div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto my-16 text-center animate-fade-in-up animation-delay-600">
          <h2 className="text-3xl md:text-4xl font-semibold text-indigo-900 mb-8 font-serif">
            Ready to Excel in Your Exams?
          </h2>
          <p className="text-gray-700 text-xl mb-10 max-w-3xl mx-auto">
            Join Praveen Shrivastava and SAT Scorer to unlock your potential with tailored guidance and proven strategies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-blue-700 hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
            </Link>
            <Link
              to="/contactus"
              className="border-2 border-indigo-600 text-indigo-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default AboutUs;