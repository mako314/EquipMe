// import logo from './logo.svg';
// import './App.css';
import React, {useState, useEffect} from 'react';

function App() {

  // if anything can write fetches and such here, will see what needs to be use

  // fetches are usEffect, and need useState

  // May also need to write a single display page for each thing, say a user, owner, and a rental. Won't be too difficult because it'd really just be moving stuff around and copying the display page but making one for user, owner and renter? 

  // The cards I've made should be interesting. Basically If I have reviews I would like to just have some small bits from it exist in their cards. So maybe, review stars? Individual reviews? I have to think about how to write it tbh, I can ask chatgpt to generate fake reviews with a 1-5 star rating and x or y equipment 

  // Not sure If I should do one form to control everything and just have it be conditional, I would like to have a signup for users essentially, like a button to click and sign up

  // I may need a way to make an actual rental agreement, will need to brainstorm this. Along with making a rental agreement, should I allow the displaying of said rental agreement?

  // Think this may be a repeat, but everything seems to be in place? All I require left is a dsiplay page, a HOME PAGE to house all the content also? and a search bar 

  // Tomorrow need to work on properly setting up fetches and the rest is smooth sailing, so basically watch the react video and linking it up and follow that guide
  // Then formik and yup

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