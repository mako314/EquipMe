import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

//Owner Imports//
import ProductCollection from '../../EquipmentComponents/ProductCollection'
import OwnerEditForm from '../OwnerEditForm';
import UserCollection from '../../UserComponents/UserCollection';
import UserCard from '../../UserComponents/UserCard';
import ApiUrlContext from '../../Api';

//User Imports//
import RentalAgreementsCollection from '../../RentalComponents/RentalAgreementsCollection';
import OwnerCollection from '../OwnerCollection'
import ProductCard from '../../EquipmentComponents/ProductCard'
import OwnerCard from '../OwnerCard';


import { UserSessionContext } from '../../UserComponents/SessionContext';
import { ReactComponent as EquipMeLogo } from '../../Content/EquipMeLogo.svg'

//Chart imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


function OwnerDashboard({fromOwnerDash, setFromOwnerDash, searchTerm}) {


    const { currentUser, role} = UserSessionContext()
    // Honestly with currentUser, we can just make this for both users and owners
    const [toggleHomeDash, setToggleHomeDash] = useState(<DashHome/>)
    const [potentialRentalUsers, setPotentialRentalUsers] = useState([])
    const [potentialRentalOwners, setPotentialRentalOwners] = useState([])
    
    
    const apiUrl = useContext(ApiUrlContext)

    console.log("USER INFO",currentUser)
    console.log("USER FAVORITE",currentUser?.user_favorite)
    // console.log("With a role of:", role)

    //After a lot of consideration, users will also have a dashboard. Seems friendlier 

    // const {
    //     email = '',
    //     firstName = '',
    //     lastName = '',
    //     location = '',
    //     phone = '',
    //     profession = '',
    //     profileImg = ''
    //   } = source || {}

    //--------------------user--------
    let potentialOwners
    
    //----- Variables in the order they appear ----- These are ALL being moved to components shortly.
    let plannedDeals
    let potentialRenters

    let firstName
    let equipment
    let lastName
    if (currentUser){
         firstName  = currentUser.firstName
         lastName = currentUser.lastName
         equipment = currentUser.equipment
    }

    const navigate = useNavigate()

    const handleCsvClick = (e) => {
        navigate('/temp/bulk_equipment_upload')
    }



    function RentalAgreements() {
        fromOwnerDash = true
        console.log("RENTAL AGREEMENTS IN OWNER DASH FROM OWNER DASH:", fromOwnerDash)
        return(<>
            <RentalAgreementsCollection setFromOwnerDash={setFromOwnerDash} fromOwnerDash={fromOwnerDash}/>
        </>)
    }

    const handlePotentialOwners = () => {
        fetch(`${apiUrl}owners/${currentUser?.profession}`)
        .then((resp) => resp.json())
        .then((data) => {
            
            const ownerCollection = data.length > 0 ? (
                <OwnerCollection
                    key={"dash"}
                    searchTerm={searchTerm} 
                    equipmentOwnerArray={data} 
                    setFromOwnerDash={setFromOwnerDash} 
                    fromOwnerDash={fromOwnerDash}/>
            ) : <div> currently no Owners signed up with the same profession</div>
            setToggleHomeDash(ownerCollection)
        })
    }

    function UserFavorites() {
        const [selectedFavorite, setSelectedFavorite] = useState('equipment')

        const handleRadioChange = (event) => {
            setSelectedFavorite(event.target.value)
        }

        console.log(selectedFavorite)

        return (
            <div className="flex flex-wrap ml-4 pt-4">
                <form>
                <input 
                    type="radio" 
                    name="fav_option" 
                    value="equipment" 
                    id="equipment" 
                    onChange={handleRadioChange} 
                    checked={selectedFavorite === 'equipment'}
                />
                <label htmlFor="equipment">Equipment</label>
                <input 
                    type="radio" 
                    name="fav_option" 
                    value="owner" 
                    id="owner" 
                    onChange={handleRadioChange} 
                    checked={selectedFavorite === 'owner'}
                />
                <label htmlFor="owner">Owner</label>
                </form>
                {currentUser?.user_favorite?.map((favorite) => {
                    if (selectedFavorite === 'equipment' && favorite.equipment_id && favorite.equipment) {
                        return (
                            <ProductCard
                                key={favorite.id}
                                id={favorite.equipment.id}
                                name={favorite.equipment.name} 
                                model={favorite.equipment.model}
                                make={favorite.equipment.make}
                                location={favorite.equipment.location}
                                equipment_image={favorite.equipment.equipment_image}
                            />
                        )
                    } else if (selectedFavorite === 'owner' && favorite.owner_id && favorite.owner){
                        return (
                            <OwnerCard
                            key={favorite.id}
                            id={favorite.owner.id}
                            firstName={favorite.owner.firstName}
                            lastName={favorite.owner.lastName} 
                            location={favorite.owner.location}
                            phone={favorite.owner.phone}
                            profileImage={favorite.owner.profileImage} 
                            />
                        )
                    }
                    return null
                })}
            </div>
        )
    }

//-------------------------------------------------------------OWNER CONDITIONAL DATA --------------------------------------------------------------------
function OwnerFavorites() {
    currentUser?.owner_favorite?.map((favorite) =>console.log("THE USER IDS:",favorite?.user.user_id))
    return (
        <div className="flex flex-wrap ml-4 pt-4">
            {currentUser?.owner_favorite?.map((favorite) => {

            return (
                <div className='ml-4'> 
                <UserCard
                    key={favorite.id}
                    id={favorite.user_id}
                    firstName={favorite.user.firstName}
                    lastName={favorite.user.lastName}
                    email={favorite.user.email}
                    phone={favorite.user.phone}
                    profileImage={favorite.user.profileImage}
                />
                </div>
                    )
            })}
        </div>
    )
}


//----------------------------------------activeListings------------------------------
// Need to build out a back to dash button here for owners along with edit functionality 
function ActiveListings(){
    if (!currentUser) return null

    return(
    <div>
        <ProductCollection equipmentArray={currentUser.equipment}/>
    </div>
    )
}

//---------------------------------------accountSettings------------------------------------

function AccountSettings() {
    if (!currentUser) return null

    return (
        <>
            <OwnerEditForm/>
        </>
    )
}

//------------------------------------------------------------------------------------

    plannedDeals =
        <div> Planned Deals </div>
//------------------------------------------------------------------------------------
// I'll be removing these useEffects soon enough: 
// https://react.dev/learn/synchronizing-with-effects#fetching-data
// https://store.steampowered.com/points/shop/c/backgrounds/cluster/0/reward/181174
    const handlePotentialRenter = () => {
    fetch(`${apiUrl}users/${currentUser?.profession}`)
    .then((resp) => resp.json())
    .then((data) => {
        setPotentialRentalUsers(data)
        //can't use potentialRenters as the let, I was having issues with it taking two clicks, having a const like the other function seemed to fix it. It's funny because I built this one first, and then shallow copied it for handlePotentialOwner. Lord.
        // Takes 314ms in network tab for this to load. Going to need a loading indicator :crY:
        const updatedPotentialRenters = (
            <UserCollection searchTerm={searchTerm} users={data} setFromOwnerDash={setFromOwnerDash} fromOwnerDash={fromOwnerDash}/>
        )

        const emptyData = <div> loading </div>
        setToggleHomeDash(data.length > 0 ? updatedPotentialRenters: emptyData)
        setFromOwnerDash(!fromOwnerDash)
        })
    }

    const handleInboxNavigation = () => {
        setFromOwnerDash(true)
        // Use setTimeout to allow state update before navigation
        setTimeout(() => {
          navigate('/messaging')
        }, 0)
      }

    
    //-----------------------------------------------CHART CODE -------------------------
    ChartJS.register(ArcElement, Tooltip, Legend)

    let doughnutData = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }


    function DashHome(){
        return(
            <div>
                {/* CENTER OF PAGE , BLOCKS AND SUCH  */}
                <div className="flex-grow p-6 overflow-auto bg-gray-200">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-24 col-span-3 bg-white border border-gray-300 text-center"> Welcome {currentUser.firstName} </div>
                        <div className="h-96 py-2 col-span-1 bg-white border border-gray-300">
                        
                        <Doughnut
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                            data={doughnutData}
                        />
                        
                        </div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
                        <div className="h-96 w-500 col-span-2 bg-white border border-gray-300">

                        </div>
                        
                        <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
                    </div>
                </div>
            </div>
        )
    }
    // Two empty divs that was above
    // <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
    // <div className="h-24 col-span-2 bg-white border border-gray-300"></div>
    

    function LoggedInDisplay(){
        return(
            <>
                <div className="flex w-screen h-screen text-gray-700">

                    {/* <!-- Component Start --> */}
                    
                    <div className="flex flex-col w-56 border-r border-gray-300">
                    <div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 hover:bg-gray-300">
                        <span className="font-medium">
                            {currentUser.firstName} {currentUser.lastName}
                        </span>
                    </div>
                        <div className="flex flex-col flex-grow p-4 overflow-auto">

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(<DashHome/>)}> Home </span>

                            {/* {role === 'owner' ? 
                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(<ActiveListings/>)}> Active listings </span> 
                            : 
                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(
                            <RentalAgreements/>
                            )}> Rental Agreements  </span>} */}
                            {role === 'owner' &&
                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(<ActiveListings/>)}> Active listings </span>}

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(<RentalAgreements/>)}> Rental Agreements</span> 
 
                            
                            {/* <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(<ActiveListings/>)}> Active listings </span>  */}
                            {/* <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(plannedDeals)}> Planned Deals </span> */}

                             <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => {
                                {role === 'owner' ? setToggleHomeDash(<OwnerFavorites/>) : setToggleHomeDash(<UserFavorites/>)} 
                             }}> 
                                Favorites
                             </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => {
                                (role === 'owner' ? handlePotentialRenter() : handlePotentialOwners())}}>

                                {role === 'owner' ? 'Potential Renters' : 'Potential Rental Interests'}
                            </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" 
                            onClick={() => setToggleHomeDash(<AccountSettings/>)}
                            > Account Settings </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={handleInboxNavigation}
                            > Inbox </span>
                            
                            <span className="flex items-center flex-shrink-0 h-10 px-3 mt-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="ml-2 leading-none">New Item</span>
                            </span>
                        </div>

                    </div>
                    <div className="flex flex-col overflow-auto flex-grow">
                        <div className="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">

                            <h1 className="text-lg font-medium">Page Title</h1>
                            {role === 'owner' && <>
                            <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-300" onClick={handleCsvClick}>
                                Upload Equipment File

                            </button>
                            {/* <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300">
                                Action 2
                            </button> */}
                            
                            <Link to='/list_equipment'>
                                <button className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" onClick={() => setFromOwnerDash(true)}> List an Item</button>
                            </Link>
                            </>
                            }

                            <button className="relative ml-2 text-sm focus:outline-none group">
                                <div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-300">
                                    <svg className="w-5 h-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </div>
                                <div className="absolute right-0 flex-col items-start hidden w-40 pb-1 bg-white border border-gray-300 shadow-lg group-focus:flex">
                                    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
                                    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
                                    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
                                </div>
                            </button>
                        </div>
                        {toggleHomeDash}
                    </div>
                    
                    {/* <!-- Component End  --> */}

                </div>
            </>
        )
    }

    function LoggedOutDisplay(){

        return (
            <div> you must be logged in to view this page </div>
        )
    }

    return (
        <>
            {currentUser ? <LoggedInDisplay/> : <LoggedOutDisplay/>}
        </>
    )
}

export default OwnerDashboard





{/* <button className="relative text-sm focus:outline-none group">
<div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 hover:bg-gray-300">
    <span className="font-medium">
        Dropdown
    </span>
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
</div>
<div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-white shadow-lg group-focus:flex">
    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" onClick={() => setToggleHomeDash(<AccountSettings/>)}> Account Settings </span>
    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" > Possible Conversions </span>
    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" > Graphs </span>
</div>
</button> */}