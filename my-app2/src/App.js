import React, { useState, useEffect } from 'react';
import './App.css';
import ProductCollection from './EquipmentComponents/ProductCollection'
import Header from './EquipmentComponents/Header'
import OwnerCollection from './EquipmentComponents/OwnerCollection';
import { Route, Routes } from 'react-router-dom';
import NavBar from './EquipmentComponents/NavBar';
import RentalCollection from './EquipmentComponents/RentalCollection';


function App() {
  const [equipmentArray, setEquipmentArray] = useState([])
  const [equipmentOwnerArray, setEquipmentOwnerArray] = useState([])


  useEffect(() => {
    fetch("http://127.0.0.1:5555/equipment")
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])

  return (
    <div >
      <NavBar />
      <Routes>
        <Route path='/equipment' element={<ProductCollection equipmentArray={equipmentArray} />} />
        <Route path='/equipment_owners' element={<OwnerCollection />} />
        <Route path='/rental_agreements' element={<RentalCollection />} />


      </Routes>

    </div>
  );
}

export default App;
