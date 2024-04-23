// Body.js

import React, { useState, useEffect } from 'react';
import '../App.css'; // Import CSS file for styling
import VideoPlayer from './Videoplayer.js'; // Import VideoPlayer component

function Body() {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState("");

  // Fetch captions from backend
  const fetchCaptions = async () => {
    try {
      const response = await fetch("http://localhost:8000/extract-captions/", {
        method: "POST",
        // Add appropriate headers and body if needed
      });
      if (response.ok) {
        const data = await response.json();
        setCaptions(data.captions); // Update state with received captions
      } else {
        console.error("Failed to fetch captions:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching captions:", error);
    }
  };

  // Call fetchCaptions function when component mounts
  useEffect(() => {
    fetchCaptions();
  }, []);

  return (
    <div className="body-container">
      <VideoPlayer videoUrl={videoUrl} captions={captions} />
    </div>
  );
}

export default Body;
