import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch courses.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token, fetchCourses]);

  return (
    <CourseContext.Provider value={{ courses, setCourses, fetchCourses, isLoading }}>
      {children}
    </CourseContext.Provider>
  );
};