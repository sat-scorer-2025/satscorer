import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Outlet } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import ConfirmModal from '../ConfirmModal';
import { EyeIcon, NoSymbolIcon, CheckIcon } from '@heroicons/react/24/outline';

const RegisteredStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusModal, setStatusModal] = useState({ open: false, id: null, name: '', email: '', action: '' });
  const apiUrl = 'http://localhost:5000/api' || `${import.meta.env.VITE_API_URL}/api`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { role: 'student' },
        });
        setStudents(response.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch students');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const toggleStudentStatus = async (id) => {
    try {
      const student = students.find((s) => s._id === id);
      const newStatus = student.status === 'active' ? 'blocked' : 'active';
      await axios.put(
        `${apiUrl}/user/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
      toast.success(`Student status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusModal({ open: false, id: null, name: '', email: '', action: '' });
    }
  };

  const openStatusModal = (id, name, email, action) => {
    setStatusModal({ open: true, id, name, email, action });
  };

  const handleViewProfile = (studentId) => {
    navigate(`/students/registered/${studentId}/profile`);
  };

  const filteredStudents = students.filter(
    (student) =>
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Registered Students</h2>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showExamFilter={false}
      />
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-gray-600 text-lg">No students found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Student Name</th>
                <th className="p-4 border border-gray-200 text-center">Email</th>
                <th className="p-4 border border-gray-200 text-center">Phone</th>
                <th className="p-4 border border-gray-200 text-center">Registered Date</th>
                <th className="p-4 border border-gray-200 text-center">Registered Time</th>
                <th className="p-4 border border-gray-200 text-center">Address</th>
                <th className="p-4 border border-gray-200 text-center">Status</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{student.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{student.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{student.phone || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {student.createdAt ? format(new Date(student.createdAt), 'dd-MM-yyyy') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {student.createdAt ? format(new Date(student.createdAt), 'hh:mm a') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm lowercase">{student.address || 'N/A'}</td>
                  <td className="px-4 py-3 text-center border border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.status === 'active'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleViewProfile(student._id)}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                      disabled={isLoading}
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openStatusModal(student._id, student.name, student.email, student.status === 'active' ? 'disable' : 'enable')}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-200 ${
                        student.status === 'active'
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      disabled={isLoading}
                    >
                      {student.status === 'active' ? (
                        <NoSymbolIcon className="w-4 h-4" />
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span>{student.status === 'active' ? 'Disable' : 'Enable'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmModal
        open={statusModal.open}
        onClose={() => setStatusModal({ open: false, id: null, name: '', email: '', action: '' })}
        onConfirm={() => toggleStudentStatus(statusModal.id)}
        message={`Are you sure you want to ${statusModal.action} ${statusModal.name} (${statusModal.email})? ${
          statusModal.action === 'disable' ? 'The student will not be able to login and will see: "You have been blocked by the admin."' : ''
        }`}
      />
      <Outlet />
    </div>
  );
};

export default RegisteredStudents;