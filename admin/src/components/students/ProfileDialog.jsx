import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ProfileAvatar from './ProfileAvatar';

const ProfileDialog = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${studentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStudent(response.data.user);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch student');
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);

  if (!student) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
        <p className="text-red-600 font-semibold text-lg text-center">Student not found.</p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/students/registered')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );

  const profilePhoto = student.profilePhoto || '';
  const address = student.address || `${student.city || 'N/A'}, N/A`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-8">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 border-b border-gray-200 flex justify-between items-center mb-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Student Profile</h2>
          <button
            onClick={() => navigate('/students/registered')}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out"
            aria-label="Close student profile"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left: Profile Photo */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <ProfileAvatar
              src={profilePhoto}
              alt={`${student.name} profile`}
              size="large"
            />
          </div>

          {/* Right: Role/Status/Exam + Personal Info */}
          <div className="flex-1 space-y-6">
            <div className="bg-gray-100 p-6 rounded-md border border-gray-200 shadow-sm flex flex-wrap gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'
                }`}
              >
                Role: {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.status === 'active'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Status: {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                Exam: {student.exam || 'N/A'}
              </span>
            </div>

            <div className="bg-gray-100 p-6 rounded-md border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 gap-3 text-gray-600 text-sm">
                <div className="flex items-center">
                  <span className="font-medium w-28">Full Name:</span>
                  <span>{student.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28">Email:</span>
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28">Phone:</span>
                  <span>{student.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28">Address:</span>
                  <span>{address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Activity & Courses */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Enrolled Courses */}
          <div className="flex-1 bg-gray-100 p-6 rounded-md border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">Enrolled Courses</h4>
            {student.enrolledCourses?.length ? (
              <ul className="list-disc list-inside max-h-60 overflow-y-auto text-gray-600 text-sm space-y-2">
                {student.enrolledCourses.map(c => (
                  <li key={c._id}>{c.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">No courses enrolled.</p>
            )}
          </div>

          {/* Tests Attempted */}
          <div className="flex-1 bg-gray-100 p-6 rounded-md border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">Tests Attempted</h4>
            {student.tests?.length ? (
              <ul className="list-disc list-inside max-h-60 overflow-y-auto text-gray-600 text-sm space-y-2">
                {student.tests.map(t => (
                  <li key={t._id}>{t.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">No tests attempted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDialog;