import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../ConfirmModal';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NotesTab = () => {
  const { token } = useAuth();
  const { courses, isLoading: isCoursesLoading } = useContext(CourseContext);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  useEffect(() => {
    const fetchNotes = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/course/${selectedCourse._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNotes(response.data.notes || []);
        } catch (error) {
          console.error('Error fetching notes:', error);
          if (error.response?.status === 404) {
            setNotes([]);
          } else {
            toast.error(error.response?.data?.message || 'Failed to fetch notes.');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setNotes([]);
      }
    };
    fetchNotes();
  }, [selectedCourse, token]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const clearCourse = () => {
    setSelectedCourse(null);
    setSearchQuery('');
  };

  const addNote = async () => {
    if (!noteTitle || !noteLink || !selectedCourse) {
      toast.error('Please fill all note fields and select a course.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        {
          courseId: selectedCourse._id,
          title: noteTitle,
          link: noteLink,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [...prev, response.data.note]);
      setNoteTitle('');
      setNoteLink('');
      toast.success('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Failed to add note.');
    }
  };

  const removeNote = async (noteId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success('Note removed successfully!');
    } catch (error) {
      console.error('Error removing note:', error);
      toast.error(error.response?.data?.message || 'Failed to remove note.');
    } finally {
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-gray-600 font-medium mb-2">Select Course</label>
        <div className="relative">
          <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={selectedCourse ? selectedCourse.title : searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
              if (selectedCourse) setSelectedCourse(null);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search for a course..."
            className="pl-10 w-full p-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out pr-10"
            disabled={isLoading || isCoursesLoading || courses.length === 0}
          />
          {selectedCourse && (
            <button
              onClick={clearCourse}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          {isDropdownOpen && searchQuery.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-fade-scale">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => handleCourseSelect(course)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    {course.title} ({course.examType})
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No courses found</div>
              )}
            </div>
          )}
        </div>
        {courses.length === 0 && !isCoursesLoading && (
          <p className="mt-2 text-sm text-gray-500">No courses available. Please create a course first.</p>
        )}
        {isCoursesLoading && <p className="mt-2 text-sm text-gray-500">Loading courses...</p>}
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Add Note (PDF/Drive link)</h3>
        <div className="relative mb-3">
          <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="pl-10 w-full p-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            disabled={isLoading}
          />
        </div>
        <div className="relative mb-6">
          <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            placeholder="PDF/Drive link"
            className="pl-10 w-full p-3 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={addNote}
          disabled={isLoading || !selectedCourse || !noteTitle || !noteLink}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? 'Adding...' : 'Add Note'}
        </button>
      </div>
      {selectedCourse && (
        notes.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Course</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Link</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note._id} className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100">
                    <td className="px-6 py-4 text-center text-gray-800">{selectedCourse?.title}</td>
                    <td className="px-6 py-4 text-center text-gray-800">{note.title}</td>
                    <td className="px-6 py-4 text-center">
                      <a
                        href={note.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                      >
                        View Note
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openDeleteModal(note._id, note.title)}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-semibold"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">No notes available for this course.</p>
        )
      )}
      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={() => removeNote(deleteModal.id)}
        message={`Are you sure you want to remove the note "${deleteModal.title}"?`}
      />
    </div>
  );
};

export default NotesTab;