import React from 'react';
import { Link } from 'react-router-dom';

const HandholdingCard = ({ examName }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-4">Free Handholding Session</h2>
        <p className="text-lg mb-6">Get personalized mentorship and guidance for your {examName} prep. Book a session with our experts today!</p>
        <Link
          to="/contactus"
          className="inline-block px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Book Now
        </Link>
      </div>
      <img
        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=300&h=200"
        alt="Mentorship"
        className="w-48 h-32 object-cover rounded-lg mt-6 md:mt-0"
      />
    </div>
  );
};

export default HandholdingCard;