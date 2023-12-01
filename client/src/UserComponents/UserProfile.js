import React, { useContext, useState, useEffect } from 'react';
import ApiUrlContext from '../Api';
import RentalAgreementsCollection from '../RentalComponents/RentalAgreementsCollection';
import { UserSessionContext } from './SessionContext';
import { useParams, useNavigate, useInRouterContext } from 'react-router-dom';


function UserProfile() {
  // User context, meaning if user is signed in, they get their data,
  const { currentUser, role, checkSession } = UserSessionContext() 
  const apiUrl = useContext(ApiUrlContext)

  //This will be used to set the userProfile after it's been clicked from the owner, unsure if I want users to be able to view other users
  const [userProfile, setUserProfile] = useState([])
  const [heartColor, setHeartColor] = useState('white')
  const [isFavorited, setIsFavorited] = useState(null)
  const navigate = useNavigate();
  const { id } = useParams()

  console.log("THE CURRENT USER:",currentUser)

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
        console.log("Favorite Status:", favoriteStatus)
        setHeartColor(favoriteStatus ? "red" : "white")
        // I can't just set is favorited and try it with heart color, it's just too quick and defaults, so I make a variable that contains data and set it to that.
        setIsFavorited(favoriteStatus)
      })
  }, [])

  //Destructure for props
  const source = role === 'user' ? currentUser  : userProfile

  const {
    email = '',
    firstName = '',
    lastName = '',
    location = '',
    phone = '',
    profession = '',
    profileImage = ''
  } = source || {}

  
  //May actually want to include a banner image so it looks nicer


  const handleFavoriteSelection = () => {
    console.log(isFavorited)
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

  return (
    <>
      <section className="relative block" style={{ height: "500px" }}>

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
      </section>
      <section className="relative py-16 bg-gray-300">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img
                      alt={`${firstName} ${lastName} Image`}
                      src={profileImage}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                  <button className="rounded-full w-10 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4" onClick={handleFavoriteSelection}>
                    <svg fill={heartColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24" >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>

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
                        22
                      </span>
                      <span className="text-sm text-gray-500">Rentals</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        10
                      </span>
                      <span className="text-sm text-gray-500">Connections</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        89
                      </span>
                      <span className="text-sm text-gray-500">Reviews</span>
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
                  {location}
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
              <div className="mt-10 py-10 border-t border-gray-300 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-gray-800">
                      Possible interests relating to renting
                    </p>
                    <a
                      href="#pablo"
                      className="font-normal text-pink-500"
                      onClick={e => e.preventDefault()}
                    >
                      Show more
                    </a>
                  </div>

                </div>
                {/* <RentalAgreementsCollection key={user?.id}/> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )


}

export default UserProfile;