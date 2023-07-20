import React, { useState, useEffect } from 'react';
import './App.css';
import ProductCollection from './EquipmentComponents/ProductCollection'
import OwnerCollection from './EquipmentComponents/OwnerCollection';
import { Route, Routes } from 'react-router-dom';
import HomePage from './EquipmentComponents/Homepage';
import NavBar from './EquipmentComponents/NavBar';
import RentalCollection from './EquipmentComponents/RentalCollection';
import ProductDisplay from './EquipmentComponents/ProductDisplay';
import OwnerDisplay from './EquipmentComponents/OwnerDisplay';


function App() {
  const [equipmentArray, setEquipmentArray] = useState([])
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    fetch("http://127.0.0.1:5555/equipment")
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])


  const filteredEquipmentArray = equipmentArray.filter((item) => {
    return item.model.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.make.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div >
      <NavBar setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path='/' element={<HomePage/ >} />
        <Route path='/equipment' element={<ProductCollection equipmentArray={filteredEquipmentArray} />} />
        <Route path='/equipment_owners' element={<OwnerCollection searchTerm={searchTerm} />} />
        <Route path='/rental_agreements' element={<RentalCollection />} />
        <Route path='/equipment/:id' element={<ProductDisplay />} />
        <Route path='/equipment_owners/:id' element={<OwnerDisplay />} />

      </Routes>

    </div>
  );
}

export default App;
