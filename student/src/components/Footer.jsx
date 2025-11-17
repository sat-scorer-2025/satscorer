import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook, FaEye } from 'react-icons/fa6';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(9999);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <footer className="bg-gradient-to-r from-30% from-indigo-200 via-purple-400 to-purple-500 text-purple-900 w-full py-8 sm:py-10 md:py-12 lg:py-16 border-t border-purple-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <img
              src={logo}
              alt="SATScorer Logo"
              className="h-14 sm:h-16 md:h-18 lg:h-20 hover:scale-105 transition-transform duration-200"
            />
            <p className="text-xs sm:text-sm lg:text-base font-sans font-normal text-purple-950/90 leading-relaxed mt-2">
              Empowering students to achieve their academic dreams with personalized test prep and mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4 text-purple-950">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-xs sm:text-sm lg:text-base text-purple-950/90 hover:text-purple-950 hover:underline transition-colors duration-200">Home</Link></li>
              <li><Link to="/courses" className="text-xs sm:text-sm lg:text-base text-purple-950/90 hover:text-purple-950 hover:underline transition-colors duration-200">Courses</Link></li>
              <li><Link to="/aboutus" className="text-xs sm:text-sm lg:text-base text-purple-950/90 hover:text-purple-950 hover:underline transition-colors duration-200">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4 text-purple-950">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/contactus" className="text-xs sm:text-sm lg:text-base text-purple-950/90 hover:text-purple-950 hover:underline transition-colors duration-200">Contact Us</Link></li>
              <li><Link to="/studentdashboard/support" className="text-xs sm:text-sm lg:text-base text-purple-950/90 hover:text-purple-950 hover:underline transition-colors duration-200">Help & Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4 text-purple-950">
              Get in Touch
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm lg:text-base text-purple-950/90">
                Email: <a href="mailto:support@satscorer.com" className="hover:text-purple-950 hover:underline">support@satscorer.com</a>
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-purple-950/90">
                Email: <a href="mailto:satscorer2025@gmail.com" className="hover:text-purple-950 hover:underline">satscorer2025@gmail.com</a>
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-purple-950/90">
                Phone: <a href="tel:7987340207" className="hover:text-purple-950 hover:underline">7987340207</a>
              </p>
              <div className="flex space-x-3 sm:space-x-4 flex-wrap">

                {/* X / Twitter */}
                <a
                  href="https://x.com/Praveen65488161"
                  className="w-9 sm:w-10 lg:w-11 h-9 sm:h-10 lg:h-11 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 text-white hover:text-white transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6" />
                </a>

                {/* LinkedIn */}
                <a
                  href="www.linkedin.com/in/praveen-shrivastava-821bb4233"
                  className="w-9 sm:w-10 lg:w-11 h-9 sm:h-10 lg:h-11 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 text-white hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/praveenshrivastava23"
                  className="w-9 sm:w-10 lg:w-11 h-9 sm:h-10 lg:h-11 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 text-white hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/praveen.shri.144"
                  className="w-9 sm:w-10 lg:w-11 h-9 sm:h-10 lg:h-11 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 text-white hover:text-white transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6" />
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/30 mt-6 sm:mt-8 pt-4 sm:pt-5 text-center">
          <p className="text-2xs sm:text-xs lg:text-sm text-purple-950/90">
            &copy; 2025 SAT Scorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
