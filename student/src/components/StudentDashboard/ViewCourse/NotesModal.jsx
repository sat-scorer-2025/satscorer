import React, { useMemo } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

const NotesModal = React.memo(({ noteLink, onClose }) => {
  if (!noteLink) {
    return null;
  }

  // Function to normalize the note link for embedding
  const getNormalizedUrl = useMemo(() => {
    // Basic validation for URL
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlRegex.test(noteLink)) {
      console.error('Invalid note URL:', noteLink);
      return null;
    }

    // Handle Google Drive links for embedding
    if (noteLink.includes('drive.google.com')) {
      // Extract file ID from Google Drive URL
      const match = noteLink.match(/[-\w]{25,}/);
      if (match) {
        return `https://drive.google.com/file/d/${match[0]}/preview`;
      }
      return noteLink; // Fallback to original link if ID not found
    }

    return noteLink; // Return original link for other URLs (e.g., PDFs, websites)
  }, [noteLink]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg p-4 sm:p-10 w-full max-w-4xl relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-semibold transition-colors"
          aria-label="Close notes modal"
        >
          ✕
        </button>

        {getNormalizedUrl ? (
          <iframe
            className="w-full h-64 sm:h-80 md:h-96 rounded-md"
            src={getNormalizedUrl}
            title="Note Viewer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 bg-gray-100 rounded-md">
            <p className="text-red-400 text-sm sm:text-base text-center font-['Inter',sans-serif]">
              Unable to load note. The link is invalid or not accessible.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default NotesModal;