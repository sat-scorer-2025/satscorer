import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'name') {
      newErrors.name = value ? '' : 'Name is required';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = emailRegex.test(value) ? '' : 'Invalid email format';
    }
    if (name === 'subject') {
      newErrors.subject = value ? '' : 'Subject is required';
    }
    if (name === 'message') {
      newErrors.message = value ? '' : 'Message is required';
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      try {
        setLoading(true);
        const backendUrl =
          import.meta.env.VITE_API_URL || 'https://api.satscorer.com';
        const response = await axios.post(`${backendUrl}/api/contact/send`, formData);

        if (response.status === 200) {
          setIsSubmitted(true);
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => setIsSubmitted(false), 3000);
        }
      } catch (error) {
        console.error('Failed to send contact form:', error);
        alert('Failed to send message. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 animate-fadeIn">
          <h2 className="text-3xl font-extrabold text-navy-900 text-center mb-8">
            Contact Us
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Form */}
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold text-navy-900 mb-4">
                Send Us a Message
              </h3>
              {isSubmitted && (
                <p className="text-green-500 text-center mb-4 animate-fadeIn">
                  ✅ Message sent successfully!
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-navy-900"
                  >
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
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${
                      loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
                    } text-white px-6 py-3 rounded-md text-lg font-medium transition-all duration-300`}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Details */}
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold text-navy-900 mb-4">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <p>
                    <a
                      href="mailto:support@satscorer.com"
                      className="text-navy-900 hover:text-blue-500 transition-colors duration-300"
                    >
                      support@satscorer.com
                    </a>
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <p>
                    <a
                      href="tel:+917987340207"
                      className="text-navy-900 hover:text-blue-500 transition-colors duration-300"
                    >
                      +91 79873 40207
                    </a>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-navy-900">
                    3207, SUDAMA NAGAR, SECTOR E,<br />
                    INDORE, MADHYA PRADESH - 452009
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-navy-900 mb-3">
                  Follow Us
                </h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://x.com/Praveen65488161"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="font-medium">Twitter</span>
                  </a>
                  <a
                    href="https://instagram.com/praveenshrivastava23"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-medium">Instagram</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/praveen-shrivastava-821bb4233"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://wa.me/917987340207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
