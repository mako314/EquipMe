import React, { useContext, useState, useEffect, Fragment } from 'react';
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
import DoughnutChart from '../../ChartComponents/DoughnutChart';
import BarChart from '../../ChartComponents/BarChart';

// AgreementFiltering 
import AgreementFiltering from './AgreementFiltering';

// Carousel Import
import FavoriteCarousel from './FavoritedCarousel';

//Rental Monitor
import RentalMonitor from './RentalMonitor';

//404 Page Import
import Page404 from '../../ErrorPageComponents/Page404';


function OwnerDashboard({fromOwnerDash, setFromOwnerDash, searchTerm}) {
    // Honestly with currentUser, we can just make this for both users and owners

    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)

    const [isLoading, setIsLoading] = useState(false)
    const [currentView, setCurrentView] = useState('home')
    const [potentialRentalUsers, setPotentialRentalUsers] = useState([])
    const [potentialRentalOwners, setPotentialRentalOwners] = useState([])
    const [pageTitle, setPageTitle] = useState('Home')
    const [updateCounter, setUpdateCounter] = useState(0)

    // const [chartData, setChartData] = useState({
    //     labels: [],
    //     datasets: []
    //   })
    
    const navigate = useNavigate()
    

    // console.log("USER INFO",currentUser)
    // console.log("USER FAVORITE",currentUser?.user_favorite)
    // console.log("With a role of:", role)

    //After a lot of consideration, users will also have a dashboard. Seems friendlier 

    //--------------------user--------
    //----- Variables in the order they appear ----- These are ALL being moved to components shortly.
    let firstName
    let equipment
    let lastName
    const userLoggedOut='You Must be Logged in to view this Page'
    if (currentUser){
         firstName  = currentUser.firstName
         lastName = currentUser.lastName
         equipment = currentUser.equipment
    }

    //Owner csv uploading
    const handleCsvClick = (e) => {
        navigate('/temp/bulk_equipment_upload')
    }

    function RentalAgreements() {
        // setPageTitle('Rental Agreements')
        fromOwnerDash = true
        console.log("RENTAL AGREEMENTS IN OWNER DASH FROM OWNER DASH:", fromOwnerDash)
        // agreementFiltering={agreementFiltering}
        return(<>
            <RentalAgreementsCollection setFromOwnerDash={setFromOwnerDash} fromOwnerDash={fromOwnerDash} /> 
        </>)
    }

    const handlePotentialOwners = () => {
        setIsLoading(true)
        // setPageTitle('Your Favorites')
        fetch(`${apiUrl}owners/${currentUser?.profession}`)
        .then((resp) => resp.json())
        .then((data) => {
            setPotentialRentalOwners(data)
            setCurrentView('Potential Owners')
            setPageTitle('Potential Owners')
            setIsLoading(false)
            setFromOwnerDash(prevState => !prevState)
        })
    }

    function UserFavorites() {
        const [selectedFavorite, setSelectedFavorite] = useState('equipment')

        // setPageTitle('Your Favorites')
        const handleRadioChange = (event) => {
            setSelectedFavorite(event.target.value)
        }

        console.log(selectedFavorite)

        return (
            <div className="ml-6">

                <form className="flex flex-row items-center mb-4">

                <div className="flex items-center ml-4 mr-2 mt-4">
                <input
                    className="form-radio h-5 w-5 text-gray-600" 
                    type="radio" 
                    name="fav_option" 
                    value="equipment" 
                    id="equipment" 
                    onChange={handleRadioChange} 
                    checked={selectedFavorite === 'equipment'}
                />
                <label htmlFor="equipment" className="ml-2 text-gray-700">Equipment</label>
                </div>

                <div className="flex items-center ml-4 mr-2 mt-4">
                <input
                    className="form-radio h-5 w-5 text-gray-600" 
                    type="radio" 
                    name="fav_option" 
                    value="owner" 
                    id="owner" 
                    onChange={handleRadioChange} 
                    checked={selectedFavorite === 'owner'}
                />
                <label htmlFor="owner" className="ml-2 text-gray-700">Owner</label>
                </div>

                </form>

                <div className="flex flex-row flex-wrap justify-start"> 
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
            </div>
        )
    }

