import React from 'react';
import './App.css'; // Import CSS file for styling
import Navbar from './components/Navbar.js'; // Import Navbar component
// import Body from './components/Body';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />

      <Footer />
    </div>
  );
}

export default App;
