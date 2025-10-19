import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId = null;

    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return false;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUser = response.data.user;

        if (!fetchedUser) {
          console.error('No user data in response');
          throw new Error('No user data returned');
        }

        // Normalize user object to ensure _id is used consistently
        setUser({
          ...fetchedUser,
          _id: fetchedUser._id || fetchedUser.id, // Handle id or _id
        });

        // Fetch notifications for admin
        if (fetchedUser.role === 'admin') {
          try {
            const notificationResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/notification/notifications`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notificationResponse.data.notifications || []);
          } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications');
          }
        }

        // Check if user is a student and their status is blocked
        if (fetchedUser.role === 'student' && fetchedUser.status === 'blocked') {
          console.log('Student is blocked, logging out');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setNotifications([]);
          toast.error('Your account has been blocked by the admin. You have been logged out.');
          navigate('/login');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Token verification failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setNotifications([]);

        const errorMessage =
          error.response?.status === 403 && error.response?.data?.message === 'You have been blocked by the admin'
            ? 'Your account has been blocked by the admin. You have been logged out.'
            : 'Session expired or invalid. Please log in again.';
        
        toast.error(errorMessage);
        navigate('/login');
        return false;
      }
    };

    // Initial verification
    verifyToken().then((isValid) => {
      setIsLoading(false);
      if (isValid && token) {
        intervalId = setInterval(async () => {
          try {
            const stillValid = await verifyToken();
            if (!stillValid) {
              console.log('Stopping polling due to invalid user');
              clearInterval(intervalId);
            }
          } catch (error) {
            clearInterval(intervalId);
          }
        }, 30000);
      }
    });

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, navigate]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notification/read/${notificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Mark as read response:', response.data);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      return null;
    }
  };

  const logout = () => {
    console.log('Manual logout triggered');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    setUser,
    token,
    setToken,
    logout,
    isLoading,
    notifications,
    markNotificationAsRead,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);