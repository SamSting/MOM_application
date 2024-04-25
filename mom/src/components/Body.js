// Body.js

import React, { useState } from 'react';

function Body({ transcription }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    // Logic to copy the transcription text to clipboard
    navigator.clipboard.writeText(transcription);
    setCopied(true); // Set copied state to true
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="body">
      {transcription && (
        <div className="message-box">
          <div className="transcription">{transcription}</div>
          <button className="copy-button" onClick={handleCopyClick} disabled={copied}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {!transcription && (
        <div className="no-transcription"></div>
      )}
    </div>
  );
}

export default Body;
