// Navbar.js

import React, { useRef, useState } from 'react';
import '../App.css'; // Import CSS file for styling
import logo from '../title.png'; // Import logo image
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon from react-icons

function Navbar({ setTranscription }) { // Pass setTranscription as a prop
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleBrowseButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadButtonClick = async () => {
    if (selectedFile) {
      setUploading(true); // Start uploading
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch("http://localhost:8000/upload/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setTranscription(data.transcription); // Pass transcription to Body component
          setUploadSuccess(true); // Show the popup
          setTimeout(() => setUploadSuccess(false), 3000); // Hide the popup after 3 seconds
          setSelectedFile(null); // Clear selected file
        } else {
          console.error("Failed to upload file:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setUploading(false); // Stop uploading
      }
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="buttons">
          <button onClick={handleBrowseButtonClick}>Browse</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            accept="video/*"
          />
          <br />
          <button onClick={handleUploadButtonClick} disabled={!selectedFile}>
            {uploading ? <FaSpinner className="spinner" /> : "Upload File"} {/* spinner icon */}
          </button>
        </div>
      </div>
      {uploadSuccess && <div className="popup">File Upload Successful</div>}
    </nav>
  );
}

export default Navbar;
