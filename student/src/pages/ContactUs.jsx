// import React, { useState } from 'react';
// import Footer from '../components/Footer';

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
//     if (name === 'name') {
//       newErrors.name = value ? '' : 'Name is required';
//     }
//     if (name === 'email') {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       newErrors.email = emailRegex.test(value) ? '' : 'Invalid email format';
//     }
//     if (name === 'subject') {
//       newErrors.subject = value ? '' : 'Subject is required';
//     }
//     if (name === 'message') {
//       newErrors.message = value ? '' : 'Message is required';
//     }
//     setErrors(newErrors);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = {};
//     if (!formData.name) newErrors.name = 'Name is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
//     if (!formData.subject) newErrors.subject = 'Subject is required';
//     if (!formData.message) newErrors.message = 'Message is required';

//     setErrors(newErrors);
//     if (Object.values(newErrors).every((error) => !error)) {
//       setIsSubmitted(true);
//       console.log('Form submitted:', formData);
//       setFormData({ name: '', email: '', subject: '', message: '' });
//       setTimeout(() => setIsSubmitted(false), 3000); // Hide success message after 3 seconds
//     }
//   };

//   return (
//      <>
//      <section className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
//       <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 animate-fadeIn">
//         <h2 className="text-3xl font-extrabold text-navy-900 text-center mb-8">
//           Contact Us
//         </h2>
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Contact Form */}
//           <div className="lg:w-1/2">
//             <h3 className="text-xl font-semibold text-navy-900 mb-4">
//               Send Us a Message
//             </h3>
//             {isSubmitted && (
//               <p className="text-green-500 text-center mb-4">
//                 Message sent successfully!
//               </p>
//             )}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Name */}
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-navy-900">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   required
//                 />
//                 {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-navy-900">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   required
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
//               </div>

//               {/* Subject */}
//               <div>
//                 <label htmlFor="subject" className="block text-sm font-medium text-navy-900">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   id="subject"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   required
//                 />
//                 {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
//               </div>

//               {/* Message */}
//               <div>
//                 <label htmlFor="message" className="block text-sm font-medium text-navy-900">
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   rows="4"
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   required
//                 />
//                 {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
//               </div>

//               {/* Submit Button */}
//               <div>
//                 <button
//                   type="submit"
//                   className="w-full bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600 transition-all duration-300"
//                 >
//                   Send Message
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Contact Details */}
//           <div className="lg:w-1/2">
//             <h3 className="text-xl font-semibold text-navy-900 mb-4">
//               Get in Touch
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <span className="text-blue-500 mr-2">✉️</span>
//                 <p>
//                   <a
//                     href="mailto:support@satscorer.com"
//                     className="text-navy-900 hover:text-blue-500 transition-colors duration-300"
//                   >
//                     support@satscorer.com
//                   </a>
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-blue-500 mr-2">📞</span>
//                 <p>
//                   <a
//                     href="tel:+917987340207"
//                     className="text-navy-900 hover:text-blue-500 transition-colors duration-300"
//                   >
//                     +917987340207
//                   </a>
//                 </p>
//               </div>
//               <div className="flex items-start">
//                 <span className="text-blue-500 mr-2">🏢</span>
//                 <p className="text-navy-900">
//                   3207,SUDAMA NAGAR,SECTOR E,SUDAMA NAGAR   INDORE,  MADHYAPRADESH  452009
//                 </p>
//               </div>
//             </div>

//             {/* Social Media Links */}
//             <div className="mt-6">
//               <h4 className="text-lg font-medium text-navy-900 mb-2">
//                 Follow Us
//               </h4>
//               <div className="flex space-x-4">
//                 <a
//                   href="https://twitter.com/satscorer"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
//                 >
//                   🐦 Twitter
//                 </a>
//                 <a
//                   href="https://instagram.com/satscorer"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
//                 >
//                   📸 Instagram
//                 </a>
//                 <a
//                   href="https://linkedin.com/company/satscorer"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
//                 >
//                   💼 LinkedIn
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//     <Footer/>
//      </>
//   );
// };

// export default ContactUs;

import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useForm, ValidationError } from '@formspree/react'; // Import Formspree hook

// Note: You may need to install Formspree: npm install @formspree/react

const ContactUs = () => {
  // 1. Replace local state management with Formspree's hook
  const [state, handleSubmit] = useForm('support@satscorer.com'); // <-- REPLACE with your actual Formspree endpoint URL!

  // Local state for form data and validation (only for controlled inputs, not for submission)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Still run client-side validation for instant feedback
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    // The required logic is simplified here as Formspree will handle final submission
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = emailRegex.test(value) ? '' : 'Invalid email format';
    } else if (name === 'name' || name === 'subject' || name === 'message') {
      newErrors[name] = value.trim() ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    setErrors(newErrors);
  };

  // Formspree handles the actual submission, so we only need to validate before calling the handler
  const onSubmitWithValidation = (e) => {
    e.preventDefault();
    
    // Simple client-side validation check
    const formValid = Object.values(errors).every((error) => !error) &&
      formData.name && formData.email && formData.subject && formData.message;

    if (formValid) {
      // Let Formspree handle the POST request
      handleSubmit(e);
      // Note: Formspree automatically resets the form after successful submission
    } else {
      // Optionally set errors for fields that haven't been touched yet
      validateField('name', formData.name);
      validateField('email', formData.email);
      validateField('subject', formData.subject);
      validateField('message', formData.message);
    }
  };

  // 2. Check for Formspree success state
  if (state.succeeded) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 text-center animate-fadeIn">
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">Message Sent! ✅</h2>
          <p className="text-lg text-gray-700">Thank you for contacting us. We will get back to you shortly.</p>
        </div>
        <Footer />
      </section>
    );
  }

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
            
            {/* 3. Update form onSubmit handler */}
            <form onSubmit={onSubmitWithValidation} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-navy-900">
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
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
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
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-navy-900">
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
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-navy-900">
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
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={state.submitting || Object.values(errors).some(e => e)} // Disable if submitting or errors exist
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600 transition-all duration-300 disabled:opacity-50"
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              {/* Optional: Display Formspree submission error */}
              <ValidationError errors={state.errors} className="text-red-500 text-center" />
            </form>
          </div>

          {/* Contact Details (Unchanged) */}
          <div className="lg:w-1/2">
            <h3 className="text-xl font-semibold text-navy-900 mb-4">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">✉️</span>
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
                <span className="text-blue-500 mr-2">📞</span>
                <p>
                  <a
                    href="tel:+917987340207"
                    className="text-navy-900 hover:text-blue-500 transition-colors duration-300"
                  >
                    +917987340207
                  </a>
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">🏢</span>
                <p className="text-navy-900">
                  3207,SUDAMA NAGAR,SECTOR E,SUDAMA NAGAR   INDORE,  MADHYAPRADESH  452009
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-navy-900 mb-2">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/satscorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                >
                  🐦 Twitter
                </a>
                <a
                  href="https://instagram.com/satscorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                >
                  📸 Instagram
                </a>
                <a
                  href="https://linkedin.com/company/satscorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                >
                  💼 LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
     </>
  );
};

export default ContactUs;