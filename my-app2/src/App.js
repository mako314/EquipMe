import React, { useState, useEffect } from 'react';
import './App.css';
import './EquipmentComponents/ProductCollection'
import ProductCollection from './EquipmentComponents/ProductCollection';


function App() {
  const [equipmentArray, setEquipmentArray] = useState([])


  useEffect(() => {
    fetch("http://127.0.0.1:5555/equipment")
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <ProductCollection equipmentArray={equipmentArray} />
      </header>
    </div>
  );
}

export default App;
