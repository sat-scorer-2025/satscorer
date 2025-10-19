import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TopTests = () => {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/test`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort tests by number of attempts (results array length)
        const sortedTests = response.data.tests
          .map(test => ({
            id: test._id,
            name: test.title,
            attempts: test.results?.length || 0,
            avgScore: test.results?.length > 0 
              ? (test.results.reduce((sum, result) => sum + (result.score || 0), 0) / test.results.length).toFixed(1)
              : 0,
          }))
          .sort((a, b) => b.attempts - a.attempts)
          .slice(0, 5); // Get top 5 tests

        setTests(sortedTests);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tests');
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTopTests();
    }
  }, [token]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading tests...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Top Performing Tests</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
              <th className="pb-4">Test Name</th>
              <th className="pb-4 text-center">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-200">
                <td className="py-3">
                  <Link to={`/tests/manage`} className="text-blue-600 font-medium hover:underline">
                    {test.name}
                  </Link>
                </td>
                <td className="py-3 text-center text-gray-700 font-medium">{test.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/tests/manage" className="text-blue-600 hover:underline mt-6 block text-sm font-medium">
        View All
      </Link>
    </div>
  );
};

export default TopTests;