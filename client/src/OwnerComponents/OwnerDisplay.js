import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EquipmentMap from '../MapComponents/EquipmentMap'
import ContactModal from '../MessagingComponents/ContactModal'
import ProductCard from '../EquipmentComponents/ProductCard'
import Reviews from '../ReviewComponents/Reviews'
import { UserSessionContext } from '../UserComponents/SessionContext'
import ApiUrlContext from '../Api'
import LoadingPage from '../ExtraPageComponents/LoadingPage'

function OwnerDisplay({fromOwnerDash, setFromOwnerDash}) {
    
  
  const [owner, setOwner] = useState([])
  const { currentUser, role, checkSession } = UserSessionContext()
  const [currentIndex, setCurrentIndex] = useState(0) // Tempted to make a scroller
  const { firstName, lastName, state, city, address, address_line_2, postal_code, bio, email, phone, equipment, profession, profileImage, website } = owner
  const [heartColor, setHeartColor] = useState('white')
  const [isFavorited, setIsFavorited] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userReviews, setUserReviews] = useState([])

  const ownerLocation = `${address_line_2 === '' ?  address : address + ',' + address_line_2}, ${city}, ${state} ${postal_code} `

//   console.log("THE OWNER:", owner)
  const { id } = useParams()
  // const navigate = useNavigate()
  const apiUrl = useContext(ApiUrlContext)
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}equipment_owner/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setOwner(data)
        const favoriteStatus = currentUser?.user_favorite?.some(favorite => favorite.owner_id === parseInt(id, 10))
        setHeartColor(favoriteStatus ? "red" : "white")
        // I can't just set is favorited and try it with heart color, it's just too quick and defaults, so I make a variable that contains data and set it to that.
        setIsFavorited(favoriteStatus)
        setLoading(false)
      })
  }, [])

  const handleFavoriteSelection = () => {
    // console.log(isFavorited)
    // Conditional method and URL based on whether is favorited doesn't exist off the useEffect
    const method = !isFavorited ? "POST" : "DELETE"
    const url = !isFavorited ? `${apiUrl}user/${currentUser.id}/favorite/owner/${id}` : `${apiUrl}remove/user/${currentUser.id}/favorite/owner/${id}`
  
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "user_id": currentUser.id, "owner_id": id })
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error("Favorite failed -- unable to favorite")
      }
      //Toggle the isFavorite (t or f if it exists), then set heartcolor based on that
      setIsFavorited(!isFavorited)
      setHeartColor(!isFavorited ? "red" : "white")
      checkSession() // Update user data
    })
    .catch(error => {
      console.error('Error:', error)
      // Revert UI on error
      setHeartColor(isFavorited ? "red" : "white")
    })
  }

  const equipmentNames = equipment?.map((equipment) => {
    return equipment.name + " " + equipment.make + " " + equipment.model
  })

  // console.log(equipmentNames)
  const equipmentCards = owner.equipment?.map((item) => {
    return(  <div key={item.id} className="flex-none flex-grow flex-shrink-0 basis-1/3 space-x-4"> 
    <ProductCard key={item.id} id={item.id} name={item.name} model={item.model} make={item.make} state ={item.state } city={item.city} address={item.address} address_line_2={item.address_line_2} postal_code={item.postal_code}  item={item} equipment_image={item.equipment_image}/>
    </div>)
  
    
})

const [visibleCards, setVisibleCards] = useState(equipmentCards?.slice(0, 2)) // Tempted to make a scroller

const featuredEquipment = owner.equipment?.filter(item => item.featured_equipment?.length > 0)
.map((item) => (
    <div key={item.id} className="flex-none flex-grow flex-shrink-0 basis-1/3 space-x-4">
        <ProductCard 
            key={item.id}
            id={item.id}
            name={item.name}
            model={item.model}
            make={item.make}
            state ={item.state } 
            city={item.city} 
            address={item.address} 
            address_line_2={item.address_line_2} 
            postal_code={item.postal_code}
            item={item}
            equipment_image={item.equipment_image}
        />
    </div>
)) || []

// Check if there are any featured equipment items, if not show a message
const displayFeaturedEquipment = featuredEquipment?.length > 0 ? featuredEquipment : <div>No items currently featured.</div>

const displayAllEquipment = equipmentCards?.length > 0 ? equipmentCards : <div>No items currently listed.</div>


// handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment}

    // let userReviews = owner.review?.filter(reviewSubmission =>  reviewSubmission.reviewer_type === 'user')
    // console.log("userReviews:", userReviews )
    // console.log("reviews:", owner.review)

    const navigateBackToDash = () => {
        setFromOwnerDash(!fromOwnerDash)
        navigate(`/dashboard`)
    }

    const navigateToLogin = () => {
        navigate(`/login`)
    }

    // console.log("CURRENT USER TEST:", currentUser)

    //-----------------------------------------------------------------
    // The portion below handled setting the owners reviews, did this because it makes the delete easier.
    useEffect(() => {
    // When component mounts, initialize userReviews
    setUserReviews(owner.review?.filter(review => review.reviewer_type === 'user'))
    }, [owner.review]) // Depend on owner.review

    // Handles immediately removing the the review a user removes.
    const handleReviewDelete = (deletedReviewId) => {
    // Update userReviews state
    setUserReviews(currentReviews => currentReviews.filter(review => review.id !== deletedReviewId));
    }
    //-----------------------------------------------------------------

    let userReviewsVar = userReviews?.map((item) => (
        <Reviews key={item.id} stars={item.review_stars} comment={item.review_comment} image={item.user.profileImage} firstName={item.user.firstName} lastName={item.user.lastName} profession={item.user.profession} onDelete={handleReviewDelete} reviewId={item.id} itemOwnerId={item.owner_id} itemUserId={item.user_id}/>
    ))
    
    const allUserReviews = userReviewsVar?.length > 0 ? userReviewsVar : <div>No reviews currently available.</div>