//-------------------------------------------------------------OWNER CONDITIONAL DATA --------------------------------------------------------------------
function OwnerFavorites() {
    // setPageTitle('Your Favorites')
    currentUser?.owner_favorite?.map((favorite) =>console.log("THE USER IDS:",favorite?.user.user_id))
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {currentUser?.owner_favorite?.map((favorite) => {
            return (
                <UserCard
                    key={favorite.id}
                    id={favorite.user_id}
                    firstName={favorite.user.firstName}
                    lastName={favorite.user.lastName}
                    email={favorite.user.email}
                    phone={favorite.user.phone}
                    profileImage={favorite.user.profileImage}
                    location={favorite.user.location}
                />)
            })}
        </div>
    )
}


//----------------------------------------activeListings------------------------------
// Need to build out a back to dash button here for owners along with edit functionality 
function ActiveListings(){
    if (!currentUser) return null
    // setPageTitle('Active Listings')
    return(
    <div>
        <ProductCollection equipmentArray={currentUser.equipment}/>
    </div>
    )
}

//---------------------------------------accountSettings------------------------------------

function AccountSettings() {
    if (!currentUser) return null
    // THIS ALMOST CONFUSED ME, BUT THIS FORM  EDITS BOTH USERS AND OWNERS
    // setPageTitle('Account Settings')
    return (
        <>
            <OwnerEditForm/>
        </>
    )
}

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
// I'll be removing these useEffects soon enough: 
// https://react.dev/learn/synchronizing-with-effects#fetching-data
// https://store.steampowered.com/points/shop/c/backgrounds/cluster/0/reward/181174
    const handlePotentialRenter = () => {
    setIsLoading(true)
    fetch(`${apiUrl}users/${currentUser?.profession}`)
    .then((resp) => resp.json())
    .then((data) => {
        setCurrentView('Potential Renters')
        setPageTitle('Potential Renters')
        setPotentialRentalUsers(data)
        setFromOwnerDash(prevState => !prevState)
        setIsLoading(false)
        // Takes 314ms in network tab for this to load. Going to need a loading indicator :crY:
        })
    }

    const handleInboxNavigation = () => {
        setFromOwnerDash(true)
        // Use setTimeout to allow state update before navigation
        setTimeout(() => {
          navigate('/messaging')
        }, 0)
      }

    const handlePublicProfileNav = () => {
        setFromOwnerDash(true)
        // Use setTimeout to allow state update before navigation
        setTimeout(() => {
            navigate( role === 'owner' ? `/equipment_owner/${currentUser.id}`: `/user/profile/${currentUser.id}`)
        }, 0)
      }

