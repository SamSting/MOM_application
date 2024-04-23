import React from 'react';
import './App.css'; // Import CSS file for styling
import Navbar from './components/Navbar.js'; // Import Navbar component
import Footer from './components/Footer';
import Body from './components/Body';
function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Body/> */}
      <Footer />
    </div>
  );
}

export default App;
