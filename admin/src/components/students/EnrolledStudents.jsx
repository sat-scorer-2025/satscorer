import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchFilter from './SearchFilter';
import ConfirmModal from '../ConfirmModal';
import { NoSymbolIcon, CheckIcon } from '@heroicons/react/24/outline';

const EnrolledStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusModal, setStatusModal] = useState({ open: false, id: null, studentName: '', studentEmail: '', courseTitle: '', action: '' });
  const exams = ['GRE', 'GMAT', 'IELTS', 'SAT', 'ACT', 'AP'];

  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollment`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEnrollments(response.data.enrollments || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch enrollments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const toggleEnrollmentStatus = async (id) => {
    try {
      const enrollment = enrollments.find((e) => e._id === id);
      const newStatus = enrollment.status === 'active' ? 'expired' : 'active';
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/enrollment/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setEnrollments((prev) =>
        prev.map((e) =>
          e._id === id
            ? { ...e, status: newStatus }
            : e
        )
      );
      toast.success(
        `Enrollment status for ${enrollment.userId?.name} updated to ${newStatus}`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update enrollment status');
    } finally {
      setStatusModal({ open: false, id: null, studentName: '', studentEmail: '', courseTitle: '', action: '' });
    }
  };

  const openStatusModal = (id, studentName, studentEmail, courseTitle, action) => {
    setStatusModal({ open: true, id, studentName, studentEmail, courseTitle, action });
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      (!examFilter || enrollment.courseId?.examType === examFilter) &&
      (!statusFilter || enrollment.status === statusFilter) &&
      (!searchQuery ||
        enrollment.userId?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        enrollment.userId?.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const isCourseExpired = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    const courseEndDate = new Date(endDate);
    return courseEndDate <= today;
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Student Enrollments</h2>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        examFilter={examFilter}
        setExamFilter={setExamFilter}
        exams={exams}
        showExamFilter={true}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
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
        ) : filteredEnrollments.length === 0 ? (
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
            <p className="mt-2 text-gray-600 text-lg">No enrollments found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Student Name</th>
                <th className="p-4 border border-gray-200 text-center">Email</th>
                <th className="p-4 border border-gray-200 text-center">Course</th>
                <th className="p-4 border border-gray-200 text-center">Enrolled Date</th>
                <th className="p-4 border border-gray-200 text-center">Enrolled Time</th>
                <th className="p-4 border border-gray-200 text-center">Status</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment, index) => {
                const courseExpired = isCourseExpired(enrollment.courseId?.endDate);
                return (
                  <tr
                    key={enrollment._id}
                    className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{enrollment.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{enrollment.userId?.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{enrollment.courseId?.title || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {enrollment.enrolledAt ? format(new Date(enrollment.enrolledAt), 'dd-MM-yyyy') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {enrollment.enrolledAt ? format(new Date(enrollment.enrolledAt), 'hh:mm a') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          enrollment.status === 'active'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-2 justify-center">
                      {courseExpired && enrollment.status === 'expired' ? (
                        <span className="px-3 py-2 text-sm font-semibold text-gray-500">
                          Expired Course
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            openStatusModal(
                              enrollment._id,
                              enrollment.userId?.name,
                              enrollment.userId?.email,
                              enrollment.courseId?.title,
                              enrollment.status === 'active' ? 'expire' : 'activate'
                            )
                          }
                          className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-200 ${
                            enrollment.status === 'active'
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                          disabled={isLoading}
                        >
                          {enrollment.status === 'active' ? (
                            <NoSymbolIcon className="w-4 h-4" />
                          ) : (
                            <CheckIcon className="w-4 h-4" />
                          )}
                          <span>{enrollment.status === 'active' ? 'Expire' : 'Activate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmModal
        open={statusModal.open}
        onClose={() => setStatusModal({ open: false, id: null, studentName: '', studentEmail: '', courseTitle: '', action: '' })}
        onConfirm={() => toggleEnrollmentStatus(statusModal.id)}
        message={`Are you sure you want to ${statusModal.action} the course "${statusModal.courseTitle}" for ${statusModal.studentName} (${statusModal.studentEmail})? ${
          statusModal.action === 'expire' ? 'The student will remain enrolled but cannot access course content (tests, videos, notes, and live sessions).' : ''
        }`}
      />
    </div>
  );
};

export default EnrolledStudents;