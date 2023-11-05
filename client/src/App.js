import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';

import './App.css';
//---------------------Homepage / Navbar / Footer-------------
import HomePage from './HomePageComponents/HomePage';
import NavBar from './HeaderFooterComponents/NavBar';
import Footer from './HeaderFooterComponents/Footer'

//---------------------Collections--------------------
import ProductCollection from './EquipmentComponents/ProductCollection';
import OwnerCollection from './OwnerComponents/OwnerCollection';
import RentalCollection from './RentalComponents/RentalCollection'
import UserCollection from './UserComponents/UserCollection';

//-------------------------Display Pages-----------------------------------
import ProductDisplay from './EquipmentComponents/ProductDisplay';
import OwnerDisplay from './OwnerComponents/OwnerDisplay';

//-------------------------UserForms----------------------------------------
import UserForm from './UserComponents/UserForm';

//-------------------------OwnerForms---------------------------------------
import OwnerForm from './OwnerComponents/OwnerForm';
import OwnerEditForm from './OwnerComponents/OwnerEditForm'

//------------------------ProductForm-------------------------------------
import ProductForm from './EquipmentComponents/ProductForm';
import ProductEditForm from './EquipmentComponents/ProductEditForm';
import RentalForm from './RentalComponents/RentalForm';
import OwnerEquipmentListing from './RentalComponents/OwnerEquipmentListing'

//----------------------User Login Functionality-----------------------------
import UserLogin from './UserComponents/UserLogin';
import { UserProvider } from './UserComponents/UserContext';

//----------------------Owner Login Functionality-----------------------------
import OwnerLogin from './OwnerComponents/OwnerLogin';
import { OwnerProvider } from './OwnerComponents/OwnerContext';

//----------------------User Functionality-----------------------------
import UserProfile from './UserComponents/UserProfile';
import UserCard from './UserComponents/UserCard';

//----------------------Owner Dashboard-----------------------------
import OwnerDashboard from './OwnerComponents/OwnerDashboardComponents/OwnerDashboard';


//----------------------Temporary Calendar-----------------------------
import Calendar from './CalendarComponents/Calendar';


//----------------------Temporary File Uploader for Equipment Images-----------------------------
import EquipmentImageFileUpload from './EquipmentComponents/EquipmentImageFileUpload' 
import ProductImageForm from './EquipmentComponents/ProductImageForm';
import BulkEquipmentUpload from './EquipmentComponents/BulkEquipmentUpload';

//---------------------- Messaging Component-----------------------------
import MessageThreads from './MessagingComponents/MessageThreads'
import NewMessageThreads from './MessagingComponents/NewMessageThreads';

//---------------------- Checkout -----------------------------
import Checkout from './CheckoutComponents/Checkout';
import Cart from './CheckoutComponents/Cart';

