import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';  // Assume path is correct
import QuestionDisplay from '../components/StudentDashboard/ViewCourse/QuestionDisplay';  // Assume path

const FreeTest = () => {
  const { examType } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { fetchFreeTests, fetchResult, fetchTestDetails, submitTestResult } = useStudentContext();
  const filterTestType = state?.testType;
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);

  const loadTestData = useCallback(async () => {
    try {
      const freeTests = await fetchFreeTests();
      let matchingTests = freeTests.filter(t => t.examType === examType && t.isFree && (!filterTestType || t.testType === filterTestType));
      if (matchingTests.length === 0) {
        setError(`No Free ${filterTestType ? filterTestType + ' ' : ''}Test Available for ${examType}`);
        return;
      }

      // Shuffle if multiple
      if (matchingTests.length > 1) {
        matchingTests = matchingTests.sort(() => 0.5 - Math.random());
      }

      const selectedTest = matchingTests[0];

      // Check number of attempts
      const results = await fetchResult();
      const attempts = results.filter(result => result.testId._id === selectedTest._id).length;

      if (selectedTest.noOfAttempts && attempts >= selectedTest.noOfAttempts) {
        setAttemptsExceeded(true);
        setTest(selectedTest);  // Set test for review navigation
        return;
      }

      setTest(selectedTest);
      setQuestions(selectedTest.questions || []);

      if (!selectedTest.questions || selectedTest.questions.length === 0) {
        setError('No questions found for this test');
        return;
      }

      // Initialize timeLeft based on test duration
      const storedTime = localStorage.getItem(`timeLeft_${selectedTest._id}`);
      setTimeLeft(storedTime ? parseInt(storedTime, 10) : selectedTest.duration * 60);

      // Load saved answers
      const savedAnswers = localStorage.getItem(`testAnswers_${selectedTest._id}`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (err) {
      setError(err.message || 'Failed to load test data');
    }
  }, [examType, filterTestType, fetchFreeTests, fetchResult]);

  useEffect(() => {
    loadTestData();
  }, [loadTestData]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem(`timeLeft_${test._id}`, newTime);
        if (newTime <= 0) {
          handleAutoSubmit();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, test]);

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answer };
      localStorage.setItem(`testAnswers_${test._id}`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  }, [test]);

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

      const result = await submitTestResult(test._id, answersToSubmit);
      if (result) {
        localStorage.removeItem(`timeLeft_${test._id}`);
        localStorage.removeItem(`testAnswers_${test._id}`);
        navigate(`/free-test-result/${examType}`, { state: { testId: test._id } });
      } else {
        setError('Failed to submit test');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    }
  }, [test, answers, submitTestResult, navigate, examType]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 mb-8">
            <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
            No Free Test Available
          </h1>
          
          {/* Message */}
          <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
            {error}
          </p>
          
          {/* Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (attemptsExceeded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 mb-8">
            <svg className="w-full h-full text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Maximum Limits Reached
          </h1>
          
          {/* Message */}
          <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
            You've completed all available attempts for this test.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => navigate(`/free-test-result/${examType}`, { state: { testId: test._id } })}
              className="px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Review Test
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="text-center text-gray-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Loading test...</p>
      </div>
    );
  }

  return (
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
  );
};

export default FreeTest;