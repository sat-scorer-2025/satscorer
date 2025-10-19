import React, { useState } from 'react';
import VideoTab from './VideoTab';
import NotesTab from './NotesTab';

const CourseContentTab = () => {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Upload Content</h2>
      <div className="mb-6">
        <div className="flex border-b border-gray-200 gap-4">
          <button
            className={`px-6 py-2 text-md font-semibold rounded-t-lg transition-all duration-200 ease-in-out ${
              activeTab === 'videos'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500 shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`px-6 py-2 text-md font-semibold rounded-t-lg transition-all duration-200 ease-in-out ${
              activeTab === 'notes'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500 shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          {activeTab === 'videos' && <VideoTab />}
          {activeTab === 'notes' && <NotesTab />}
        </div>
      </div>
    </div>
  );
};

export default CourseContentTab;