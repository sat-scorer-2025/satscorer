import React, { useState, useContext } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import { toast } from 'react-toastify';
import EditCourseDrawer from './EditCourseDrawer';
import ConfirmModal from '../ConfirmModal';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageCoursesTable = () => {
  const { token } = useAuth();
  const { courses, setCourses, isLoading } = useContext(CourseContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowDrawer(true);
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course.');
    }
    setDeleteModal({ open: false, id: null, title: '' });
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const handleUpdateCourse = async (updatedCourse) => {
    setCourses(courses.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    ));
    setShowDrawer(false);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterExam === '' || course.examType === filterExam)
  );

  const getStatus = (course) => {
    const today = new Date();
    if (course.endDate && new Date(course.endDate) < today) {
      return 'expired';
    }
    return course.status;
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Manage Courses</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out "
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="w-full sm:w-48 p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out appearance-none pl-4 pr-8"
            disabled={isLoading}
          >
            <option value="">All Exams</option>
            <option value="SAT">SAT</option>
            <option value="ACT">ACT</option>
            <option value="GRE">GRE</option>
            <option value="GMAT">GMAT</option>
            <option value="IELTS">IELTS</option>
            <option value="AP">AP</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
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
            <p className="mt-2 text-gray-600 text-lg">No courses found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Course</th>
                <th className="p-4 border border-gray-200 text-center">Exam</th>
                <th className="p-4 border border-gray-200 text-center">Price</th>
                <th className="p-4 border border-gray-200 text-center">Start Date</th>
                <th className="p-4 border border-gray-200 text-center">End Date</th>
                <th className="p-4 border border-gray-200 text-center">Enrollments</th>
                <th className="p-4 border border-gray-200 text-center">Status</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => {
                const status = getStatus(course);
                return (
                  <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{course.title}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{course.examType}</td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {course.startDate ? format(new Date(course.startDate), 'dd-MM-yyyy') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {course.endDate ? format(new Date(course.endDate), 'dd-MM-yyyy') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      <span className="inline-block bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-sm font-medium">
                        {course.enrollments?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          status === 'published'
                            ? 'bg-blue-100 text-blue-600'
                            : status === 'expired'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-2 justify-center">
                      <button
                        onClick={() => handleEdit(course)}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                        disabled={isLoading}
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(course._id, course.title)}
                        className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
                        disabled={isLoading}
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {showDrawer && (
        <div className="w-full mt-6">
          <EditCourseDrawer
            course={selectedCourse}
            onClose={() => setShowDrawer(false)}
            onUpdate={handleUpdateCourse}
          />
        </div>
      )}
      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={() => handleDelete(deleteModal.id)}
        message={`Are you sure you want to delete the course "${deleteModal.title}"?`}
      />
    </div>
  );
};

export default ManageCoursesTable;