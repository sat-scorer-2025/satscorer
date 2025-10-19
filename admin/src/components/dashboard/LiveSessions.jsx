import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const ActiveLiveSessions = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch sessions
  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/livesession/relevant`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filteredSessions = response.data.sessions.map((session) => {
        const start = new Date(session.scheduledAt);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1hr

        let status = "upcoming";
        if (new Date() >= start && new Date() <= end) status = "live";

        return {
          id: session._id,
          title: session.title,
          instructor: session.instructor || "Unknown",
          time: start,
          status,
        };
      });

      setSessions(filteredSessions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch live sessions");
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLiveSessions();

      // Auto-refresh every 1 minute (so session status updates live)
      const interval = setInterval(fetchLiveSessions, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading live sessions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Active Live Sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-gray-600">No active or upcoming sessions.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                <th className="pb-4">Title</th>
                <th className="pb-4 text-center">Time</th>
                <th className="pb-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-200"
                >
                  <td className="py-3 uppercase">
                  <Link to={`/live/manage`} className="text-blue-600 font-medium hover:underline">
                    {session.title}
                  </Link>
                  </td>
                  <td className="py-3 text-center text-gray-700">
                    {session.time.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        session.status === "live"
                          ? "bg-red-100 text-red-600 font-semibold"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {session.status === "live" ? "LIVE" : "Upcoming"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/courses/manage" className="text-blue-600 hover:underline mt-6 block text-sm font-medium">
        View All
      </Link>
    </div>
  );
};

export default ActiveLiveSessions;
