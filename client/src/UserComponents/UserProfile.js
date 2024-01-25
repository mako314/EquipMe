import React, { useContext, useState, useEffect } from 'react';
import ApiUrlContext from '../Api';
import RentalAgreementsCollection from '../RentalComponents/RentalAgreementsCollection';
import Reviews from '../ReviewComponents/Reviews';
import EquipmentMap from '../MapComponents/EquipmentMap';
import { UserSessionContext } from './SessionContext';
import { useParams, useNavigate, useInRouterContext } from 'react-router-dom';
import LoadingPage from '../ExtraPageComponents/LoadingPage';


function UserProfile({fromOwnerDash, setFromOwnerDash}) {
  // User context, meaning if user is signed in, they get their data,
  const { currentUser, role, checkSession } = UserSessionContext() 
  const apiUrl = useContext(ApiUrlContext)

  //This will be used to set the userProfile after it's been clicked from the owner, unsure if I want users to be able to view other users
  const [userProfile, setUserProfile] = useState({})
  const [heartColor, setHeartColor] = useState('white')
  const [isFavorited, setIsFavorited] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ownerReviews, setOwnerReviews] = useState([])
  const navigate = useNavigate();
  const { id } = useParams()

  // console.log("THE CURRENT USER:",currentUser)

  // function handleCsvClick(e) {
  //   console.log("Button working")
  //   navigate('/temp/bulk_equipment_upload')
  // }

  // User base is solely for renting I think at the moment, would be too much to allow random users to upload equipment
  useEffect(() => {
    fetch(`${apiUrl}user/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setUserProfile(data)
        const favoriteStatus = currentUser?.owner_favorite?.some(favorite => favorite.user_id === parseInt(id, 10))
        // console.log("Favorite Status:", favoriteStatus)
        setHeartColor(favoriteStatus ? "red" : "white")
        // I can't just set is favorited and try it with heart color, it's just too quick and defaults, so I make a variable that contains data and set it to that.
        setIsFavorited(favoriteStatus)
        setLoading(false)
      })
  }, [])

  //Destructure for props
  const source = role === 'user' ? currentUser  : userProfile

  const {
    email = '',
    firstName = '',
    lastName = '',
    state = '',
    city = '',
    address = '',
    address_line_2 = '',
    postal_code = '',
    phone = '',
    profession = '',
    profileImage = ''
  } = source || {}

  // console.log("The user Profile:", userProfile)
  let reviewCounter = 0
  let agreementCounter = 0

  const userLocation = `${address_line_2 === '' ?  address : address + ',' + address_line_2}, ${city}, ${state} ${postal_code} `


  if (Array.isArray(source.review)) {
    source.review.forEach((element) => {
      if (element.reviewer_type === 'user'){
        reviewCounter +=1
      }
      // console.log("THE REVIEW COUNTER INSIDE THE IF:", reviewCounter)
    })
  } else {
    console.log('source is not an array:', source)
  }

  
  //Was having issues with the source array not being able to identify my agreements array because of how deeply nested it is. A user can also have multiple carts. So it's important to consider this while I try to get deeper into the forEach

  if (Array.isArray(source.cart)) {
    source.cart.forEach(cart => {
      if (Array.isArray(cart.cart_item)) {
        cart.cart_item.forEach(cartItem => {
          if (Array.isArray(cartItem.agreements)) {
            cartItem.agreements.forEach(agreement => {
              if(agreement.agreement_status === 'both-accepted'){
                agreementCounter +=1
              }
              // console.log(agreement)
            })
          } else {console.log("Agreements not an array")}
        })
      } else {console.log("Cart Items not an array")}
    })
  } else {console.log("Source cart not an array")}

  // console.log(source?.user_inboxes?.length)
  
  // console.log("THE REVIEWS:",source.review)
  // Owner is the one leaving reviews
  // let ownerReviews = source.review?.filter(reviewSubmission => reviewSubmission.reviewer_type === 'owner')

//-----------------------------------------------------------------
    // The portion below handled setting the owners reviews, did this because it makes the delete easier.
    useEffect(() => {
      // When component mounts, initialize userReviews
      setOwnerReviews(source.review?.filter(reviewSubmission => reviewSubmission.reviewer_type === 'owner'))
      }, [source.review]) // Depend on owner.review
  
      // Handles immediately removing the the review a user removes.
      const handleReviewDelete = (deletedReviewId) => {
      // Update userReviews state
      setOwnerReviews(currentReviews => currentReviews.filter(review => review.id !== deletedReviewId));
      }
//-----------------------------------------------------------------


  // console.log("Owner Reviews:", ownerReviews)
  
  //May actually want to include a banner image so it looks nicer


  const handleFavoriteSelection = () => {
    // console.log(isFavorited)
    // Conditional method and URL based on whether is favorited doesn't exist off the useEffect
    const method = !isFavorited ? "POST" : "DELETE"
    const url = !isFavorited ? `${apiUrl}owner/${currentUser.id}/favorite/user/${id}` : `${apiUrl}remove/owner/${currentUser.id}/favorite/user/${id}`
  
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "owner_id": currentUser.id, "user_id": id})
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

  // Navigate back to dashboard
  const navigateBackToDash = () => {
    setFromOwnerDash(!fromOwnerDash)
    navigate(`/dashboard`)
  }


  let allOwnerReviewsVar = ownerReviews?.map((item) => (
    <Reviews key={item.id} stars={item.review_stars} comment={item.review_comment} image={item.owner.profileImage} firstName={item.owner.firstName} lastName={item.owner.lastName} profession={item.owner.profession} onDelete={handleReviewDelete} reviewId={item.id} itemUserId={item.user_id} itemOwnerId={item.owner_id}/>
  ))

  const allOwnerReviews = allOwnerReviewsVar?.length > 0 ? allOwnerReviewsVar : <div>No reviews currently available.</div>

  // Render loading page if display is still loading
  if (loading) {
    return <><LoadingPage loadDetails={"User Profile Page"}/></>
  }

  return (
    <>
      <div className="relative block" style={{ height: "500px" }}>

        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
          style={{ height: "70px" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-gray-300 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </div>
      <div className="relative py-16 bg-gray-300">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img
                      alt={`${firstName} ${lastName}`}
                      src={profileImage}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                </div>
                
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                  {currentUser && !(role === 'user' && userProfile.id === currentUser.id) ?
                        <button 
                            className="rounded-full w-10 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4" 
                            onClick={handleFavoriteSelection}
                        >
                            <svg fill={heartColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24" >
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                            </svg>
                        </button>
                    : null}

                    {/* New Material that SK has added for sheet functionality */}
                    {/* <button
                      className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={handleCsvClick}
                    >
                      Add Equipment via CSV
                    </button> */}
                    
                  </div>

                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      {agreementCounter}
                      </span>
                      <span className="text-sm text-gray-500">Rental</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        {source?.user_inboxes?.length}
                      </span>
                      <span className="text-sm text-gray-500">Connections</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      {reviewCounter}
                      </span>
                      <span className="text-sm text-gray-500">Review</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 ">
                  {firstName} {lastName}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                  {userLocation}
                </div>
                <div className="mb-2 text-gray-700 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
                  {email}
                </div>
                <div className="mb-2 text-gray-700">
                  <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                  Work Phone: {phone}
                </div>
              </div>

              <div className="mx-auto w-full max-w-7xl py-16">
                        <div className="flex justify-between">
                                <span className="text-gray-600 font-bold mb-4">Reviews</span>
                        </div>
                        <ul className="mb-6 grid gap-5 sm:grid-cols-2 md:grid-cols-2 md:mb-16"> 
                        {allOwnerReviews}
                        </ul>

                        <div className="flex mb-8">
                          <EquipmentMap location={userLocation} userDisplayHeight={300} userDisplayWidth={1500} userDisplayZoom={8}/>
                        </div>
                        {fromOwnerDash === true && 
                        <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
                            <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateBackToDash}>
                              Return to Dashboard
                          </button>
                        </div>}

                </div>
            </div>
            
          </div>
        
        </div>

      </div>
    </>
  )


}

export default UserProfile;