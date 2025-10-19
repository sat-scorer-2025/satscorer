import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [examTypes, setExamTypes] = useState(['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP']);
  const [testTypes, setTestTypes] = useState(['Mock Test', 'Section Test', 'Topic Test']);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setCoursesLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      console.error('Fetch courses error:', err.message, err.response?.data);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  }, [token]);

  const fetchTests = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/test`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(response.data.tests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tests');
      console.error('Fetch tests error:', err.message, err.response?.data);
    }
  }, [token]);

  const updateTest = async (testId, testData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/test/${testId}`, testData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Updated test:', response.data.test);
      setTests((prevTests) =>
        prevTests.map((test) => (test._id === testId ? response.data.test : test))
      );
      return response.data.test;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update test');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        await Promise.all([fetchCourses(), fetchTests()]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        console.error('Fetch data error:', err.message, err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, fetchCourses, fetchTests]);

  const createQuestion = async (questionData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/question`, questionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === questionData.testId
            ? { ...test, questions: [...(test.questions || []), response.data.question] }
            : test
        )
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create question');
    }
  };

  const createQuestions = async (questionsData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/question`, questionsData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newQuestions = response.data.questions || [];
      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === questionsData[0].testId
            ? { ...test, questions: [...(test.questions || []), ...newQuestions] }
            : test
        )
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create questions');
    }
  };

  const updateQuestion = async (questionId, questionData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/question/${questionId}`, questionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests((prevTests) =>
        prevTests.map((test) => {
          if (test.questions?.some((q) => q._id === questionId)) {
            return {
              ...test,
              questions: test.questions.map((q) => (q._id === questionId ? response.data.question : q)),
            };
          }
          return test;
        })
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update question');
    }
  };

  const deleteQuestion = async (questionId, testId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/question/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === testId ? { ...test, questions: test.questions.filter((q) => q._id !== questionId) } : test
        )
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const fetchQuestions = async (testId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/question/test/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const questions = response.data.questions || [];
      setTests((prevTests) =>
        prevTests.map((test) => (test._id === testId ? { ...test, questions } : test))
      );
      return questions;
    } catch (err) {
      console.error('Error fetching questions:', err.message);
      setTests((prevTests) =>
        prevTests.map((test) => (test._id === testId ? { ...test, questions: [] } : test))
      );
      return [];
    }
  };

  return (
    <TestContext.Provider
      value={{
        courses,
        coursesLoading,
        examTypes,
        testTypes,
        tests,
        loading,
        error,
        createQuestion,
        createQuestions,
        updateQuestion,
        deleteQuestion,
        fetchQuestions,
        fetchTests,
        fetchCourses,
        updateTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export default TestProvider;