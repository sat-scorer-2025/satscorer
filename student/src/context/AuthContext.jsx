import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const isFetchingRef = useRef(false);
  const lastFetchTimestamp = useRef(0);

  const fetchUserProfile = async (token) => {
    if (!token) {
      setAuthError('No authentication token found');
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAuthError(null);
        return data.user;
      } else {
        setAuthError(data.message || 'Failed to fetch user profile');
        return null;
      }
    } catch (error) {
      setAuthError(error.message || 'Network error fetching user profile');
      return null;
    }
  };

  const fetchNotifications = async (token, userId) => {
    if (!token || !userId || !/^[0-9a-fA-F]{24}$/.test(userId) || isFetchingRef.current) {
      console.log('Skipping fetchNotifications: already fetching or invalid input');
      return;
    }
    const now = Date.now();
    if (now - lastFetchTimestamp.current < 1000) {
      return;
    }
    isFetchingRef.current = true;
    lastFetchTimestamp.current = now;
    try {
      const response = await fetch(`${API_URL}/api/notification/notifications`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const inAppNotifications = data.notifications.filter((n) => n.channel === 'in-app' && !n.readBy.includes(userId));
        setNotifications(inAppNotifications);
      } else {
        console.error('Failed to fetch notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
          setAuthError('Invalid authentication token');
          localStorage.removeItem('token');
          setUser(null);
          setNotifications([]);
          setLoading(false);
          return;
        }
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setAuthError('Session expired, please log in again');
          setUser(null);
          setNotifications([]);
          setLoading(false);
          return;
        }
        const profile = await fetchUserProfile(token);
        if (profile) {
          const newUser = {
            userId: decoded.userId,
            email: profile.email,
            role: decoded.role,
            name: profile.name,
            profilePhoto: profile.profilePhoto,
          };
          setUser(newUser);
          setAuthError(null);

          // Fetch notifications after setting user
          fetchNotifications(token, decoded.userId);

          // Initialize Socket.IO only if not already initialized
          if (!socketRef.current) {
            socketRef.current = io(API_URL, {
              auth: { token },
              reconnectionAttempts: 3,
              reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
              socketRef.current.emit('joinRoom', decoded.userId);
            });

            socketRef.current.on('newNotification', (notification) => {
              if (notification.channel === 'in-app' && !notification.readBy.includes(decoded.userId)) {
                setNotifications((prev) => {
                  if (prev.some((n) => String(n._id) === String(notification._id))) {
                    console.log('Skipping duplicate notification:', notification._id);
                    return prev;
                  }
                  console.log('New notification received:', notification);
                  return [notification, ...prev];
                });
              } else {
                console.log('Skipping notification: already read or not in-app', notification._id);
              }
            });

            socketRef.current.on('connect_error', (error) => {
              console.error('Socket connection error:', error.message);
            });
          }
        } else {
          setAuthError('Failed to fetch user profile, please try again');
          setUser(null);
          setNotifications([]);
        }
      } catch (error) {
        setAuthError('Invalid or corrupted token, please log in again');
        setUser(null);
        setNotifications([]);
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
          localStorage.removeItem('token');
          setAuthError('Invalid token received');
          return { success: false, error: 'Invalid token: No userId' };
        }
        const profile = await fetchUserProfile(data.token);
        if (profile) {
          const newUser = {
            userId: decoded.userId,
            email: profile.email,
            role: decoded.role,
            name: profile.name,
            profilePhoto: profile.profilePhoto,
          };
          setUser(newUser);
          setAuthError(null);

          // Fetch notifications after setting user
          fetchNotifications(data.token, decoded.userId);

          // Initialize Socket.IO
          if (!socketRef.current) {
            socketRef.current = io(API_URL, {
              auth: { token: data.token },
              reconnectionAttempts: 3,
              reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
              console.log('Socket.IO connected:', socketRef.current.id);
              socketRef.current.emit('joinRoom', decoded.userId);
            });

            socketRef.current.on('newNotification', (notification) => {
              if (notification.channel === 'in-app' && !notification.readBy.includes(decoded.userId)) {
                setNotifications((prev) => {
                  if (prev.some((n) => String(n._id) === String(notification._id))) {
                    console.log('Skipping duplicate notification:', notification._id);
                    return prev;
                  }
                  console.log('New notification received:', notification);
                  return [notification, ...prev];
                });
              } else {
                console.log('Skipping notification: already read or not in-app', notification._id);
              }
            });

            socketRef.current.on('connect_error', (error) => {
              console.error('Socket connection error:', error.message);
            });
          }

          return { success: true };
        }
        setAuthError('Failed to fetch user profile');
        return { success: false, error: 'Failed to fetch user profile' };
      }
      setAuthError(data.message || 'Login failed');
      return { success: false, error: data.message || 'Login failed' };
    } catch (error) {
      setAuthError('Network error during login');
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (formData, photoFile) => {
    try {
      const data = new FormData();
      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('address', formData.city);
      data.append('dob', formData.dob);
      data.append('exam', formData.course);
      data.append('school', formData.school);
      if (photoFile) data.append('profilePhoto', photoFile);

      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        const decoded = jwtDecode(result.token);
        if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
          localStorage.removeItem('token');
          setAuthError('Invalid token received');
          return { success: false, error: 'Invalid token: No userId' };
        }
        const profile = await fetchUserProfile(result.token);
        if (profile) {
          const newUser = {
            userId: decoded.userId,
            email: profile.email,
            role: decoded.role,
            name: profile.name,
            profilePhoto: profile.profilePhoto,
          };
          setUser(newUser);
          setAuthError(null);

          // Fetch notifications after setting user
          fetchNotifications(result.token, decoded.userId);

          // Initialize Socket.IO
          if (!socketRef.current) {
            socketRef.current = io(API_URL, {
              auth: { token: result.token },
              reconnectionAttempts: 3,
              reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
              console.log('Socket.IO connected:', socketRef.current.id);
              socketRef.current.emit('joinRoom', decoded.userId);
            });

            socketRef.current.on('newNotification', (notification) => {
              if (notification.channel === 'in-app' && !notification.readBy.includes(decoded.userId)) {
                setNotifications((prev) => {
                  if (prev.some((n) => String(n._id) === String(notification._id))) {
                    console.log('Skipping duplicate notification:', notification._id);
                    return prev;
                  }
                  console.log('New notification received:', notification);
                  return [notification, ...prev];
                });
              } else {
                console.log('Skipping notification: already read or not in-app', notification._id);
              }
            });

            socketRef.current.on('connect_error', (error) => {
              console.error('Socket connection error:', error.message);
            });
          }

          return { success: true };
        }
        setAuthError('Failed to fetch user profile');
        return { success: false, error: 'Failed to fetch user profile' };
      }
      setAuthError(result.message || 'Registration failed');
      return { success: false, error: result.message || 'Registration failed' };
    } catch (error) {
      setAuthError('Network error during signup');
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setNotifications([]);
    setAuthError(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const fetchProtected = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('No authentication token found, please log in');
      throw new Error('No authentication token found, please log in');
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setUser(null);
        setNotifications([]);
        setAuthError('Session expired, please log in again');
        throw new Error('Session expired, please log in again');
      }
      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        setAuthError('Unauthorized request, please log in again');
        throw new Error('Unauthorized request, please log in again');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setAuthError('No user or token found for refresh');
      return;
    }
    try {
      const profile = await fetchUserProfile(token);
      if (profile) {
        setUser((prev) => ({
          ...prev,
          name: profile.name,
          profilePhoto: profile.profilePhoto,
          email: profile.email,
        }));
        setAuthError(null);
        fetchNotifications(token, user.userId);
      }
    } catch (error) {
      setAuthError(error.message || 'Failed to refresh user data');
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log('Attempting to mark notification as read:', notificationId);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return { success: false, error: 'No authentication token found' };
      }
      const response = await fetch(`${API_URL}/api/notification/read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Notification marked as read, response:', data);
        setNotifications((prev) => {
          const updated = prev.filter((n) => String(n._id) !== String(notificationId));
          console.log('Previous notifications:', prev);
          console.log('Updated notifications:', updated);
          return [...updated]; // Create a new array to force re-render
        });
        // Fetch notifications to ensure state is in sync with backend
        if (user) {
          setTimeout(() => {
            fetchNotifications(token, user.userId);
          }, 500); // Delay to allow backend to process
        }
        return { success: true, ...data };
      } else {
        console.error('Failed to mark notification as read:', data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      return { success: false, error: error.message };
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      loading,
      fetchProtected,
      refreshUserData,
      authError,
      notifications,
      markNotificationAsRead,
    }),
    [user, loading, authError, notifications]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);