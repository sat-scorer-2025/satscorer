import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SupportAndFeedback = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/api/support/' : '/api/support/ticket';
        const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data.supportTickets || []);
      } catch (error) {
        toast.error('Failed to fetch support tickets');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    } else {
      setIsLoading(false);
    }
  }, [token, user]);

  // Placeholder for feedback fetch
  useEffect(() => {
    setFeedback([]);
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-16 z-10 bg-white shadow-md">
      <div className="sticky top-16 z-10 bg-gradient-to-r from-blue-900/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Support & Feedback Dashboard</h1>
        <div className="flex border-b border-gray-200 px-6">
          {['supporttickets', 'feedbacks'].map((tab) => (
            <NavLink
              key={tab}
              to={tab}
              className={({ isActive }) =>
                `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
              aria-label={`Select ${tab === 'supporttickets' ? 'Support Tickets' : 'Feedback'} tab`}
            >
              {tab === 'supporttickets' ? 'Support Tickets' : 'Feedback'}
            </NavLink>
          ))}
        </div>
      </div>
      </div>
      <div className="p-4 relative">
        {isLoading ? (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        ) : (
          <Outlet context={{ tickets, setTickets, feedback, setFeedback, isAdmin: user?.role === 'admin' }} />
        )}
      </div>
    </div>
  );
};

export default SupportAndFeedback;