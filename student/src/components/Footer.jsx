import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook, FaEye } from 'react-icons/fa6';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(9999);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Generate or retrieve unique visitor ID
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitor_id');
    
    if (!visitorId) {
      // Generate unique ID using timestamp + random string
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    
    return visitorId;
  };

  // Track visitor and get count
  useEffect(() => {
    const trackAndFetchCount = async () => {
      try {
        const visitorId = getVisitorId();

        // Track this visitor
        await fetch(`${API_URL}/api/visitor/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ visitorId }),
        });

        // Fetch total visitor count
        const response = await fetch(`${API_URL}/api/visitor/count`);
        const data = await response.json();
        
        if (data.success) {
          setVisitorCount(data.totalVisitors);
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
      } finally {
        setLoading(false);
      }
    };

    trackAndFetchCount();
  }, []);

  // Animate count from 9999 to actual count
  useEffect(() => {
    if (!loading && visitorCount > 0) {
      const duration = 2000; // 2 seconds animation
      const steps = 60; // 60 frames
      const stepDuration = duration / steps;
      const decrement = (9999 - visitorCount) / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const newCount = Math.max(
          visitorCount,
          Math.floor(9999 - decrement * currentStep)
        );
        setDisplayCount(newCount);
        
        if (newCount <= visitorCount) {
          setDisplayCount(visitorCount);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [loading, visitorCount]);

  // Format number to 4 digits with leading zeros
  const formatNumber = (num) => {
    return num.toString().padStart(4, '0');
  };

  return (
    <footer className="bg-gradient-to-b from-10% from-purple-400 via-purple-300 to-indigo-200 text-white w-full py-8 sm:py-10 md:py-12 lg:py-16 border-t border-purple-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <img
              src={logo}
              alt="SATScorer Logo"
              className="h-14 sm:h-16 md:h-18 lg:h-20 hover:scale-105 transition-transform duration-200"
            />
            <p className="text-xs sm:text-sm lg:text-base font-sans font-normal text-white/90 leading-relaxed mt-2">
              Empowering students to achieve their academic dreams with personalized test prep and mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-xs sm:text-sm lg:text-base text-white/90 hover:text-white hover:underline transition-colors duration-200">Home</Link></li>
              <li><Link to="/courses" className="text-xs sm:text-sm lg:text-base text-white/90 hover:text-white hover:underline transition-colors duration-200">Courses</Link></li>
              <li><Link to="/aboutus" className="text-xs sm:text-sm lg:text-base text-white/90 hover:text-white hover:underline transition-colors duration-200">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4 text-white">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/contactus" className="text-xs sm:text-sm lg:text-base text-white/90 hover:text-white hover:underline transition-colors duration-200">Contact Us</Link></li>
              <li><Link to="/studentdashboard/support" className="text-xs sm:text-sm lg:text-base text-white/90 hover:text-white hover:underline transition-colors duration-200">Help & Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans tracking-tight mb-3 sm:mb-4 text-white">
              Get in Touch
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm lg:text-base text-white/90">
                Email: <a href="mailto:support@satscorer.com" className="hover:text-white hover:underline">support@satscorer.com</a>
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-white/90">
                Phone: <a href="tel:7987340207" className="hover:text-white hover:underline">7987340207</a>
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

        {/* Visitor Counter */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded">
                <FaEye className="text-white text-sm" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">Visitors</span>
                <div className="flex gap-0.5">
                  {loading ? (
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-5 h-7 bg-white/20 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    formatNumber(displayCount).split('').map((digit, index) => (
                      <div
                        key={index}
                        className="w-5 h-7 bg-white rounded flex items-center justify-center shadow-sm"
                      >
                        <span className="text-base font-bold text-indigo-600">
                          {digit}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/30 mt-6 sm:mt-8 pt-4 sm:pt-5 text-center">
          <p className="text-2xs sm:text-xs lg:text-sm text-white/90">
            &copy; 2025 SAT Scorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
