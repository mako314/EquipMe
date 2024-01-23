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


// Order History Attempt//
import OrderHistory from '../../CheckoutComponents/OrderHistory';


import { UserSessionContext } from '../../UserComponents/SessionContext';
import { ReactComponent as EquipMeLogo } from '../../Content/EquipMeLogo.svg'

//Chart imports
import DoughnutChart from '../../ChartComponents/DoughnutChart';
import BarChart from '../../ChartComponents/BarChart';

// AgreementFiltering 
import AgreementFiltering from './AgreementFiltering';

// Carousels' Import
import FavoriteCarousel from './FavoritedCarousel';
import RentedItemUserCarousel from './RentedItemUserCarousel';

//Insurnace Recommendations for User import
import InsuranceRecommendations from './InsuranceRecommendations';

//Rental Monitor
import RentalMonitor from './RentalMonitor';

//404 / Extra Page Import
import Page404 from '../../ExtraPageComponents/Page404';
import LoadingPage from '../../ExtraPageComponents/LoadingPage';

function OwnerDashboard({fromOwnerDash, setFromOwnerDash, searchTerm}) {
    // Honestly with currentUser, we can just make this for both users and owners

    const { currentUser, role, checkSession} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)

    const [isLoading, setIsLoading] = useState(false)
    const [currentView, setCurrentView] = useState('home')
    const [potentialRentalUsers, setPotentialRentalUsers] = useState([])
    const [potentialRentalOwners, setPotentialRentalOwners] = useState([])
    const [pageTitle, setPageTitle] = useState('Home')
    const [stripeAccount, setStripeAccount] = useState('')
    const [dashLoad, setDashLoad] = useState(true)
    

    // const [chartData, setChartData] = useState({
    //     labels: [],
    //     datasets: []
    //   })
    
    const navigate = useNavigate()
    // https://flask-jwt-extended.readthedocs.io/en/stable/token_locations.html#cookies
    // Can use include like in the session context or same-origin I believe
    useEffect(() => {
        const fetchStripeAccount = async () => {
          try {
            const response = await fetch(`${apiUrl}v1/accounts/${currentUser.stripe_id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            })

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            // console.log("THE DATA:", data)
            setStripeAccount(data)
            setDashLoad(false)
          } catch (error) {
            console.error('Error fetching Stripe account:', error)
            setDashLoad(false)
            // Not sure if I'd like to have an error state
            // setError('Failed to fetch Stripe account details.')
          }
        }
    
        if (role === 'owner' && currentUser.stripe_id) {
            fetchStripeAccount()
            // checkSession()
            // console.log("FUNCTION RAN")
            // console.log("THE CURRENT DATA IN STRIPE ACCOUNT:", stripeAccount)
          } else {
            setDashLoad(false)
          }

      }, [])

    // console.log("USER INFO",currentUser)
    

    // Wait for useEffect to load before displaying the page
    if (dashLoad) {
        return <><LoadingPage loadDetails={" your Dashboard"}/></>
    }

    // console.log("THE CURRENT USERS STRIPE ID:", currentUser?.stripe_id)
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

    // https://www.w3schools.com/js/js_cookies.asp
    // https://flask-jwt-extended.readthedocs.io/en/stable/api.html#flask_jwt_extended.get_csrf_token
    // https://flask-jwt-extended.readthedocs.io/en/stable/options.html#cross-site-request-forgery-options
    // SOLUTION? https://stackoverflow.com/questions/70071418/flask-jwt-extended-missing-csrf-access-token

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';')
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim()
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                    break
                }
            }
        }
        return cookieValue
    }

    // console.log("COOKIE NAME:", getCookie("csrf_access_token"))

    const handleStripeAccountCreation = () => {
        fetch(`${apiUrl}v1/accounts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": getCookie("csrf_access_token"),
            },
            credentials: 'include'
        }).then((resp) => {
            if (resp.ok) {
                // If the response is OK
                resp.json().then((data) => {
                    setStripeAccount(data)
                    // console.log(data)
                    checkSession()
                })
            } else {
                // If the response is not OK, handle errors
                resp.json().then((errorData) => {
                    console.error('Error Response:', errorData)
                })
            }
        }).catch((error) => {
            //  catch network errors and other issues with the fetch request
            console.error('Fetch Error:', error)
        })
    }

    // console.log(stripeAccount)
    // console.log("THE DETAILS SUBMITTED VALUE:", stripeAccount?.details_submitted)
    // console.log("THE CHARGES ENABLED VALUE:", stripeAccount?.charges_enabled)
    // console.log(typeof(stripeAccount.details_submitted))
    
    

    // https://stackoverflow.com/questions/71606230/usenavigate-navigate-to-external-link
    // https://stackoverflow.com/questions/42914666/react-router-external-link
    // https://www.w3schools.com/js/js_window_location.asp

    const handleStripeOnboarding = () => {
        // Needed to set onboard link to a variable to get this to work
        if (stripeAccount?.charges_enabled === false || stripeAccount?.details_submitted === false) {
            // Make a request to the backend to generate a new onboarding link
            fetch(`${apiUrl}v1/account_links`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRF-TOKEN": getCookie("csrf_access_token"),
                },
                credentials: 'include'
            }).then((resp) => {
            if (resp.ok) {
                // If the response is OK
                resp.json().then((data) => {
                    if (data) {
                    // console.log(data)
                    // console.log("THE URL:", data.url)
                        // Redirect the user to the new onboarding link
                      const onboardLink = data.url
                      window.open(onboardLink, '_blank')
                    }
                })
            } else {
                // If the response is not OK, handle errors
                resp.json().then((errorData) => {
                    console.error('Error Response:', errorData)
                })
            }
              }).catch(error => {
                console.error('Error generating Stripe onboarding link:', error)
              })
        }
    }




    // Handles creating a stripe login link for a user to get into their dashboard, that way they have a stripe dashboard also
    const handleStripeLoginLink = () => {
        // Needed to set onboard link to a variable to get this to work
            // Make a request to the backend to generate a new onboarding link
            fetch(`${apiUrl}v1/accounts/${currentUser.stripe_id}/login_links`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRF-TOKEN": getCookie("csrf_access_token"),
                },
                credentials: 'include'
            }).then((resp) => {
            if (resp.ok) {
                // If the response is OK
                resp.json().then((data) => {
                    if (data) {
                    // console.log(data)
                    // console.log("THE URL:", data.url)
                        // Redirect the user to the new onboarding link
                      const dashBoardLink = data.url
                      window.open(dashBoardLink, '_blank')
                    }
                })
            } else {
                // If the response is not OK, handle errors
                resp.json().then((errorData) => {
                    console.error('Error Response:', errorData)
                })
            }
              }).catch(error => {
                console.error('Error generating Stripe onboarding link:', error)
              })
        
    }

    // The rental agreements portion, allow for filtering etc,
    function RentalAgreements() {
        // setPageTitle('Rental Agreements')
        fromOwnerDash = true
        // console.log("RENTAL AGREEMENTS IN OWNER DASH FROM OWNER DASH:", fromOwnerDash)
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

    // Handles finding a users favorites, along with it there are radio buttons to filter through whether they're looking for equipment or owners that they have favorited
    function UserFavorites() {
        const [selectedFavorite, setSelectedFavorite] = useState('equipment')

        if(currentUser?.user_favorite.length === 0){
            return(
                <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPmr2qlzoYhc6OVoQZVRReION31sFib3oSBQ&usqp=CAU"
                    alt="More Heavy Equipment just Sitting Out"
                    className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                    You haven't favorited anyone yet, once you have you'll be able to see your favorites in this section!
                </p>
            </div>
            )
        }

        // setPageTitle('Your Favorites')
        const handleRadioChange = (event) => {
            setSelectedFavorite(event.target.value)
        }

        // console.log(selectedFavorite)

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
                                address_line_2={favorite.equipment.address_line_2} 
                                address={favorite.equipment.address} 
                                city={favorite.equipment.city} 
                                state={favorite.equipment.state} 
                                postal_code={favorite.equipment.postal_code}
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
                            address_line_2={favorite.owner.address_line_2} 
                            address={favorite.owner.address} 
                            city={favorite.owner.city} 
                            state={favorite.owner.state} 
                            postal_code={favorite.owner.postal_code}
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

    // Conditional to test if the owner_favorites array in the Owner data object.
    if (currentUser?.owner_favorite.length === 0){
        return(
        <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPmr2qlzoYhc6OVoQZVRReION31sFib3oSBQ&usqp=CAU"
                alt="More Heavy Equipment just Sitting Out"
                className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
            />
            <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                You haven't favorited anyone yet, once you have you'll be able to see your favorites in this section!
            </p>
        </div>
        )
    }
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
                    address_line_2={favorite.user.address_line_2} 
                    address={favorite.user.address} 
                    city={favorite.user.city} 
                    state={favorite.user.state} 
                    postal_code={favorite.user.postal_code}
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

    //Handles navigating one to their inbox
    const handleInboxNavigation = () => {
        setFromOwnerDash(true)
        // Use setTimeout to allow state update before navigation
        setTimeout(() => {
          navigate('/messaging')
        }, 0)
      }

    // Takes a user to their public facing profile
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
                        
                        <div className="h-24 col-span-3 bg-white border border-gray-300 text-center flex items-center justify-center"> 
                        <h1 className="text-2xl font-semibold text-black">Welcome, {currentUser.firstName}</h1>
                        </div>

                        <div className="h-96 py-2 col-span-1 bg-white border border-gray-300">
                        
                        {/* {role === 'owner' ? <Doughnut
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                            data={doughnutData}
                        /> : ""} */}
                        {role === 'owner' && <DoughnutChart currentUser={currentUser} role={role}/>}
                        
                        {role === 'user' && <InsuranceRecommendations currentUser={currentUser} role={role}/>}
                        </div>
                        
                        <div className="h-96 w-full col-span-2 bg-white border border-gray-200 shadow-md rounded-lg p-4">
                        {role === 'owner' &&
                        <BarChart currentUser={currentUser} setDashLoad={setDashLoad}/>}
                        
                        {role === 'user' && 
                        <RentedItemUserCarousel currentUser={currentUser} setFromOwnerDash={setFromOwnerDash} role={role}/>}
                        </div>

                        <div className="h-96 col-span-1 bg-white border border-gray-300 overflow-y-auto">
                        {/* // ----------------- agreement selection options ------------------- */}
                       {/* {selectionAgreementForm} */}

                        {/* {agreementFiltering === 'newest' ? sortedAscendingAgreements : sortedDescendingAgreements} */}

                        <AgreementFiltering currentUser={currentUser} role={role}/>

                        </div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300 p-4 overflow-hidden">

                        {/* {role === 'owner' && */}
                        <FavoriteCarousel currentUser={currentUser} setFromOwnerDash={setFromOwnerDash} role={role}/>
                        
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

    // Assists in rendering the current view with a switch statement, prior I was using state
    const renderCurrentView = () => {
        switch (currentView) {
            case 'Home':
                return <DashHome />
            case 'Active Listings':
                return <ActiveListings />
            case 'Rental Agreements':
                // setFromOwnerDash(prevState => !prevState)
                return <RentalAgreements/>
            case 'Potential Renters':
                if (isLoading) {
                    return <div>Loading...</div> // Loading indicator
                } 
                // console.log("THE POTENTIAL RENTAL USERS:", potentialRentalUsers)
                if (potentialRentalUsers.error === 'Users not found'){
                    return(
                    <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
                        <img
                            src="https://assets-global.website-files.com/5f98b7826beb070752d84b32/6077fad14e8d6b4623eb8d48_3%20Reasons%20Why%20Talking%20to%20Real%20Users%20is%20Important%20for%20UX%20Design%20-%20Egnyte%20Blog.png"
                            alt="More Heavy Equipment just Sitting Out"
                            className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
                        />
                        <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                            No users have signed up with your profession yet, try encouraging some friends to sign up!
                        </p>
                    </div>
                    )
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
                ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
                <img
                    src="https://assets-global.website-files.com/5f98b7826beb070752d84b32/6077fad14e8d6b4623eb8d48_3%20Reasons%20Why%20Talking%20to%20Real%20Users%20is%20Important%20for%20UX%20Design%20-%20Egnyte%20Blog.png"
                    alt="More Heavy Equipment just Sitting Out"
                    className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                    No owners have signed up with your profession yet, try encouraging some friends to sign up!
                </p>
                </div>
                )
                return ownerCollection
            case 'Owner Favorites':
                return <OwnerFavorites/>
            case 'User Favorites':
                return <UserFavorites/>
            case 'Account Settings':
                return <AccountSettings/>
            case 'Order History':
                setFromOwnerDash(true)
                return <OrderHistory fromOwnerDash={fromOwnerDash}/>
            default:
                return <DashHome />
        }
    }
    // {renderCurrentView()}

    const handleViewClick = (viewName) => {
    // console.log("THE VIEW NAME:", viewName)

    // console.log("THE PAGE TITLE ", pageTitle)

    if (viewName === 'Owner Favorites' || viewName === 'User Favorites') {
        setPageTitle('Favorites')
    } else {
        setPageTitle(viewName)
    }
        setCurrentView(viewName)  
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
                             onClick={() => handleViewClick('Order History')}
                            > Order History </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" 
                             onClick={() => handleViewClick('Account Settings')}
                            > Account Settings </span>

                            <span className="flex items-center flex-shrink-0 cursor-pointer h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={handleInboxNavigation}
                            > Inbox </span>

                        </div>

                    </div>
                    <div className="flex flex-col overflow-auto flex-grow">
                    <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-300">

                            <h1 className="text-lg font-medium">{pageTitle}</h1>
                            {role === 'owner' && 
                            <div className="flex justify-end items-center space-x-2">
                            <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-300" onClick={handleCsvClick}>
                                Upload Equipment File

                            </button>
                            
                            <Link to='/list_equipment'>
                                <button 
                                className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" 
                                onClick={() => setFromOwnerDash(true)}> List an Item</button>
                            </Link>

                            {!currentUser.stripe_id && !stripeAccount && ( 
                                 <button 
                                 className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" 
                                 onClick={handleStripeAccountCreation}> Create my Stripe Account
                                 </button>
                            )}

                            {/* {currentUser.stripe_id && stripeAccount && !currentUser.stripe_onboard_link &&(
                            <button 
                            className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" 
                            onClick={handleStripeAccountCreation}> Complete Stripe Onboarding
                            </button>
                            )} */}

                           {/* currentUser.stripe_id && stripeAccount &&  */}
  
                            {((stripeAccount && stripeAccount?.details_submitted === false) || stripeAccount?.charges_enabled === false) && ( 
                                 <button 
                                 className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" 
                                 onClick={handleStripeOnboarding}> Complete Stripe Onboarding
                                 </button>
                            )}

                                {((stripeAccount && stripeAccount?.details_submitted === true) || stripeAccount?.charges_enabled === true) && ( 
                                 <button 
                                 className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" 
                                 onClick={handleStripeLoginLink}> Stripe Dashboard
                                 </button>
                            )}
                            </div>
                            }


                            {/* DROP DOWN THINGY */}
                            {/* <button className="relative ml-2 text-sm focus:outline-none group">
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
                            </button> */}



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
            {isLoading 
            ? <LoadingPage />
            : currentUser 
                ? <LoggedInDisplay/>
                : <Page404 errorString={userLoggedOut}/>
        }
        </>
    )
}

export default OwnerDashboard