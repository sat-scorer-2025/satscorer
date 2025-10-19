import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PencilSquareIcon, PhotoIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const QuestionBuilder = ({ question, onChange, onDelete, index, onReorder, questionsLength }) => {
  const { token } = useAuth();
  const [type, setType] = useState(question.type || 'mcq');
  const [text, setText] = useState(question.text || '');
  const [options, setOptions] = useState(question.options || [{ text: '' }, { text: '' }]);
  const [correctAnswer, setCorrectAnswer] = useState(
    question.correctAnswer || (question.type === 'checkbox' ? [] : '')
  );
  const [explanation, setExplanation] = useState(question.explanation || '');
  const [image, setImage] = useState(question.image || null);
  const [errors, setErrors] = useState({});

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const validateQuestion = () => {
    const newErrors = {};
    if (!text.trim()) newErrors.text = 'Question text is required';
    if (type === 'mcq' || type === 'checkbox') {
      if (options.length < 2) {
        newErrors.options = 'At least 2 options are required';
      } else if (options.some((opt) => !opt.text.trim())) {
        newErrors.options = 'All options must have non-empty text';
      }
      if (!correctAnswer || (type === 'checkbox' && (!Array.isArray(correctAnswer) || correctAnswer.length === 0))) {
        newErrors.correctAnswer = 'At least one correct answer is required';
      } else if (type === 'checkbox' && Array.isArray(correctAnswer)) {
        if (!correctAnswer.every((ans) => options.some((opt) => opt.text === ans))) {
          newErrors.correctAnswer = 'All correct answers must match option texts';
        }
      } else if (type === 'mcq' && !options.some((opt) => opt.text === correctAnswer)) {
        newErrors.correctAnswer = 'Correct answer must match an option text';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOption = () => {
    setOptions([...options, { text: '' }]);
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], text: value };
    setOptions(newOptions);
    if (type === 'checkbox') {
      setCorrectAnswer((prev) => prev.filter((ans) => newOptions.some((opt) => opt.text === ans)));
    } else if (correctAnswer === options[optionIndex].text) {
      setCorrectAnswer(value);
    }
  };

  const handleOptionClick = (optionIndex) => {
    const newOptions = [...options];
    if (newOptions[optionIndex].text.startsWith('Option ')) {
      newOptions[optionIndex] = { ...newOptions[optionIndex], text: '' };
      setOptions(newOptions);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setImage(res.data.url);
      } catch (err) {
        setErrors({ ...errors, image: 'Failed to upload image' });
      }
    } else {
      setErrors({ ...errors, image: 'Image size must be less than 5MB' });
    }
  };

  const handleOptionImageUpload = async (e, optIndex) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const newOptions = [...options];
        newOptions[optIndex] = { ...newOptions[optIndex], image: res.data.url };
        setOptions(newOptions);
      } catch (err) {
        setErrors({ ...errors, optionImage: 'Failed to upload option image' });
      }
    } else {
      setErrors({ ...errors, optionImage: 'Image size must be less than 5MB' });
    }
  };

  const handleDeleteOption = (optIndex) => {
    const newOptions = options.filter((_, i) => i !== optIndex);
    setOptions(newOptions);
    if (type === 'checkbox') {
      setCorrectAnswer(correctAnswer.filter((ans) => ans !== options[optIndex].text));
    } else if (correctAnswer === options[optIndex].text) {
      setCorrectAnswer('');
    }
  };

  const handleCorrectAnswerChange = (optionText) => {
    if (type === 'checkbox') {
      setCorrectAnswer((prev) => {
        if (!Array.isArray(prev)) return [optionText];
        if (prev.includes(optionText)) {
          return prev.filter((ans) => ans !== optionText);
        }
        return [...prev, optionText];
      });
    } else {
      setCorrectAnswer(optionText);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'checkbox') {
      setCorrectAnswer(Array.isArray(correctAnswer) ? correctAnswer : []);
    } else if (newType === 'mcq') {
      setCorrectAnswer(Array.isArray(correctAnswer) && correctAnswer.length > 0 ? correctAnswer[0] : '');
    } else {
      setCorrectAnswer('');
    }
  };

  useEffect(() => {
    if (validateQuestion()) {
      onChange({ type, text, options, correctAnswer, explanation, image });
    }
  }, [type, text, options, correctAnswer, explanation, image]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-semibold text-gray-600 w-24">Question {index + 1}</span>
        <div className="relative flex-1">
          <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter your question"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
              errors.text ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-label={`Question ${index + 1}`}
          />
        </div>
        <div className="flex items-center space-x-4">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id={`question-image-${index}`} />
          <label
            htmlFor={`question-image-${index}`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer text-sm font-semibold"
          >
            <PhotoIcon className="w-5 h-5 mr-2" />
            Add Image
          </label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-48 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 border-gray-300 focus:ring-blue-500"
            aria-label="Question Type"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="short">Short Answer</option>
            <option value="paragraph">Paragraph</option>
          </select>
        </div>
      </div>
      {errors.text && <p className="text-red-500 text-sm mb-4">{errors.text}</p>}
      {errors.image && <p className="text-red-500 text-sm mb-4">{errors.image}</p>}
      {image && <img src={image} alt="Question preview" className="mt-2 max-w-md rounded-md shadow-md mb-4" />}
      {(type === 'mcq' || type === 'checkbox') && (
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Options</label>
          {options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center mt-2 space-x-4">
              <input
                type={type === 'mcq' ? 'radio' : 'checkbox'}
                name={`correct-${question.id}`}
                checked={type === 'checkbox' ? correctAnswer.includes(option.text) : correctAnswer === option.text}
                onChange={() => handleCorrectAnswerChange(option.text)}
                className="text-blue-500 focus:ring-blue-500 h-5 w-5"
                disabled={!option.text.trim()}
              />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                  onClick={() => handleOptionClick(optIndex)}
                  className={`pl-3 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.options ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-label={`Option ${optIndex + 1}`}
                  placeholder={`Option ${optIndex + 1}`}
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleOptionImageUpload(e, optIndex)}
                  className="hidden"
                  id={`option-image-${index}-${optIndex}`}
                />
                <label
                  htmlFor={`option-image-${index}-${optIndex}`}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer text-sm font-semibold"
                >
                  <PhotoIcon className="w-5 h-5 mr-2" />
                  Image
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteOption(optIndex)}
                  className="text-red-500 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              {option.image && <img src={option.image} alt={`Option ${optIndex + 1} preview`} className="ml-3 max-h-10 rounded-md shadow-md" />}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-3 text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-semibold"
          >
            Add Option
          </button>
          {errors.options && <p className="text-red-500 text-sm mt-2">{errors.options}</p>}
          {errors.correctAnswer && <p className="text-red-500 text-sm mt-2">{errors.correctAnswer}</p>}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-2">Answer Explanation (optional)</label>
        <div className="relative">
          <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={4}
            className="pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 border-gray-300 focus:ring-blue-500"
            placeholder="Explain the answer here..."
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => onDelete()}
          className="text-red-600 hover:text-red-800 transition-colors duration-200 font-semibold text-sm flex items-center space-x-2"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Delete</span>
        </button>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => onReorder(index, -1)}
            disabled={index === 0}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:text-gray-400"
            aria-label={`Move question ${index + 1} up`}
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onReorder(index, 1)}
            disabled={index === questionsLength - 1}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:text-gray-400"
            aria-label={`Move question ${index + 1} down`}
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilder;