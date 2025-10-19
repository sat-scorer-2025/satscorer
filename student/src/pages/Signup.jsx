import React, { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    course: '',
    city: '',
    school: '',
    password: '',
    rePassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [serverError, setServerError] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = emailRegex.test(value) ? '' : 'Invalid email format';
    }
    if (name === 'phone') {
      const phoneRegex = /^\d{10,}$/;
      newErrors.phone = phoneRegex.test(value) ? '' : 'Phone number must be at least 10 digits';
    }
    if (name === 'password') {
      newErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
    }
    if (name === 'rePassword') {
      newErrors.rePassword = value === formData.password ? '' : 'Passwords do not match';
    }
    setErrors(newErrors);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0] || (e.dataTransfer && e.dataTransfer.files[0]);
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    handlePhotoUpload(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'rePassword' && key !== 'photo') {
        newErrors[key] = 'This field is required';
      }
    });
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error) && formData.rePassword === formData.password) {
      const { rePassword, ...dataToSend } = formData;
      console.log('Submitting form data:', dataToSend); // Debug form data
      const result = await signup(dataToSend, photoFile);
      if (result.success) {
        navigate('/');
      } else {
        setServerError(result.error);
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-navy-900 text-center mb-6">
          Sign Up for SAT Scorer
        </h2>
        {serverError && <p className="text-sm text-red-500 text-center mb-4">{serverError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-navy-900">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy-900">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-navy-900">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-navy-900">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-navy-900">
              Exam Selection
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            >
              <option value="">Select an exam</option>
              <option value="SAT">SAT</option>
              <option value="GRE">GRE</option>
              <option value="GMAT">GMAT</option>
              <option value="IELTS">IELTS</option>
              <option value="ACT">ACT</option>
              <option value="AP">AP</option>
            </select>
            {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-navy-900">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-navy-900">
              University/School
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            {errors.school && <p className="mt-1 text-sm text-red-500">{errors.school}</p>}
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-navy-900">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 top-6"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="relative">
            <label htmlFor="rePassword" className="block text-sm font-medium text-navy-900">
              Re-enter Password
            </label>
            <input
              type={showRePassword ? 'text' : 'password'}
              id="rePassword"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowRePassword(!showRePassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 top-6"
            >
              {showRePassword ? '🙈' : '👁️'}
            </button>
            {errors.rePassword && <p className="mt-1 text-sm text-red-500">{errors.rePassword}</p>}
            {!errors.rePassword && formData.rePassword && formData.rePassword === formData.password && (
              <p className="mt-1 text-sm text-green-500">Passwords match</p>
            )}
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-navy-900">
              Profile Photo
            </label>
            <div
              className="mt-1 flex flex-col items-center border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-300"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {photo ? (
                <img
                  src={photo}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-gray-500">Upload Photo</span>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Drag & drop your photo here or click to upload
              </p>
              <input
                type="file"
                id="photo"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600 transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-navy-900">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
