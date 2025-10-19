import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token, isLoading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user || !user._id || !token || user.role !== 'admin') {
      return;
    }

    // Initialize socket connection
    const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', user._id);
      console.log('Socket connected, joined room:', user._id);
    });

    newSocket.on('newNotification', (notification) => {
      console.log('Received new notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      toast.info(`${notification.title}: ${notification.message}`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        cause: error.cause,
      });
      toast.error('Failed to connect to notification service');
    });

    setSocket(newSocket);

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notification/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to fetch notifications');
      }
    };

    fetchNotifications();

    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected');
    };
  }, [user, token, isLoading]);

  const addNotification = (notification) => {
    console.log('Adding notification to state:', notification);
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;