import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionDisplay from '../components/StudentDashboard/ViewCourse/QuestionDisplay';
import { useStudentContext } from '../context/StudentContext';
import TestDetails from '../components/StudentDashboard/ViewCourse/TestDetails';

const TakeTest = () => {
  const { enrolledcourseId, testId } = useParams();
  const navigate = useNavigate();
  const { fetchTestDetails, fetchQuestionsForTest, fetchResult, submitTestResult } = useStudentContext();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);

  const loadTestData = useCallback(async () => {
    if (!testId) {
      setError('Invalid test ID');
      return;
    }

    try {
      // Check number of attempts
      const results = await fetchResult();
      const attempts = results.filter(result => result.testId._id === testId).length;
      const testData = await fetchTestDetails(testId);

      if (!testData) {
        setError('Failed to load test details');
        return;
      }

      if (testData.noOfAttempts && attempts >= testData.noOfAttempts) {
        setAttemptsExceeded(true);
        return;
      }

      setTest(testData);
      const questionsData = await fetchQuestionsForTest(testId);
      if (!questionsData || questionsData.length === 0) {
        setError('No questions found for this test');
        return;
      }

      setQuestions(questionsData);

      // Initialize timeLeft based on test duration
      const storedTime = localStorage.getItem(`timeLeft_${testId}`);
      if (storedTime) {
        setTimeLeft(parseInt(storedTime, 10));
      } else {
        setTimeLeft(testData.duration * 60);
      }

      // Load saved answers
      const savedAnswers = localStorage.getItem(`testAnswers_${testId}`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (err) {
      setError(err.message || 'Failed to load test data');
    }
  }, [testId, fetchTestDetails, fetchQuestionsForTest, fetchResult]);

  useEffect(() => {
    loadTestData();
  }, [loadTestData]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showDetails) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem(`timeLeft_${testId}`, newTime);
        if (newTime <= 0) {
          handleAutoSubmit();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testId, showDetails]);

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answer };
      localStorage.setItem(`testAnswers_${testId}`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  }, [testId]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleQuestionClick = useCallback((index) => {
    setCurrentQuestionIndex(index);
  }, []);

  const handleAutoSubmit = useCallback(async () => {
    await handleSubmit();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const answersToSubmit = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const result = await submitTestResult(testId, answersToSubmit);
      if (result) {
        // Clear local storage
        localStorage.removeItem(`timeLeft_${testId}`);
        localStorage.removeItem(`testAnswers_${testId}`);
        navigate(`/testreview/${enrolledcourseId}/${testId}`);
      } else {
        setError('Failed to submit test');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    }
  }, [testId, answers, submitTestResult, navigate, enrolledcourseId]);

  const handleStartTest = () => {
    setShowDetails(false);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">{error}</p>
        <button
          onClick={() => navigate(`/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests`)}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  if (attemptsExceeded) {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Maximum attempts reached for this test.</p>
        <button
          onClick={() => navigate(`/testreview/${enrolledcourseId}/${testId}`)}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Review Test
        </button>
        <button
          onClick={() => navigate(`/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests`)}
          className="mt-4 ml-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  if (!test || !questions || questions.length === 0) {
    return (
      <div className="text-center text-gray-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Loading test...</p>
      </div>
    );
  }

  return (
    <>
      {showDetails ? (
        <TestDetails
          test={test}
          questionsLength={questions.length}
          onStart={handleStartTest}
        />
      ) : (
        <QuestionDisplay
          question={questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answers={answers}
          questions={questions}
          test={test}
          onAnswer={handleAnswer}
          onPrevious={handlePrevious}
          onNext={currentQuestionIndex < questions.length - 1 ? handleNext : null}
          onQuestionClick={handleQuestionClick}
          timeLeft={timeLeft}
          totalDuration={test.duration * 60}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default TakeTest;