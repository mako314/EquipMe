import React from 'react'
import { useContext, useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EquipmentMap from '../MapComponents/EquipmentMap'
import AddToCartModal from '../CheckoutComponents/AddToCartModal'
// import UserContext from '../UserComponents/UserContext'
// import OwnerContext from '../OwnerComponents/OwnerContext'
import ApiUrlContext from '../Api'
import { UserSessionContext } from '../UserComponents/SessionContext'


function EquipmentDisplay({}) {
  // THE ID HERE IS THE EQUIPMENT ID.
  const { id } = useParams()

  // Likely need the owner context also + its check session
  // const [user, setUser] = useContext(UserContext)
  // const [owner, setOwner] = useContext(OwnerContext)

  const apiUrl = useContext(ApiUrlContext)
  const { currentUser, role, checkSession} = UserSessionContext()
  const [addToCartButton, setAddToCartButton] = useState(<span>Placeholder</span>)
  const [oneEquipment, setOneEquipment] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [heartColor, setHeartColor] = useState('white')
  const [isFavorited, setIsFavorited] = useState(null)


  const { model, name, make, location, email, phone, quantity, equipment_image, equipment_price, owner } = oneEquipment
  
  let firstName, lastName
  if (oneEquipment && oneEquipment.owner) {
    ({ firstName, lastName } = oneEquipment.owner)
  }



  // console.log("THE currentUser IS:", currentUser)
  // console.log("Current favorited:", currentUser.user_favorite)
  // console.log("THE ROLE IS:", role)
  const navigate = useNavigate()

  console.log("Is favorited Status:", isFavorited)

  useEffect(() => {
    fetch(`${apiUrl}equipment/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setOneEquipment(data)
      })
  }, [])

  // console.log("Display Page one equipment:", equipment_image)

  const equip_prices = equipment_price?.map((price) => {
    return <Fragment key={oneEquipment.id}>
    <span className="title-font font-medium text-2xl text-white">Hourly Rate: ${price.hourly_rate/100}</span>
    <span className="title-font font-medium text-2xl text-white">Daily Rate: ${price.daily_rate/100}</span>
    <span className="title-font font-medium text-2xl text-white">Weekly Rate: ${price.weekly_rate/100}</span>
    </Fragment>
  })

    //Toggles modal to ADD to cart
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen)
  }
  // console.log(typeof(id))
  //https://www.w3schools.com/jsref/jsref_some.asp
  // Parse inst because the ues params makes it into a string
  useEffect( () => {
    if (role === 'user') {
      setAddToCartButton(
        <AddToCartModal equip_id={id} oneEquipment={oneEquipment} toggleModal={toggleModal} isModalOpen={isModalOpen}/>
      )
      const favoriteStatus = currentUser?.user_favorite?.some(favorite => favorite.equipment_id === parseInt(id, 10))
      console.log("FAVORITE STATUS:", favoriteStatus)
      setHeartColor(favoriteStatus ? "red" : "white")
      // I can't just set is favorited and try it with heart color, it's just too quick and defaults, so I make a variable that contains data and set it to that.
      setIsFavorited(favoriteStatus)

    } else {
      setAddToCartButton(<span>Placeholder</span>)
    }
  }, [role, currentUser])

  //may need to include owner here (in models)
  // console.log(oneEquipment)

  // https://react.dev/learn/preserving-and-resetting-state
  // https://react.dev/reference/react/useRef
  const handleFavoriteSelection = () => {
    console.log(isFavorited)
    // Conditional method and URL based on whether is favorited doesn't exist off the useEffect
    const method = !isFavorited ? "POST" : "DELETE"
    const url = !isFavorited ? `${apiUrl}user/${currentUser.id}/favorite/equipment/${id}` : `${apiUrl}remove/user/${currentUser.id}/favorite/equipment/${id}`
  
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "user_id": currentUser.id, "equipment_id": id })
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error("Favorite failed")
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

  // Need to make some onclicks for when a user clicks description, reviews, details etc. 

  //What can I include in details? Possibly whether or not the vehicle is available for delivery? Deposit ? ETC?

  let loggedOutDisplay
  loggedOutDisplay = (
    <section className="text-gray-400 bg-gray-900 body-font overflow-hidden" >
      <div className="container px-5 py-24 mx-auto">
      {/* Could afford some padding here below */}
        <div className="lg:w-4/5 flex flex-wrap mb-5 "> 
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{name}</h2>
            <h1 className="text-white text-3xl title-font font-medium mb-4">{make} {model}</h1>
            <div className="flex mb-4">
              <a className="flex-grow text-indigo-400 border-b-2 border-indigo-500 py-1 text-lg px-1 mr-2">Description</a>
              <a className="flex-grow border-b-2 border-gray-800 py-1 text-lg px-1 mr-2">Reviews</a>
              <a className="flex-grow border-b-2 border-gray-800 py-1 text-lg px-1">Details</a>
            </div>
            <p className="leading-relaxed mb-4">{oneEquipment.description}</p>
            <div className="flex border-t border-gray-800 py-2">
              <span className="text-gray-500">Location</span>
              <span className="ml-auto text-white">{location}</span>
            </div>
            <div className="flex border-t border-gray-800 py-2">
              <span className="text-gray-500">Owner</span>
              <span className="ml-auto text-white">{firstName} {lastName}</span>
            </div>
            <div className="flex border-t border-b mb-6 border-gray-800 py-2">
              <span className="text-gray-500">Quantity</span>
              <span className="ml-auto text-white">{quantity}</span>
            </div>
            <div className="flex">
              {/* <span className="title-font font-medium text-2xl text-white">$58.00</span> */}
              {equip_prices}
              {/* <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" >Rent Now</button> */}
              {role === 'user' ? <AddToCartModal equip_id={id} oneEquipment={oneEquipment} toggleModal={toggleModal} isModalOpen={isModalOpen}/> : <span>Placeholder</span> }
              <button className="rounded-full w-10 h-10 bg-gray-800 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4" onClick={handleFavoriteSelection}>
                <svg fill={heartColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>

            </div>

          </div>

          <img alt={`${make + model}`} className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 ml-auto object-cover object-center rounded" src={equipment_image} />
        </div>

        {/* The Google Map for the equipment is included below the information and leaves room for 
        product images to be included to the right of the equipment information */}
        <EquipmentMap location={location} />
      </div>

    </section>
  )

  return (
    <>
      {loggedOutDisplay}
    </>
  )
}


export default EquipmentDisplay;