//---------------------- Toastify -----------------------------
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function App() {

  //forgot to const navigate = useNavigate()
  const navigate = useNavigate()


  //Grab user and have it throughout the whole app
  const [user, setUser] = useState(null)

  //Grab Owner and have it throughout the whole app
  const [owner, setOwner] = useState(null)

  //These useStates will handle POST. Grabbing and ...spreading so it updates accordingly. Set Search Term & Grab Equipment Array
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

  // State to determine if you came from ownerDash, below will be more state to control owner actions
  const [fromOwnerDash, setFromOwnerDash] = useState(false)

  //-------------------------------------------- FOR USER - CHECK SESSION TO STAY LOGGED IN ON REFRESH--------------------------

  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);

  // console.log(user)

  //------------------------------------------------------------------------------------------------------------------

  //-------------------------------------------- FOR OWNER - CHECK SESSION TO STAY LOGGED IN ON REFRESH--------------------------

  useEffect(() => {
    fetch("/owner/check_session").then((response) => {
      if (response.ok) {
        response.json().then((owner) => setOwner(owner));
      }
    });
  }, []);

  // console.log(owner)

  //------------------------------------------------------------------------------------------------------------------
  
  //---------------------------------Fetches -----------------------
  //---------------------------------Posts and general Fetches -----------------------
  //Going to improvise this for the post also / maybe patch also?
  useEffect(() => {
    fetch("/api/equipment")
      .then((resp) => resp.json())
      .then((data) => {
        setEquipmentArray(data)
      })
  }, [])

  const addEquipment = (equipment) => {
    setEquipmentArray(equipmentArray => [...equipmentArray, equipment])
  }

  //------------------------------USERS----------------------------------------------

  //These will be the Post useEffects - USERS
  useEffect(() => {
    fetch("/api/users")
      .then((resp) => resp.json())
      .then((data) => {
        setUsers(data)
      })
  }, [])

  const addUser = (user) => {
    setUsers(users => [...users, user])
  }
  //------------------------------OWNERS----------------------------------------------

  //These will be the Post useEffects - OWNERS -- THIS HAD RENTERS
  useEffect(() => {
    fetch("/api/equipment_owners")
      .then((resp) => resp.json())
      .then((data) => {
        setOwners(data)
      })
  }, [])

  const addOwner = (owner) => {
    setOwners(owners => [...owners, owner])
  }
  // The above is also used for EDIT by that I mean the state variable setOwners

  // Delete here FOR OWNER--

    const deleteOwner = (ownerToDelete) => {
      setOwners(owners =>
        owners.filter(owner => owner.id !== ownerToDelete.id))
    }
  
  
    const handleOwnerDelete = (owner) => {
      fetch(`/api/equipment_owner/${owner.id}`, {
        method: "DELETE"
      })
        .then(() => {
          deleteOwner(owner)
          navigate('/equipment_owners')
        })
    }

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

  //------------------------------RENTAL AGREEMENTS----------------------------------------------
  //POST RENTAL AGREEMENTS

  useEffect(() => {
    fetch("/api/rental_agreements")
      .then((resp) => resp.json())
      .then((data) => {
        setRentalAgreement(data)
      })
  }, [])

  const addRentalAgreement = (rentalAgreement) => {
    setRentalAgreement(rentalAgreements => [...rentalAgreements, rentalAgreement])
  }

  //------------------------------Equipment----------------------------------------------
  //EDIT/PATCH Equipment

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


  //Delete for PRODUCTS/EQUIPMENT below

  const deleteEquipment = (equipmentToDelete) => {
    setEquipmentArray(equipments =>
      equipments.filter(equipment => equipment.id !== equipmentToDelete.id))
  }

  const handleEquipmentDelete = (equipment) => {
    fetch(`/equipment/${equipment.id}`, {
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
    return item.model?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.location?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.make?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  })
  //-----------------------------------------------------

  return (
    // UseContext gets called here, allowing the entirety of my app access to the USER and OWNER information!
    <OwnerProvider>
      <UserProvider>
        <>
          <NavBar setSearchTerm={setSearchTerm} />

          <Routes>
            {/* Home Page */}
            <Route path='/' element={<HomePage equipmentArray={equipmentArray} setFeaturedRental={setFeaturedRental} />} />

            {/* COLLECTION ROUTES */}
            <Route path='/equipment' element={<ProductCollection equipmentArray={filteredEquipmentArray} handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment} />} />
            <Route path='/equipment_owners' element={<OwnerCollection searchTerm={searchTerm} handleEditOwner={handleEditOwner} handleOwnerDelete={handleOwnerDelete} equipmentOwnerArray={owners} />} />
            <Route path='/rental_agreements' element={<RentalCollection />} />
            <Route path='/users/extra' element={<UserCollection searchTerm={searchTerm} users={users}/>} />
    
            {/* ID / INDIVIDUAL / DISPLAY ROUTES */}
            <Route path='/equipment/:id' element={<ProductDisplay />} />
            <Route path='/equipment_owner/:id' element={<OwnerDisplay />} />

            {/* Respective Posts */}
            <Route path='/renter_signup' element={<UserForm addUser={addUser} />} />
            <Route path='/owner_signup' element={<OwnerForm addOwner={addOwner} />} />
            {/* need to rename the below to equipment_post */}
            <Route path='/list_equipment' element={<ProductForm addEquipment={addEquipment} />} />

            {/* Starting rentals, likely just going to use the prepop as it makes more sense than to do a "rental signup", in which a user sifts through all of the owners lol. This might not be the worst idea to incorporate into a search though. For example, filter by location, and then equipment type. The owner shouldn't really matter. But we can take into consideration the owners reviews / ratings and filter by lets say 3+ star renters. */}
            {/* I definitely don't need both of these. Likely going to remove OwnerEquipMentListing */}
            <Route path='/rental_signup' element={<RentalForm addRentalAgreement={addRentalAgreement} owners={owners} equipmentArray={equipmentArray} />} />
            <Route path='/rental_signup_prepop' element={<OwnerEquipmentListing addRentalAgreement={addRentalAgreement} owners={owners} equipmentArray={equipmentArray} featuredRental={featuredRental} />} />
            {/* Rename this too ^^^ */}

            {/* Respective Edit Routes */}
            <Route path='/owner/:id/edit' element={<OwnerEditForm ownerToEdit={ownerToEdit} updateOwner={updateOwner} />} />
            <Route path='/equipment/:id/edit' element={<ProductEditForm equipmentToEdit={equipmentToEdit} updateEquipment={updateEquipment} />} />

            {/* Login Page Route */}
            <Route path='/login' element={<UserLogin />} />
            <Route path='/owner/login' element={<OwnerLogin />} />

            {/* User Profile Page*/}
            <Route path='/user/profile/:id' element={<UserProfile/>} />

            {/* Temp Route for CSV File Upload*/}
            <Route path='/temp/bulk_equipment_upload' element={<BulkEquipmentUpload />} />

            {/* Owner Dashboard Page*/}
            <Route path='/owner/dashboard' element={<OwnerDashboard updateOwner={updateOwner} ownerToEdit={ownerToEdit} fromOwnerDash={fromOwnerDash} setFromOwnerDash={setFromOwnerDash} searchTerm={searchTerm}/>} />

            {/* Temporary calendar routing */}
            <Route path='/temp/calendar' element={<Calendar />} />

            {/* Temporary file upload routing */}
            <Route path='/temp/upload' element={<EquipmentImageFileUpload />} />
            <Route path='/temp/equipment/upload' element={<ProductImageForm />} />

            {/* Messaging routing  */}
            <Route path='/messaging' element={<NewMessageThreads fromOwnerDash={fromOwnerDash}/>} />
            <Route path='/user/card/:id' element={<UserCard/>} />

            {/* Temporary Checkout Routing */}
            <Route path='/checkout' element={<Checkout/>} />
            <Route path='/cart' element={<Cart/>} />


          </Routes>
          <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />

          <Footer />
        </>
      </UserProvider>
    </OwnerProvider>
  );
}

export default App;
