// VideoPlayer.js

import React from 'react';

function VideoPlayer({ videoUrl, captions }) {
  return (
    <div className="video-player-container">
      <div className="video-container">
        <video controls src={videoUrl} className="video" />
      </div>
      <div className="captions-container">
        <h2>Captions:</h2>
        <p>{captions}</p>
      </div>
    </div>
  );
}

export default VideoPlayer;
