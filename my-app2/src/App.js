import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Route, Routes } from 'react-router-dom';
//---------------------Homepage and Navbar-------------
import HomePage from './EquipmentComponents/HomePage';
import NavBar from './EquipmentComponents/NavBar';
//---------------------Collections--------------------
import ProductCollection from './EquipmentComponents/ProductCollection'
import OwnerCollection from './EquipmentComponents/OwnerCollection';
import RentalCollection from './EquipmentComponents/RentalCollection';
//-------------------------Display Pages-----------------------------------
import ProductDisplay from './EquipmentComponents/ProductDisplay';
import OwnerDisplay from './EquipmentComponents/OwnerDisplay';
//-------------------------Forms----------------------------------------
import UserForm from './EquipmentComponents/UserForm';
//-------------------------OwnerForms---------------------------------------
import OwnerForm from './EquipmentComponents/OwnerForm'
import OwnerEditForm from './EquipmentComponents/OwnerEditForm';
//------------------------ProductForm-------------------------------------
import ProductForm from './EquipmentComponents/ProductForm';
import ProductEditForm from './EquipmentComponents/ProductEditForm';
import RentalForm from './EquipmentComponents/RentalForm';
import RentalFormPrepop from './EquipmentComponents/RentalFormPrepop';

function App() {

  //forgot to const navigate = useNavigate()
  const navigate = useNavigate()
  const [equipmentArray, setEquipmentArray] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  //These useStates will handle POST. Grabbing and ...spreading so it updates accordingly.
  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([])
  const [rentalAgreement, setRentalAgreement] = useState([])

  //These useStates will handle PATCH.
  const [ownerToEdit, setOwnerToEdit] = useState([])
  const [equipmentToEdit, setEquipmentToEdit] = useState([])
  const [featuredRental, setFeaturedRental] = useState([])

  //Do I even need two state variables to do this ? Turns out all original fetches work


  //---------------------------------Posts and general Fetches -----------------------
  //Going to improvise this for the post also / maybe patch also?
  useEffect(() => {
    fetch("http://127.0.0.1:5555/equipment")
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])

  const addEquipment = (equipment) => {
    setEquipmentArray(equipmentArray => [...equipmentArray, equipment])
  }

  //----------------------------------------------------------------

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

  //These will be the Post useEffects - OWNERS -- THIS HAD RENTERS
  useEffect(() => {
    fetch("http://127.0.0.1:5555/equipment_owners")
      .then((resp) => resp.json())
      .then((data) => {
        setOwners(data)
      })
  }, [])

  const addOwner = (owner) => {
    setOwners(owners => [...owners, owner])
  }

  // The above is also used for EDIT by that I mean the state variable setOwners

  //---------------------------------------------------------------------------------
  //POST RENTAL AGREEMENTS

  useEffect(() => {
    fetch("http://127.0.0.1:5555/rental_agreements")
      .then((resp) => resp.json())
      .then((data) => {
        setRentalAgreement(data)
      })
  }, [])

  const addRentalAgreement = (rentalAgreement) => {
    setRentalAgreement(rentalAgreements => [...rentalAgreements, rentalAgreement])
  }

  //-----------------------Edit content begins here----------------------------------
  // EDIT/PATCH OWNERS-------------------------

  const updateOwner = (ownerToUpdate) => {
    setOwners(owners => owners.map(owner => {
      if (owner.id === ownerToUpdate.id) {
        return ownerToUpdate
      } else {
        return owner
      }
    }))

  }

  const handleEditOwner = (owner) => {
    setOwnerToEdit(owner)
    navigate(`/owner/${owner.id}/edit`)
  }


  //EDIT/PATCH Equipment --------------------------

  const updateEquipment = (equipmentToUpdate) => {
    setEquipmentArray(equipments => equipments.map(equipment => {
      if (equipment.id === equipmentToUpdate.id) {
        return equipmentToUpdate
      } else {
        return equipment
      }
    }))

  }

  const handleEditEquipment = (equipment) => {
    setEquipmentToEdit(equipment)
    navigate(`/equipment/${equipment.id}/edit`)
  }

  //-----------------------------------------DELETE CONTENT BELOW--------------------
  // ------------------------delete here FOR OWNER-------------------------------

  const deleteOwner = (ownerToDelete) => {
    setOwners(owners =>
      owners.filter(owner => owner.id !== ownerToDelete.id))
  }


  const handleOwnerDelete = (owner) => {
    fetch(`http://127.0.0.1:5555/equipment_owner/${owner.id}`, {
      method: "DELETE"
    })
      .then(() => {
        deleteOwner(owner)
        navigate('/equipment_owners')
      })
  }


  //--------------------Delete for PRODUCTS/EQUIPMENT below---------------------------------------------------

  const deleteEquipment = (equipmentToDelete) => {
    setEquipmentArray(equipments =>
      equipments.filter(equipment => equipment.id !== equipmentToDelete.id))
  }

  const handleEquipmentDelete = (equipment) => {
    fetch(`http://127.0.0.1:5555/equipment/${equipment.id}`, {
      method: "DELETE"
    })
      .then(() => {
        deleteEquipment(equipment)
        navigate('/equipment')
      })
  }
  //------------------------------------------------------------------------------------------------------





  // I believe this is the search -----------------------
  const filteredEquipmentArray = equipmentArray.filter((item) => {
    return item.model.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.make.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  })
  //-----------------------------------------------------

  return (
    <div >
      <NavBar setSearchTerm={setSearchTerm} />
      <Routes>

        <Route path='/' element={<HomePage equipmentArray={equipmentArray} setFeaturedRental={setFeaturedRental} />} />

        <Route path='/equipment' element={<ProductCollection equipmentArray={filteredEquipmentArray} handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment} />} />
        <Route path='/equipment_owners' element={<OwnerCollection searchTerm={searchTerm} handleEditOwner={handleEditOwner} handleOwnerDelete={handleOwnerDelete} equipmentOwnerArray={owners} />} />
        <Route path='/rental_agreements' element={<RentalCollection />} />

        {/* ID ROUTES */}
        <Route path='/equipment/:id' element={<ProductDisplay />} />
        <Route path='/equipment_owners/:id' element={<OwnerDisplay />} />

        {/* Respective Posts */}
        <Route path='/renter_signup' element={<UserForm addUser={addUser} />} />
        <Route path='/owner_signup' element={<OwnerForm addOwner={addOwner} />} />
        <Route path='/equipment_signup' element={<ProductForm addEquipment={addEquipment} />} />
        <Route path='/rental_signup' element={<RentalForm addRentalAgreement={addRentalAgreement} owners={owners} equipmentArray={equipmentArray} />} />
        <Route path='/rental_signup_prepop' element={<RentalFormPrepop addRentalAgreement={addRentalAgreement} owners={owners} equipmentArray={equipmentArray} featuredRental={featuredRental} />} />


        {/* Respective Edit Routes */}
        <Route path='/owner/:id/edit' element={<OwnerEditForm ownerToEdit={ownerToEdit} updateOwner={updateOwner} />} />
        <Route path='/equipment/:id/edit' element={<ProductEditForm equipmentToEdit={equipmentToEdit} updateEquipment={updateEquipment} />} />

      </Routes>


    </div>
  );
}

export default App;
