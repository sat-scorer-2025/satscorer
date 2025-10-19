import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const UpdateCourseContentForm = ({ course }) => {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [editIndex, setEditIndex] = useState({ type: null, id: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!course) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/video/course/${course._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || 'Failed to fetch videos.');
        }
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNotes = async () => {
      if (!course) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notes/course/${course._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(response.data.notes || []);
      } catch (error) {
        console.error('Error fetching notes:', error);
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || 'Failed to fetch notes.');
        }
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
    fetchNotes();
  }, [course, token]);

  const addVideo = async () => {
    if (!videoTitle || !videoURL || !course) {
      toast.error('Please fill all video fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video`,
        { courseId: course._id, title: videoTitle, link: videoURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos((prev) => [...prev, response.data.video]);
      setVideoTitle('');
      setVideoURL('');
      toast.success('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error(error.response?.data?.message || 'Failed to add video.');
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!noteTitle || !noteLink || !course) {
      toast.error('Please fill all note fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        { courseId: course._id, title: noteTitle, link: noteLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  const handleEdit = (type, id) => {
    setEditIndex({ type, id });
    if (type === 'video') {
      const video = videos.find((v) => v._id === id);
      setVideoTitle(video.title);
      setVideoURL(video.link);
    } else if (type === 'note') {
      const note = notes.find((n) => n._id === id);
      setNoteTitle(note.title);
      setNoteLink(note.link);
    }
  };

  const saveEdit = async () => {
    if (editIndex.type === 'video' && videoTitle && videoURL) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/video/${editIndex.id}`,
          { title: videoTitle, link: videoURL, courseId: course._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos((prev) =>
          prev.map((video) =>
            video._id === editIndex.id ? response.data.video : video
          )
        );
        setVideoTitle('');
        setVideoURL('');
        setEditIndex({ type: null, id: null });
        toast.success('Video updated successfully!');
      } catch (error) {
        console.error('Error updating video:', error);
        toast.error(error.response?.data?.message || 'Failed to update video.');
      } finally {
        setIsLoading(false);
      }
    } else if (editIndex.type === 'note' && noteTitle && noteLink) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/notes/${editIndex.id}`,
          { title: noteTitle, link: noteLink, courseId: course._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes((prev) =>
          prev.map((note) =>
            note._id === editIndex.id ? response.data.note : note
          )
        );
        setNoteTitle('');
        setNoteLink('');
        setEditIndex({ type: null, id: null });
        toast.success('Note updated successfully!');
      } catch (error) {
        console.error('Error updating note:', error);
        toast.error(error.response?.data?.message || 'Failed to update note.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please fill all fields.');
    }
  };

  const removeVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to remove this video?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success('Video removed successfully!');
    } catch (error) {
      console.error('Error removing video:', error);
      toast.error(error.response?.data?.message || 'Failed to remove video.');
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
    <div className="space-y-10">
      {/* Input Fields Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Videos Input */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-3">Add/Edit Video</h3>
          <input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Lecture title"
            className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mb-3"
            disabled={isLoading}
          />
          <input
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="YouTube URL"
            className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mb-3"
            disabled={isLoading}
          />
          <button
            onClick={editIndex.type === 'video' ? saveEdit : addVideo}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || !videoTitle || !videoURL}
          >
            {isLoading
              ? 'Processing...'
              : editIndex.type === 'video'
              ? 'Save Video'
              : 'Add Video'}
          </button>
        </div>

        {/* Notes Input */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-3">Add/Edit Note (PDF/Drive link)</h3>
          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mb-3"
            disabled={isLoading}
          />
          <input
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            placeholder="PDF/Drive link"
            className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mb-3"
            disabled={isLoading}
          />
          <button
            onClick={editIndex.type === 'note' ? saveEdit : addNote}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || !noteTitle || !noteLink}
          >
            {isLoading
              ? 'Processing...'
              : editIndex.type === 'note'
              ? 'Save Note'
              : 'Add Note'}
          </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-8">
        {/* Videos Table */}
        {videos.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-3 border-b border-gray-200 pb-1">
              Videos
            </h3>
            <table className="w-full border border-gray-100 rounded-lg">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                  <th className="p-4 border border-gray-200 text-center">Title</th>
                  <th className="p-4 border border-gray-200 text-center">URL</th>
                  <th className="p-4 border border-gray-200 text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video._id}
                    className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {video.title}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center text-sm">
                      <div className="group relative">
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-xs inline-block"
                        >
                          {video.link}
                        </a>
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 -mt-8 left-1/2 transform -translate-x-1/2">
                          {video.link}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit('video', video._id)}
                          className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                          disabled={isLoading}
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => removeVideo(video._id)}
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
          </section>
        )}

        {/* Notes Table */}
        {notes.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-3 border-b border-gray-200 pb-1">
              Notes
            </h3>
            <table className="w-full border border-gray-100 rounded-lg">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                  <th className="p-4 border border-gray-200 text-center">Title</th>
                  <th className="p-4 border border-gray-200 text-center">Link</th>
                  <th className="p-4 border border-gray-200 text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr
                    key={note._id}
                    className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {note.title}
                    </td>
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
                          onClick={() => handleEdit('note', note._id)}
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
          </section>
        )}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse flex space-x-4">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}
      {videos.length === 0 && notes.length === 0 && !isLoading && (
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
          <p className="mt-2 text-gray-600 text-lg">No content available for this course.</p>
        </div>
      )}
    </div>
  );
};

export default UpdateCourseContentForm;