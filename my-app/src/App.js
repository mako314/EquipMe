// import logo from './logo.svg';
// import './App.css';
import React, {useState, useEffect} from 'react';

function App() {

  // if anything can write fetches and such here, will see what needs to be use


  return (
    <div className="App">
      {/* rembember react is read top down, so I likely need to put the header / navbar here */} 
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

// Don't forget to export stuff, and IMPORT