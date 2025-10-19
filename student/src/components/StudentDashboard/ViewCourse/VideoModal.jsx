import React, { useMemo, useCallback } from 'react';

const VideoModal = React.memo(({ videoId, onClose }) => {
  if (!videoId) {
    return null;
  }

  // Memoized function to extract YouTube video ID from URL or ID
  const getYouTubeEmbedUrl = useCallback((input) => {

    // Regular expression to match YouTube video ID from various URL formats
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = input.match(youtubeRegex);
    const extractedVideoId = match ? match[1] : input;

    // Validate video ID (YouTube IDs are 11 characters long)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(extractedVideoId)) {
      return null; // Return null if invalid
    }

    // Add query parameters to minimize YouTube branding and controls
    const embedUrl = `https://www.youtube.com/embed/${extractedVideoId}?modestbranding=1&showinfo=0&rel=0`;
    return embedUrl;
  }, []);

  // Cache the embed URL to prevent recalculation
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoId), [videoId, getYouTubeEmbedUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg p-4 sm:p-10 w-full max-w-3xl relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-semibold transition-colors"
          aria-label="Close video modal"
        >
          ✕
        </button>

        {embedUrl ? (
          <iframe
            className="w-full h-64 sm:h-80 md:h-96 rounded-md"
            src={embedUrl}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 bg-gray-100 rounded-md">
            <p className="text-red-400 text-sm sm:text-base text-center font-['Inter',sans-serif]">
              Unable to load video. The video ID is invalid or the video is not embeddable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default VideoModal;
