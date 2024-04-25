import React, { useState } from 'react';
import './App.css'; // Import CSS file for styling
import Navbar from './components/Navbar.js'; // Import Navbar component
import Body from './components/Body.js'; // Import Body component
import Footer from './components/Footer';

function App() {
  const [transcription, setTranscription] = useState('');

  return (
    <div className="App">
      <Navbar setTranscription={setTranscription} />
      <Body transcription={transcription} />
      <Footer />
    </div>
  );
}

export default App;