// Render loading page if display is still loading
  if (loading) {
    return <LoadingPage loadDetails={"Owner Profile Page"}/>
  }


  return (

        <div className="bg-gray-100">
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div className="col-span-4 sm:col-span-3">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col items-center">
                            <img src={profileImage} className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover">

                            </img>
                            <h1 className="text-xl font-bold"> {firstName} {lastName}</h1>
                            <p className="text-gray-600">{profession}</p>
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                {(role === 'user' || (role === 'owner' && owner.id !== currentUser.id)) ? 
                                <ContactModal recipientID={id} firstName={firstName} lastName={lastName}/> 
                                :
                                (role === 'owner' && owner.id === currentUser.id) ? null : 
                                <span 
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded cursor-pointer	"
                                onClick={navigateToLogin}> 
                                Sign in to Contact
                                </span>
                                }
                                
                                {/* <ContactModal recipientID={id}/> */}
                                {/* <span className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"> {website} </span> */}
                                {currentUser && owner.id !== currentUser.id && 
                                <button className="rounded-full w-10 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4" onClick={handleFavoriteSelection}>
                                    <svg fill={heartColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                    </svg>
                                </button>
                                }
                            </div>
                        </div>
                        <hr className="my-6 border-t border-gray-300"/>
                        <div className="flex flex-col">
                            <span className="text-gray-600 text-center uppercase font-bold tracking-wider mb-2"> You can find me at</span>
                            {/* <ul>
                                <li className="mb-2">JavaScript</li>
                                <li className="mb-2">React</li>
                                <li className="mb-2">Node.js</li>
                                <li className="mb-2">HTML/CSS</li>
                                <li className="mb-2">Tailwind Css</li>
                            </ul> */}
                            {/* although it says equipmentMap, this map is really universal, so name may be prone to CHANGE */}
                            <div className="flex">
                            <EquipmentMap location={ownerLocation} userDisplayHeight={200} userDisplayWidth={325} userDisplayZoom={8}/>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- Right hand side content --- */}
                <div className="col-span-4 sm:col-span-9">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">About Me</h2>
                        <p className="text-gray-700"> {bio}
                        </p>

                        {/* <h3 className="font-semibold text-center mt-3 -mb-2">
                            Find me on
                        </h3> */}

                        {/* social media links  */}

                        {/* <div className="flex justify-center items-center gap-6 my-6">
                            <span className="text-gray-700 hover:text-orange-600" aria-label="Visit LinkedIn" href=""
                                target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6">
                                    <path fill="currentColor"
                                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                                    </path>
                                </svg>
                            </span>
                            <span className="text-gray-700 hover:text-orange-600" aria-label="Visit YouTube" href=""
                                target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-6">
                                    <path fill="currentColor"
                                        d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z">
                                    </path>
                                </svg>
                            </span>
                            <span className="text-gray-700 hover:text-orange-600" aria-label="Visit Facebook" href=""
                                target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-6">
                                    <path fill="currentColor"
                                        d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
                                    </path>
                                </svg>
                            </span>
                            <span className="text-gray-700 hover:text-orange-600" aria-label="Visit Instagram" href=""
                                target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6">
                                    <path fill="currentColor"
                                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                                    </path>
                                </svg>
                            </span>
                            <span className="text-gray-700 hover:text-orange-600" aria-label="Visit Twitter" href=""
                                target="_blank"><svg className="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                                    </path>
                                </svg>
                            </span>

                        </div> */}

                        {/* can possibly include the individuals featured equipment here, replacing the resume styled format */}
                        <h2 className="text-xl font-bold mt-6 mb-4"> More </h2>
                        <div className="mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold"> All Equipment </span>
                            </div>
                            <div className="flex overflow-x-auto space-x-4 py-4"> 
                            {displayAllEquipment}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-bold"> Featured Equipment </span>
                            </div>
                            <div className="flex overflow-x-auto space-x-4 py-4"> 
                            {displayFeaturedEquipment}
                            </div>
                        </div>

                        <div className="mb-6">
                            
                          
                            
                        </div>
                        {/* px-5 md:px-10  */}
                        <div className="mx-auto w-full max-w-7xl py-16 md:py-24 lg:py-32">
                        <div className="flex justify-between">
                                <span className="text-gray-600 font-bold mb-4">Reviews</span>
                        </div>
                            <ul className="mb-6 grid gap-5 sm:grid-cols-2 md:grid-cols-2 md:mb-16"> 

                        {allUserReviews}
                            
                            </ul>
                        </div>
                        {fromOwnerDash === true && 
                        <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
                            <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateBackToDash}>
                            Return to Dashboard
                            </button>
                        </div>}
                        
                    </div>
                    
                </div>

                {/* --- right hand side content --- */}


            </div>
        </div>

    </div>

  )
}


export default OwnerDisplay

{/* <div>
<div classNameName="card__title">Owner: {name}</div>
<p classNameName="card__text">Available Locations: {location}</p>
<p classNameName="card__text">Email: {email}</p>
<p classNameName="card__text">Phone: {phone}</p>
<p classNameName="card__text">Owned Equipment: {equipmentNames}</p>

</div> */}