import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <img
              src={logo}
              alt="SATScorer Logo"
              className="h-10 sm:h-12 md:h-14 hover:scale-105 transition-transform duration-200"
            />
            <p className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 leading-relaxed mt-2">
              Empowering students to achieve their academic dreams with personalized test prep and mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">Courses</a></li>
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">Tests</a></li>
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">FAQ</a></li>
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300 hover:text-purple-300 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4">
              Get in Touch
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300">
                Email: support@satscorer.com
              </p>
              <p className="text-xs sm:text-sm lg:text-base font-sans font-normal text-gray-300">
                Phone: 7987340207
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="#"
                  className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-purple-700 hover:text-purple-300 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-purple-700 hover:text-purple-300 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/sat_scorer?igsh=dzFueHh0NDd5bGxo&utm_source=qr"
                  className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-purple-700 hover:text-purple-300 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.982-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.618-6.782-6.98-6.982-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-5 lg:pt-6 text-center">
          <p className="text-2xs sm:text-xs lg:text-sm font-sans font-normal text-gray-300">
            &copy; 2025 SAT Scorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;