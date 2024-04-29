import React, { useState } from 'react';
import './App.css'; // Import CSS file for styling
import Navbar from './components/Navbar.js'; // Import Navbar component
import Body from './components/Body.js'; // Import Body component

function App() {
  const [transcription, setTranscription] = useState('');
  const[summary,setSummary]=useState('');

  return (
    <div className="App">
      <Navbar setTranscription={setTranscription} setSummary={setSummary}/>
      <Body transcription={transcription} summary={summary} />
    </div>
  );
}

export default App;
