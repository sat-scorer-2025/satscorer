import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const quotes = [
    "Education is the key to unlocking your potential",
    "Success is where preparation meets opportunity",
    "Your journey to excellence starts here"
  ];

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
          email,
          password,
        });
        if (response.data.message === 'Login successful') {
          setToken(response.data.token);
          setUser(response.data.user);
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else if (mode === 'otp') {
        console.log("API URL:", import.meta.env.VITE_API_URL);

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/request`, { email });
        if (response.data.message === 'OTP sent to your email') {
          setMode('otp-verify');
          setOtpSent(true);
          setResendTimer(90);
          toast.success('OTP sent to your email!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, {
          name,
          email,
          password,
          role: 'admin',
        });
        if (response.data.message === 'User registered successfully') {
          setToken(response.data.token);
          setUser(response.data.user);
          localStorage.setItem('token', response.data.token);
          toast.success('Registration successful!');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const otpString = otp.join('');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
        email,
        otp: otpString,
      });
      if (response.data.message === 'OTP verified successfully') {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        toast.success('OTP verified successfully!');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer === 0) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/request`, { email });
        if (response.data.message === 'OTP sent to your email') {
          setResendTimer(90);
          toast.success('New OTP sent to your email!');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Server error');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {mode === 'login' ? 'Admin Login' : mode === 'otp' ? 'OTP Login' : mode === 'otp-verify' ? 'Verify OTP' : 'Admin Signup'}
        </h1>
        <p className="text-center text-gray-600 italic mb-6">
          "{quotes[Math.floor(Math.random() * quotes.length)]}"
        </p>

        {mode !== 'otp-verify' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            {mode !== 'otp' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
            )}
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              type="submit"
            >
              {mode === 'login' ? 'Login' : mode === 'otp' ? 'Request OTP' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ))}
              </div>
              {otpSent && (
                <p className="text-sm text-gray-600 mt-2">
                  {otp.every(digit => digit) ? 'OTP entered, please verify' : 'Please enter the 6-digit OTP'}
                </p>
              )}
            </div>
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              type="submit"
            >
              Verify OTP
            </button>
            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`text-blue-500 hover:underline text-sm ${resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Resend OTP {resendTimer > 0 ? `(${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')})` : ''}
              </button>
            </div>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              <button
                className="text-blue-500 hover:underline mr-2"
                onClick={() => setMode('otp')}
              >
                Login with OTP
              </button>
              {/* |{' '}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button> */}
            </>
          ) : mode === 'otp' || mode === 'otp-verify' ? (
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setMode('login')}
            >
              Back to Login
            </button>
          ) : (
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setMode('login')}
            >
              Login
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;