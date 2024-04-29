import React, { useState } from 'react';

function Body({ transcription, summary }) {
  // State to track whether the text has been copied
  const [copied, setCopied] = useState(false);

  // Function to handle copy button click
  const handleCopyClick = () => {
    // Logic to copy the transcription or summary text to clipboard
    navigator.clipboard.writeText(transcription || summary);
    // Set copied state to true
    setCopied(true);
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="body">
      {/* Render transcription if available */}
      {transcription && (
        <div className="message-box">
          <div className="transcription">{transcription}</div>
          {/* Copy button for transcription */}
          <button className="copy-button" onClick={handleCopyClick} disabled={copied}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {/* Render summary if available */}
      {summary && (
        <div className="message-boxnew">
          <div className="transcription">{summary}</div>
          {/* Copy button for summary */}
          <button className="copy-button" onClick={handleCopyClick} disabled={copied}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {/* Render if neither transcription nor summary is available */}
      {!transcription && !summary && (
        <div className="no-transcription"></div>
      )}
    </div>
  );
}

export default Body;
