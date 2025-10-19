import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const NotesTab = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Courses fetched (Notes):', response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses (Notes):', error);
        toast.error(error.response?.data?.message || 'Failed to fetch courses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        console.log('Fetching notes for course:', selectedCourse._id);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/course/${selectedCourse._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Notes fetched:', response.data.notes);
          setNotes(response.data.notes || []);
        } catch (error) {
          console.error('Error fetching notes:', error);
          if (error.response?.status === 404) {
            console.log('No notes found, setting empty array');
            setNotes([]);
          } else {
            toast.error(error.response?.data?.message || 'Failed to fetch notes.');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No course selected, clearing notes');
        setNotes([]);
      }
    };
    fetchNotes();
  }, [selectedCourse, token]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseSelect = (course) => {
    console.log('Course selected (Notes):', course);
    setSelectedCourse(course);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const clearCourse = () => {
    console.log('Clearing selected course (Notes)');
    setSelectedCourse(null);
    setSearchQuery('');
  };

  const addNote = async () => {
    if (!noteTitle || !noteLink || !selectedCourse) {
      toast.error('Please fill all note fields and select a course.');
      return;
    }

    setIsLoading(true);
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
      console.log('Note added:', response.data.note);
      setNotes((prev) => [...prev, response.data.note]);
      setNoteTitle('');
      setNoteLink('');
      toast.success('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Failed to add note.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const note = notes.find((n) => n._id === id);
    setNoteTitle(note.title);
    setNoteLink(note.link);
    setEditIndex(id);
  };

  const saveEdit = async () => {
    if (!noteTitle || !noteLink) {
      toast.error('Please fill all note fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notes/${editIndex}`,
        {
          title: noteTitle,
          link: noteLink,
          courseId: selectedCourse._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) =>
        prev.map((note) =>
          note._id === editIndex ? response.data.note : note
        )
      );
      setNoteTitle('');
      setNoteLink('');
      setEditIndex(null);
      toast.success('Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(error.response?.data?.message || 'Failed to update note.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to remove this note?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Note removed:', noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success('Note removed successfully!');
    } catch (error) {
      console.error('Error removing note:', error);
      toast.error(error.response?.data?.message || 'Failed to remove note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-gray-600 font-medium mb-2">Select Course</label>
        <div className="relative">
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
            className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out pr-10"
            disabled={isLoading || courses.length === 0}
          />
          {selectedCourse && (
            <button
              onClick={clearCourse}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          {isDropdownOpen && searchQuery.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-auto">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => handleCourseSelect(course)}
                    className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    {course.title} ({course.examType})
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-600 text-sm">No courses found</div>
              )}
            </div>
          )}
        </div>
        {courses.length === 0 && !isLoading && (
          <p className="mt-2 text-sm text-gray-600">No courses available. Please create a course first.</p>
        )}
        {isLoading && <p className="mt-2 text-sm text-gray-600">Loading courses...</p>}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-4">Add Note (PDF/Drive link)</h3>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Note title"
          className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mb-3"
          disabled={isLoading}
        />
        <input
          type="text"
          value={noteLink}
          onChange={(e) => setNoteLink(e.target.value)}
          placeholder="PDF/Drive link"
          className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mb-6"
          disabled={isLoading}
        />
        <button
          onClick={editIndex ? saveEdit : addNote}
          disabled={isLoading || !selectedCourse || !noteTitle || !noteLink}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : editIndex ? 'Save Note' : 'Add Note'}
        </button>
      </div>
      {selectedCourse && (
        notes.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <table className="w-full border border-gray-100 rounded-lg">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                  <th className="p-4 border border-gray-200 text-center">Course</th>
                  <th className="p-4 border border-gray-200 text-center">Title</th>
                  <th className="p-4 border border-gray-200 text-center">Link</th>
                  <th className="p-4 border border-gray-200 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr
                    key={note._id}
                    className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{selectedCourse?.title}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{note.title}</td>
                    <td className="px-4 py-3 border border-gray-200 text-center text-sm">
                      <div className="group relative">
                        <a
                          href={note.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-xs inline-block"
                        >
                          {note.link}
                        </a>
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 -mt-8 left-1/2 transform -translate-x-1/2">
                          {note.link}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(note._id)}
                          className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                          disabled={isLoading}
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => removeNote(note._id)}
                          className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
                          disabled={isLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
            <p className="mt-2 text-gray-600 text-lg">No notes available for this course.</p>
          </div>
        )
      )}
    </div>
  );
};

export default NotesTab;