import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EquipmentMap from '../MapComponents/EquipmentMap'
import AddToCartModal from '../CheckoutComponents/AddToCartModal'
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'


function EquipmentDisplay({}) {
  const [oneEquipment, setOneEquipment] = useState([])
  const { model, name, make, location, email, phone, quantity, equipment_image, equipment_price } = oneEquipment

  // THE ID HERE IS THE EQUIPMENT ID.
  const { id } = useParams()

  // Likely need the owner context also + its check session
  const [user, setUser] = useContext(UserContext)
  const apiUrl = useContext(ApiUrlContext)

  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${apiUrl}check_session`, {
      credentials: 'include'
    }).then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);


  useEffect(() => {
    fetch(`${apiUrl}equipment/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setOneEquipment(data)
      })
  }, [])

  console.log("Display Page one equipment:", equipment_image)

  const equip_prices = equipment_price?.map((price) => {
    return <>
    <span className="title-font font-medium text-2xl text-white">Hourly Rate: ${price.hourly_rate/100}</span>
    <span className="title-font font-medium text-2xl text-white">Daily Rate: ${price.daily_rate/100}</span>
    <span className="title-font font-medium text-2xl text-white">Weekly Rate: ${price.weekly_rate/100}</span>
    </>
  })



  // Need to make some onclicks for when a user clicks description, reviews, details etc. 

  //What can I include in details? Possibly whether or not the vehicle is available for delivery? Deposit ? ETC?

  // Need a rental button, basically allowing the user to rent from this page
  let equipment_pictures
  // if (images) {
  //   equipment_pictures = <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={images[0].imageURL} />

  // }

  let loggedOutDisplay
  loggedOutDisplay = (
    <section className="text-gray-400 bg-gray-900 body-font overflow-hidden ">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 flex flex-wrap mb-5 ">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{name}</h2>
            <h1 className="text-white text-3xl title-font font-medium mb-4">{make + model}</h1>
            <div className="flex mb-4">
              <a className="flex-grow text-indigo-400 border-b-2 border-indigo-500 py-1 text-lg px-1 mr-2">Description</a>
              <a className="flex-grow border-b-2 border-gray-800 py-1 text-lg px-1 mr-2">Reviews</a>
              <a className="flex-grow border-b-2 border-gray-800 py-1 text-lg px-1">Details</a>
            </div>
            <p className="leading-relaxed mb-4">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam iligo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean.</p>
            <div className="flex border-t border-gray-800 py-2">
              <span className="text-gray-500">Location</span>
              <span className="ml-auto text-white">{location}</span>
            </div>
            <div className="flex border-t border-gray-800 py-2">
              <span className="text-gray-500">Owner</span>
              <span className="ml-auto text-white">Owner Name</span>
            </div>
            <div className="flex border-t border-b mb-6 border-gray-800 py-2">
              <span className="text-gray-500">Quantity</span>
              <span className="ml-auto text-white">{quantity}</span>
            </div>
            <div className="flex">
              {/* <span className="title-font font-medium text-2xl text-white">$58.00</span> */}
              {equip_prices}
              {/* <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" >Rent Now</button> */}
              <AddToCartModal equip_id={id} oneEquipment={oneEquipment}/>
              <button className="rounded-full w-10 h-10 bg-gray-800 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>

            </div>

          </div>

          <img alt={`${make + model}`} class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 ml-auto object-cover object-center rounded" src={equipment_image} />
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



// const tailwindProductDisplay =

{/* <div>
  <section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto flex flex-col">
      <div class="lg:w-4/6 mx-auto">
        <div class="rounded-lg h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src="https://t4.ftcdn.net/jpg/00/93/18/45/360_F_93184515_pMvi6Fz6o1Qu32kM6lXycawPq8igxjIc.jpg" />
        </div>
        <div class="flex flex-col sm:flex-row mt-10">
          <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
            <div class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="flex flex-col items-center text-center justify-center">
              <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">{model}</h2>
              <div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
              <p class="text-base">{name}</p>
            </div>
          </div>
          <div class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
            <p class="leading-relaxed text-lg mb-4">{make} <br />{location} <br />{email} <br />{phone}</p>
            {/* <a class="text-indigo-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
</a> */}
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
// </div> */}

// {tailwindProductDisplay}

