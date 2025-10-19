import React, { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState('details');
  const [timeLeft, setTimeLeft] = useState(null);

  return (
    <TestContext.Provider value={{ answers, setAnswers, currentStep, setCurrentStep, timeLeft, setTimeLeft }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => useContext(TestContext);
