import React, { useState, useEffect } from 'react';
import './App.css';
import ProductCollection from './EquipmentComponents/ProductCollection'
import Header from './EquipmentComponents/Header'
import OwnerCollection from './EquipmentComponents/OwnerCollection';
import { Route, Routes } from 'react-router-dom';
import NavBar from './EquipmentComponents/NavBar';
import RentalCollection from './EquipmentComponents/RentalCollection';
import ProductDisplay from './EquipmentComponents/ProductDisplay';
import OwnerDisplay from './EquipmentComponents/OwnerDisplay';
import UserForm from './EquipmentComponents/UserForm';
import OwnerForm from './EquipmentComponents/OwnerForm'


function App() {
  const [equipmentArray, setEquipmentArray] = useState([])
  const [equipmentOwnerArray, setEquipmentOwnerArray] = useState([])

  //These useStates will handle Post. Grabbing and ...spreading so it updates accordingly.
  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([])


  useEffect(() => {
    fetch("http://127.0.0.1:5555/equipment")
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])

//These will be the Post useEffects - USERS
  useEffect(() => {
    fetch("http://127.0.0.1:5555/renters")
      .then((resp) => resp.json())
      .then((data) => {
        setUsers(data)
      })
  }, [])

  const addUser = (user) => {
    setUsers(users => [...users, user])
  }

//These will be the Post useEffects - OWNERS
  useEffect(() => {
    fetch("http://127.0.0.1:5555/renters")
      .then((resp) => resp.json())
      .then((data) => {
        setOwners(data)
      })
  }, [])

  const addOwner = (owner) => {
    setOwners(owners => [...owners, owner])
  }






  return (
    <div >
      <NavBar />
      <Routes>
        <Route path='/equipment' element={<ProductCollection equipmentArray={equipmentArray} />} />
        <Route path='/equipment_owners' element={<OwnerCollection />} />
        <Route path='/rental_agreements' element={<RentalCollection />} />
        <Route path='/equipment/:id' element={<ProductDisplay />} />
        <Route path='/equipment_owners/:id' element={<OwnerDisplay />} />
        <Route path='/renter_signup' element={<UserForm addUser={addUser}/>} />
        <Route path='/owner_signup' element={<OwnerForm addOwner={addOwner}/>} />
      </Routes>

    </div>
  );
}

export default App;
