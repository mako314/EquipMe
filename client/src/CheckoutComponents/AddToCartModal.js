import React, { useContext, useState, useEffect, Fragment } from 'react'
import ApiUrlContext from '../Api'
import UserContext from '../UserComponents/UserContext'
import CreateNewCart from './CreateNewCart'

function AddToCartModal({equip_id, oneEquipment, toggleModal, isModalOpen }){

  //Grab apiUrl from context + user info
  const apiUrl = useContext(ApiUrlContext)
  const [user, setUser] = useContext(UserContext)

  //States to capture info, day ranges, costs, length of rental, quantity, and track modal, cart
  const [selectedRate, setSelectedRate] = useState("hourly")
  const [dayRange, setDayRange] = useState('')
  const [rentalLength, setRentalLength] = useState(1)
  const [equipmentQuantity, setEquipmentQuantity] = useState(1)
  const [currentCart, setCurrentCart] = useState(1)
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewCartModalOpen, setIsNewCartModalOpen] = useState(false)
  const [cartData, setCartData] = useState([])

  //Check session for user
  useEffect(() => {
    fetch(`${apiUrl}check_session`).then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);

  //Destructure for equipment_price
  const { equipment_price, equipment_image } = oneEquipment

  // console.log("Equipment price:", equipment_price)
  // console.log("Your Equipment:",oneEquipment)
  // console.log("The USER:", user)
  useEffect(() => {
    if (user) {
      setCartData(user.cart)
    }
  }, [user])

//   let cart
//   if (user){
//     cart  = user.cart
// }

const addCart = (newCart) => {
  setCartData((cartData) => [...cartData, newCart])
}
  console.log("YOUR CART:", cartData)
  // console.log("This is the selected rate:", selectedRate)
  // console.log("this is the date range:", dayRange)

  // console.log("The Cart ID:", currentCart)


  //Map over equipment price, and take the rates as options
  //May need to do fragment KEY
  const rateOptions = equipment_price?.map((price) => {
    return (
    <Fragment key={price.id}>
    <option className="text-black"value="hourly">Hourly Rate: ${price.hourly_rate/100}</option>
    <option className="text-black"value="daily">Daily Rate: ${price.daily_rate/100}</option>
    <option className="text-black"value="weekly">Weekly Rate: ${price.weekly_rate/100}</option>
    <option className="text-black"value="promo">Promo Rate: ${price.promo_rate/100}</option>
    </Fragment>)
  })

  //Just basic day options, to track the amount of time they're trying to rent for
  const dayOptions = <>
  <option className="text-black"value="hours">Hours</option>
  <option className="text-black"value="days">Days</option>
  <option className="text-black"value="week">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

  const cartOptions = cartData?.map((item) => {
    return (
    <Fragment key={`${item.id} ${item.cart_name}`}>
    <option className="text-black"value={item.id}>{item.cart_name}</option> 
    
    </Fragment>)
  })
  
  // //Toggles modal to ADD to cart
  // const toggleModal = () => {
  //     setIsModalOpen(!isModalOpen)
  // }

 //Toggles modal to CREATE a new cart
  const toggleCartCreationModal = () => {
    setIsNewCartModalOpen(!isNewCartModalOpen)
}
  

  //Selects which cart you're trying to add it to
  const handleCartChange = (e) => {
    setCurrentCart(e.target.value)
  }

  //Concide rate with rental length (dayRange)
  const handleRateChange = (e) => {
    const newRate = e.target.value
    setSelectedRate(newRate)
    if (newRate === "hourly"){
      setDayRange("hours")
    } else if (newRate === "daily"){
      setDayRange("days")
    } else if (newRate === "weekly"){
      setDayRange("week")
    } else if (newRate === "promo"){
      setDayRange("promo")
    }
  }

  //Concide rental length (dayRange) with rate
  const handleDayRangeChange = (e) => {
    const newDayRange = e.target.value
    setDayRange(newDayRange)
    if (newDayRange === "hours"){
      setSelectedRate("hourly")
    } else if (newDayRange === "days"){
      setSelectedRate("daily")
    } else if (newDayRange === "week"){
      setSelectedRate("weekly")
    } else if (newDayRange === "promo"){
      setSelectedRate("promo")
    }
  }

    //----------------------
    // -1 on quantity
    const decrementQuantity = () => {
      setEquipmentQuantity((prevequipmentQuantity) => (prevequipmentQuantity > 1 ? prevequipmentQuantity - 1 : 1))
    }

    // +1 on quantity 
    const incrementQuantity = () => {
      setEquipmentQuantity(prevequipmentQuantity => prevequipmentQuantity + 1)
    }


  // Handles adding item to cart, may need to create a cart first, haha...ha......ha.
  // So the post works, but you have to play around with it, I needto capture values prior to 
  console.log("This is the rental length:",rentalLength)
  console.log("This is the selected rate:",selectedRate)
  console.log("This is the equipment quantity:",equipmentQuantity)
  console.log("This is the equipment ID:",equip_id)
  console.log("This is the current cart ID:",currentCart)

  function handleAddToCartClick() {
    let rental_length = rentalLength
    let rental_rate = selectedRate
    let quantity = equipmentQuantity
    let equipment_id = equip_id

    fetch(`${apiUrl}cart/${currentCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( { rental_length, equipment_id, quantity, rental_rate } ),
      }).then((resp) => {
        if (resp.ok) {
          resp.json().then(() => {

          })
        }
      })
  }

    return(
      <> 
      <button onClick={toggleModal} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
      Add to Cart
      </button>
      {isModalOpen && (
      <div 
          id="authentication-modal" 
          tabIndex="-1" 
          aria-hidden="true" 
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto"
      >
          <div className="relative w-full max-w-2xl max-h-3/5 bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="">
                  <button 
                      onClick={toggleModal} 
                      type="button" 
                      className="absolute top-3 right-2.5 text-white bg-blue-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                      X 
                  </button>
      
                  <div className="px-6 py-6 lg:px-8 overflow-y-auto">
                      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">My Cart</h3>
                      <div className="space-y-6 " action="#">
                          <div className="flex justify-between">

                              <div className="flex items-start">
                                  {/* CART SELECTION*/}
                                  <select
                                        className="text-sm font-medium text-gray-900 dark:text-gray-300 border-2 border-black"
                                        value={currentCart} 
                                        onChange={handleCartChange}>
                                        {cartOptions}
                                  </select>
                                  <label
                                      htmlFor="remember" 
                                      className="text-sm ml-2 font-medium text-gray-900 dark:text-gray-300"
                                  >
                                  Make sure you've selected the correct cart! 
                                  </label>
                              </div>
                          </div>

                          <div className="space-y-6 overflow-y-auto max-h-96">

                          {/* Grab this for the map */}
                          <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                              {/* Image Preview */}
                              <img src={equipment_image} alt="product-image" className="w-full rounded-lg sm:w-40" />

                              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                  {/* Product Details */}
                                  <div className="mt-5 sm:mt-0">
                                      <h2 className="text-lg font-bold text-gray-900">{oneEquipment.make} {oneEquipment.name}</h2>
                                      {/* Additional details like size or color can go here */}
                                      <p className="mt-1 text-xs text-gray-700">{oneEquipment.model}</p>
                                  </div>

                                  {/* Quantity and Price */}
                                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                      <div className="flex items-center justify-end space-x-2">
                                          {/* Quantity Adjustment */}
                                          <span className='text-black'> Quantity </span>
                                          <span
                                              className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-white"
                                              onClick={decrementQuantity}
                                          >
                                              -
                                          </span>
                                          <input 
                                                className="h-8 w-8 border border-black bg-white text-black text-center text-xs outline-none"
                                                type="number"
                                                value={equipmentQuantity}
                                                onChange={(e) => setEquipmentQuantity(parseInt(e.target.value, 10))}
                                                min="1" />
                                          <span
                                            className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                                            onClick={incrementQuantity}
                                        >
                                            +
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-end space-x-2">
                                          {/* Price */}
                                          <input 
                                                className="h-8 w-8 border border-black bg-white text-black text-center text-xs outline-none"
                                                type="number"
                                                value={rentalLength}
                                                onChange={(e) => setRentalLength(parseInt(e.target.value, 10))}
                                                min="1" />
                                          <select
                                          className="border-2 border-black text-sm text-black"
                                          value={dayRange} 
                                          onChange={handleDayRangeChange}>
                                          {dayOptions}
                                          </select>
                                      </div>

                                      <div className="flex items-center justify-end space-x-2">
                                          {/* Price */}
                                          <select
                                          className="border-2 border-black text-sm text-black"
                                          value={selectedRate} 
                                          onChange={handleRateChange}>
                                          {rateOptions}
                                          </select>
                                      </div>

                                      
                                  </div>
                              </div>
                          </div>
                          
                          {/* Grab this for the map */}

                        </div>

                          <div className="flex justify-end">
                              <button
                                onClick={toggleCartCreationModal}
                                className="text-white p-2 rounded-md bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 mr-4"
                              >
                                Create New Cart
                              </button>

                              {/* isNewCartModalOpen Modal */}
                                {isNewCartModalOpen && (
                                  <div className="fixed inset-0 bg-opacity-50 z-40 mt-36 overflow-y-auto h-full w-full" onClick={toggleCartCreationModal}>
                                    {/* isNewCartModalOpen Modal */}
                                    <div className="relative top-20 mx-auto p-5 border-2 border-black w-96 shadow-lg rounded-md bg-white z-50" onClick={(e) => e.stopPropagation()}>
                                      <div className="mt-3 text-center">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#3b82f6" class="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                        </div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Cart</h3>
                                        <CreateNewCart addCart={addCart} toggleModal={toggleCartCreationModal} />
                                      </div>
                                    </div>
                                  </div>
                                )}

                              <button 
                                  // type="submit" 
                                  // onClick={handleSendMessage}
                                  onClick={handleAddToCartClick}
                                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                  Add to Cart
                              </button>
                          </div>
                          
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-300">
                              * You will have another chance to edit your carts contents.
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      )}
      </>
    )
}

export default AddToCartModal