import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentContext } from '../../../context/StudentContext';
import VideoModal from './VideoModal';
import { VideoCameraIcon, PlayCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const LecturesContent = () => {
  const { enrolledcourseId } = useParams();
  const { fetchVideosForCourse, error } = useStudentContext();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadVideos = async () => {
      if (hasFetched) return; // Prevent multiple fetches
      setLoading(true);
      const videoData = await fetchVideosForCourse(enrolledcourseId);
      setVideos(videoData || []);
      setFilteredVideos(videoData || []);
      setLoading(false);
      setHasFetched(true);
    };

    if (enrolledcourseId) {
      loadVideos();
    }
  }, [enrolledcourseId, fetchVideosForCourse, hasFetched]);

  useEffect(() => {
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  const handleCloseModal = () => {
    setSelectedVideoId(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <ArrowPathIcon className="w-10 h-10 text-green-500 animate-spin" />
        <span className="ml-3 text-lg font-['Inter',sans-serif] text-gray-800">Loading videos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white text-red-400">
        <ExclamationTriangleIcon className="w-10 h-10 mr-3" />
        <span className="text-lg font-['Inter',sans-serif]">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-white min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-['Inter',sans-serif] font-bold text-gray-800 flex items-center">
            <VideoCameraIcon className="w-10 h-10 mr-3 text-green-500" />
            Video Lectures
          </h2>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search lectures by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-yellow-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-['Inter',sans-serif] text-gray-800 placeholder-gray-400"
            />
            <svg
              className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
        {filteredVideos.length === 0 ? (
          <div className="text-center text-gray-600 py-16 bg-yellow-50 rounded-lg shadow-md">
            <VideoCameraIcon className="w-16 h-16 mx-auto text-yellow-400/70 mb-3" />
            <p className="text-lg font-['Inter',sans-serif]">No videos available for this course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-yellow-100">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-50 to-green-50 text-gray-800">
                  <th className="py-4 px-6 text-left text-sm font-semibold font-['Inter',sans-serif]">S.No</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold font-['Inter',sans-serif]">Title</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold font-['Inter',sans-serif]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video, index) => (
                  <tr
                    key={video._id}
                    className="border-b border-yellow-100 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 text-sm text-gray-800 font-['Inter',sans-serif]">{index + 1}</td>
                    <td className="py-4 px-6 text-sm text-gray-800 font-['Inter',sans-serif] flex items-center justify-center">
                      <VideoCameraIcon className="w-5 h-5 mr-2 text-green-500" />
                      {video.title}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleVideoClick(video.link)}
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium font-['Inter',sans-serif] rounded-md hover:bg-green-600 transition duration-200"
                      >
                        <PlayCircleIcon className="w-5 h-5 mr-2" />
                        Watch Video
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedVideoId && (
        <VideoModal videoId={selectedVideoId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default LecturesContent;
