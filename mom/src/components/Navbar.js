import React, { useRef, useState } from 'react'; // Importing necessary modules from React
import '../App.css'; // Importing CSS styles
import logo from '../title.png'; // Importing logo image
import { FaSpinner } from 'react-icons/fa'; // Importing loading spinner icon

function Navbar({ setTranscription, setSummary }) { // Navbar component with props setTranscription and setSummary
  const fileInputRef = useRef(null); // Creating a ref for file input element
  const [selectedFile, setSelectedFile] = useState(null); // State for storing selected file
  const [uploading, setUploading] = useState(false); // State for tracking upload status
  const [uploadSuccess, setUploadSuccess] = useState(false); // State for tracking upload success

  const browseButtonClickHandler = () => { // Function to handle browse button click
    fileInputRef.current.click(); // Programmatically click the file input element
  };

  const fileInputChangeHandler = (event) => { // Function to handle file input change
    const file = event.target.files[0]; // Get the selected file from input event
    setSelectedFile(file); // Update selected file state
  };

  const handleUploadResponse = async (response) => { // Function to handle upload response
    if (response.ok) { // If upload is successful
      const data = await response.json(); // Parse response data
      setTranscription(data.transcription); // Update transcription state with received data
      setSummary(data.summary); // Update summary state with received data
      setUploadSuccess(true); // Set upload success state to true
      setTimeout(() => setUploadSuccess(false), 3000); // Reset upload success state after 3 seconds
      setSelectedFile(null); // Reset selected file state
    } else { // If upload fails
      console.error("Failed to upload file:", response.statusText); // Log error message
    }
  };

  const uploadButtonClickHandler = async () => { // Function to handle upload button click
    if (!selectedFile) { // If no file is selected
      console.error("No file selected."); // Log error message
      return; // Exit function
    }

    setUploading(true); // Set uploading state to true
    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append("file", selectedFile); // Append selected file to form data

      const response = await fetch("http://localhost:8000/upload/", { // Send POST request to upload endpoint
        method: "POST",
        body: formData, // Send form data as body
      });

      handleUploadResponse(response); // Handle upload response
    } catch (error) { // If an error occurs during upload
      console.error("Error:", error); // Log error message
    } finally { // Whether upload succeeds or fails
      setUploading(false); // Set uploading state to false
    }
  };

  return (
    <nav className="navbar"> {/* Navbar container */}
      <div className="container"> {/* Container for navbar content */}
        <div className="logo"> {/* Logo container */}
          <img src={logo} alt="Logo" /> {/* Logo image */}
        </div>
        <div className="buttons"> {/* Container for buttons */}
          <button onClick={browseButtonClickHandler}>Browse</button> {/* Browse button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={fileInputChangeHandler}
            style={{ display: 'none' }}
            accept="video/*"
          /> {/* Hidden file input element */}
          <br />
          <button onClick={uploadButtonClickHandler} disabled={!selectedFile}> {/* Upload button */}
            {uploading ? <FaSpinner className="spinner" /> : "Upload File"} {/* Display spinner icon while uploading */}
          </button>
        </div>
      </div>
      {uploadSuccess && <div className="popup">File Upload Successful</div>} {/* Display success popup if upload is successful */}
    </nav>
  );
}

export default Navbar; // Export the Navbar component
