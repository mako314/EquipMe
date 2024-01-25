import React from 'react'
import { useContext, useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EquipmentMap from '../MapComponents/EquipmentMap'
import AddToCartModal from '../CheckoutComponents/AddToCartModal'
// import UserContext from '../UserComponents/UserContext'
// import OwnerContext from '../OwnerComponents/OwnerContext'

import ApiUrlContext from '../Api'
import { UserSessionContext } from '../UserComponents/SessionContext'
import ProductEditForm from './ProductEditForm'

import LoadingPage from '../ExtraPageComponents/LoadingPage'

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
  const [loading, setLoading] = useState(true)

  const { model, name, make, state, city, address, address_line_2, postal_code, email, phone, equipment_image, equipment_price, owner } = oneEquipment
  
  // const equipmentLocation = `${address_line_2 === '' ?  address : address + ',' + address_line_2}, ${city}, ${state} ${postal_code} `
  const equipmentLocation = `${address}${address_line_2 ? ', ' + address_line_2 : ''}, ${city}, ${state} ${postal_code}`;


  let firstName, lastName
  if (oneEquipment && oneEquipment.owner) {
    ({ firstName, lastName } = oneEquipment.owner)
  }

 


  // console.log("THE currentUser IS:", currentUser)
  // console.log("Current favorited:", currentUser.user_favorite)
  // console.log("THE ROLE IS:", role)
  const navigate = useNavigate()

  // console.log("Is favorited Status:", isFavorited)

  useEffect(() => {
    fetch(`${apiUrl}equipment/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setOneEquipment(data)
        // console.log(data)
        setLoading(false)
      })
  }, [])

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing

  // const quantity = oneEquipment?.status?.[0]?.available_quantity ?? 0

  const quantity = (oneEquipment?.status?.[0]?.available_quantity > 0) ? oneEquipment.status[0].available_quantity : 0
  
  // const quantity = oneEquipment ? oneEquipment?.status[0]?.current_quantity : 0
  // console.log("Display Page one equipment:", oneEquipment)

  // console.log("EQUIPMENT STATUS:", quantity)

  const equip_prices = equipment_price?.map((price) => {
    return <Fragment key={oneEquipment.id}>
    <span className="title-font font-medium text-2xl text-white">Hourly Rate: <br/>${(price.hourly_rate/100).toFixed(2)}</span>
    <span className="title-font font-medium text-2xl text-white">Daily Rate: <br/>${(price.daily_rate/100).toFixed(2)}</span>
    <span className="title-font font-medium text-2xl text-white">Weekly Rate: <br/>${(price.weekly_rate/100).toFixed(2)}</span>
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
      // console.log("FAVORITE STATUS:", favoriteStatus)
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
    // console.log(isFavorited)
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

  // https://www.educative.io/answers/how-to-use-the-uselocation-hook-in-react
  // https://stackoverflow.com/questions/72079923/how-to-use-uselocation-hook-of-react-router-dom-v6
  const handleEditNavigation = (e) => {
    navigate(`/equipment/${oneEquipment.id}/edit`, { state: { oneEquipment } })
  }

  // Need to make some onclicks for when a user clicks description, reviews, details etc. 

  //What can I include in details? Possibly whether or not the vehicle is available for delivery? Deposit ? ETC?

  // Render loading page if dash is still loading
  if (loading) {
    return <><LoadingPage/></>
  }

  return (
    <>
    <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap mb-5">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{name}</h2>
            <h1 className="text-white text-3xl title-font font-medium mb-4">{make} {model}</h1>
            <div className="flex mb-4">
              <span className="flex-grow text-indigo-400 border-b-2 border-indigo-500 py-1 text-lg px-1 mr-2">Description</span>
              {/* <span className="flex-grow border-b-2 border-gray-800 py-1 text-lg px-1 mr-2">Reviews</span>
              <span className="flex-grow border-b-2 border-gray-800 py-1 text-lg px-1">Details</span> */}
            </div>
            <p className="leading-relaxed mb-4">{oneEquipment.description}</p>

            <div className="flex border-t border-gray-800 py-2">
            <span className="text-gray-500">Location</span>
            <span className="ml-auto text-white">{equipmentLocation}</span>
          </div>
          <div className="flex border-t border-gray-800 py-2">
            <span className="text-gray-500">Owner</span>
            <span className="ml-auto text-white">{firstName} {lastName}</span>
          </div>
          <div className="flex border-t border-b mb-6 border-gray-800 py-2">
            <span className="text-gray-500">Quantity</span>
            <span className="ml-auto text-white">{quantity}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex justify-start space-x-2 md:space-x-4 mb-4">
              {equip_prices}
            </div>
            <div className="flex flex-row justify-start space-x-4">
              {role === 'user' && 
                <AddToCartModal equip_id={id} oneEquipment={oneEquipment} toggleModal={toggleModal} isModalOpen={isModalOpen}/>
              }
              {role === 'owner' && currentUser.id === oneEquipment.owner_id && 
                <button className="inline-block rounded-lg bg-orange-500 px-8 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base" onClick={handleEditNavigation}>Edit Equipment</button>
              }
            </div>
            {role === 'user' && 
              <div className="flex flex-row justify-start mt-4 md:mt-0">
                <button className="rounded-full w-10 h-10 bg-gray-800 p-0 border-0 inline-flex items-center justify-center text-gray-500" onClick={handleFavoriteSelection}>
                  <svg fill={heartColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button>
              </div>
            }
          </div>

          </div>
          <div className="lg:w-1/2 w-full lg:h-auto h-64 lg:py-6 mb-6 lg:mb-0">
            <img alt={`${make + model}`} className="w-full h-full object-cover object-center rounded" src={equipment_image} />
          </div>
        </div>

        <EquipmentMap location={equipmentLocation} />
      </div>
    </section>
  </>
  )
}


export default EquipmentDisplay;