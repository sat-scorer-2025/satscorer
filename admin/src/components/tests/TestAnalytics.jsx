import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TestContext } from '../../context/TestContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';
import TestResultsTable from './TestResultsTable';

const TestAnalytics = () => {
  const { tests } = useContext(TestContext);
  const { token } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTest, setSelectedTest] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/testresult`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTestResults(response.data.results || []);
      } catch (err) {
        toast.error('Failed to fetch test results');
        setTestResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchTestResults();
    }
  }, [token]);

  const filteredResults = useMemo(() => {
    return testResults.filter((result) => {
      const studentName = (result.userId?.name || result.userId?.email || '').toLowerCase();
      const testName = (result.testId?.title || '').toLowerCase();
      const scoreStr = `${result.score} / ${result.totalScore}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      if (query && !studentName.includes(query) && !testName.includes(query) && !scoreStr.includes(query)) {
        return false;
      }

      const completedAt = new Date(result.completedAt);
      if (startDate && completedAt < startDate) return false;
      if (endDate && completedAt > endDate) return false;
      if (selectedTest && result.testId?._id !== selectedTest) return false;

      return true;
    });
  }, [testResults, searchQuery, startDate, endDate, selectedTest]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this test result?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/testresult/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestResults((prev) => prev.filter((r) => r._id !== id));
      toast.success('Test result deleted successfully');
    } catch (err) {
      toast.error('Failed to delete test result');
    }
  };

  const handleReview = (resultId) => {
    navigate(`/tests/result/${resultId}/review`);
  };

  return (
    <div >
      {/* <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Test Analytics</h2> */}
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedTest={selectedTest}
        setSelectedTest={setSelectedTest}
        tests={tests}
      />
      <TestResultsTable
        results={filteredResults}
        isLoading={isLoading}
        onDelete={handleDelete}
        onReview={handleReview}
      />
    </div>
  );
};

export default TestAnalytics;