//----------------------------------------------------------AGREEEMENT FILTERING----------------------------------------------------------------------------------------

    // console.log("CURRENT USER AGREEMENTS:", currentUser?.agreements)
    
    function DashHome() {
        // setPageTitle('Home')
        return(
            <div>
                {/* CENTER OF PAGE , BLOCKS AND SUCH  */}
                <div className="flex-grow p-6 overflow-auto bg-gray-200">
                    <div className="grid grid-cols-3 gap-6">
                        
                        <div className="h-24 col-span-3 bg-white border border-gray-300 text-center"> Welcome {currentUser.firstName} </div>

                        <div className="h-96 py-2 col-span-1 bg-white border border-gray-300">
                        
                        {/* {role === 'owner' ? <Doughnut
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                            data={doughnutData}
                        /> : ""} */}
                        <DoughnutChart currentUser={currentUser} role={role}/>
                        </div>
                        
                        <div className="h-96 w-full col-span-2 bg-white border border-gray-200 shadow-md rounded-lg p-4">
                        {role === 'owner' &&
                        <BarChart currentUser={currentUser} setUpdateCounter={setUpdateCounter} updateCounter={updateCounter}/>}
                        </div>

                        <div className="h-96 col-span-1 bg-white border border-gray-300 overflow-y-auto">
                        {/* // ----------------- agreement selection options ------------------- */}
                       {/* {selectionAgreementForm} */}

                        {/* {agreementFiltering === 'newest' ? sortedAscendingAgreements : sortedDescendingAgreements} */}

                        <AgreementFiltering currentUser={currentUser} role={role}/>

                        </div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300 p-4 overflow-hidden">

                        {/* {role === 'owner' && */}
                        <FavoriteCarousel currentUser={currentUser} setFromOwnerDash={setFromOwnerDash}/>
                        
                        </div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300">
                            <RentalMonitor currentUser={currentUser} role={role}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // Two empty divs that was above
    // <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
    // <div className="h-24 col-span-2 bg-white border border-gray-300"></div>

    const renderCurrentView = () => {
        switch (currentView) {
            case 'Home':
                return <DashHome />
            case 'Active Listings':
                return <ActiveListings />
            case 'Rental Agreements':
                return <RentalAgreements />
            case 'Potential Renters':
                if (isLoading) {
                    return <div>Loading...</div> // Loading indicator
                }
                return (
                    <UserCollection
                        searchTerm={searchTerm}
                        users={potentialRentalUsers}
                        setFromOwnerDash={setFromOwnerDash}
                        fromOwnerDash={fromOwnerDash}
                    />
                )
            case 'Potential Owners':
                const ownerCollection = potentialRentalOwners.length > 0 ? (
                <OwnerCollection
                key={"dash"}
                searchTerm={searchTerm} 
                equipmentOwnerArray={potentialRentalOwners} 
                setFromOwnerDash={setFromOwnerDash} 
                fromOwnerDash={fromOwnerDash}/>
                ) : <div> currently no Owners signed up with the same profession</div>
                return ownerCollection
            case 'Owner Favorites':
                return <OwnerFavorites/>
            case 'User Favorites':
                return <UserFavorites/>
            case 'Account Settings':
                return <AccountSettings/>
            default:
                return <DashHome />
        }
    }
    // {renderCurrentView()}

    const handleViewClick = (viewName) => {
        setCurrentView(viewName)
        setPageTitle(viewName)
    }
    

    function LoggedInDisplay(){
        return(
            <>
                <div className="flex w-screen h-screen text-gray-700">

                    {/* <!-- Component Start --> */}
                    
                    <div className="flex flex-col w-56 border-r border-gray-300">
                    <div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 hover:bg-gray-300">
                    <img 
                            src={currentUser.profileImage} 
                            alt={`${currentUser.firstName}'s profile`}
                            className="h-10 w-10 rounded-full object-cover ml-2" 
                            />
                            <span className="font-medium mr-4">
                            {currentUser.firstName} {currentUser.lastName}
                            </span>
                    </div>
                    {/* Made it a fixed width because it constantly changing sizes was irritating me  */}
                        <div className="flex flex-col w-60 flex-grow p-4 overflow-auto">

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => handleViewClick('Home')}> Home </span>

                            {role === 'owner' &&
                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => handleViewClick('Active Listings')}> Active listings </span>}
                            

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => handleViewClick('Rental Agreements')}> Rental Agreements</span> 
 
                             <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => {
                                {role === 'owner' ? handleViewClick('Owner Favorites') : handleViewClick('User Favorites')} 
                             }}> 
                                Favorites
                             </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => {
                                (role === 'owner' ? handlePotentialRenter() : handlePotentialOwners())}}>

                                {role === 'owner' ? 'Potential Renters' : 'Potential Rental Interests'}
                            </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={handlePublicProfileNav}> Your Public Profile</span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" 
                             onClick={() => handleViewClick('Account Settings')}
                            > Account Settings </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={handleInboxNavigation}
                            > Inbox </span>

                        </div>

                    </div>
                    <div className="flex flex-col overflow-auto flex-grow">
                        <div className="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">

                            <h1 className="text-lg font-medium">{pageTitle}</h1>
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
                        {renderCurrentView()}
                    </div>
                    
                    {/* <!-- Component End  --> */}

                </div>
            </>
        )
    }

    return (
        <>
            {currentUser ? <LoggedInDisplay/> : <Page404 errorString={userLoggedOut}/>}
        </>
    )
}

export default OwnerDashboard