import React, { useState, useEffect } from 'react';
import './App.css';
import ProductCollection from './EquipmentComponents/ProductCollection'
import OwnerCollection from './EquipmentComponents/OwnerCollection';
import { useNavigate, Route, Routes } from 'react-router-dom';
import NavBar from './EquipmentComponents/NavBar';
import RentalCollection from './EquipmentComponents/RentalCollection';
import ProductDisplay from './EquipmentComponents/ProductDisplay';
import OwnerDisplay from './EquipmentComponents/OwnerDisplay';
import UserForm from './EquipmentComponents/UserForm';
import OwnerForm from './EquipmentComponents/OwnerForm'
import OwnerEditForm from './EquipmentComponents/OwnerEditForm';



function App() {

  //forgot to const navigate = useNavigate()
  const navigate = useNavigate()
  const [equipmentArray, setEquipmentArray] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  //These useStates will handle POST. Grabbing and ...spreading so it updates accordingly.
  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([])

  //These useStates will handle PATCH.
  const [ownerToEdit, setOwnerToEdit] = useState([])
  //const [ownerUpdate, setownerUpdate] = useState([]) // Wont likely need


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
//--------------------------------------------

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
//-------------------------------------------------------------
// EDIT OWNERS

const updateOwner = (ownerToUpdate) => {
  setOwners(owners => owners.map(owner => {
    if (owner.id === ownerToUpdate.id){
      return ownerToUpdate
    } else {
      return owner
    }
  }))

}

const handleEdit = (owner) => {
  setOwnerToEdit(owner)
  navigate(`/owner/${owner.id}/edit`)
}




  const filteredEquipmentArray = equipmentArray.filter((item) => {
    return item.model.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.make.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  })


  return (
    <div >
      <NavBar setSearchTerm={setSearchTerm} />
      <Routes>

        <Route path='/equipment' element={<ProductCollection equipmentArray={equipmentArray} />} />
        <Route path='/equipment_owners' element={<OwnerCollection handleEdit={handleEdit}/>} />

        <Route path='/equipment' element={<ProductCollection equipmentArray={filteredEquipmentArray} />} />
        <Route path='/equipment_owners' element={<OwnerCollection searchTerm={searchTerm} />} />

        <Route path='/rental_agreements' element={<RentalCollection />} />
        <Route path='/equipment/:id' element={<ProductDisplay />} />
        <Route path='/equipment_owners/:id' element={<OwnerDisplay />} />
        <Route path='/renter_signup' element={<UserForm addUser={addUser}/>} />
        <Route path='/owner_signup' element={<OwnerForm addOwner={addOwner}/>} />
        <Route path='/owner/:id/edit' element={<OwnerEditForm ownerToEdit={ownerToEdit} updateOwner={updateOwner}/>} />
      </Routes>

    </div>
  );
}

export default App;
