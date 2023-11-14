import React, { useContext, useState, useEffect } from 'react'
import ApiUrlContext from '../Api'
import UserContext from '../UserComponents/UserContext'

function AddToCartModal({equip_id, oneEquipment}){

  //Grab apiUrl from context + user info
  const apiUrl = useContext(ApiUrlContext)
  const [user, setUser] = useContext(UserContext)

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
  let cart
  if (user){
    cart  = user.cart
}
  console.log("YOUR CART:", cart)
  
  // console.log("This is the selected rate:", selectedRate)
  // console.log("this is the date range:", dayRange)

  

  //States to capture info, day ranges, costs, length of rental, quantity, and track modal, cart
  const [selectedRate, setSelectedRate] = useState("hourly")
  const [dayRange, setDayRange] = useState('')
  const [rentalLength, setRentalLength] = useState(1)
  const [equipmentQuantity, setEquipmentQuantity] = useState(1)
  const [currentCart, setCurrentCart] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // console.log("The Cart ID:", currentCart)


  //Map over equipment price, and take the rates as options
  const rateOptions = equipment_price?.map((price) => {
    return (<>
    <option className="text-black"value="hourly">Hourly Rate: ${price.hourly_rate/100}</option>
    <option className="text-black"value="daily">Daily Rate: ${price.daily_rate/100}</option>
    <option className="text-black"value="weekly">Weekly Rate: ${price.weekly_rate/100}</option>
    <option className="text-black"value="promo">Promo Rate: ${price.promo_rate/100}</option>
    </>)
  })

  //Just basic day options, to track the amount of time they're trying to rent for
  const dayOptions = <>
  <option className="text-black"value="hours">Hours</option>
  <option className="text-black"value="days">Days</option>
  <option className="text-black"value="week">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

  const cartOptions = cart?.map((item) => {
    return <>
    <option className="text-black"value={item.id}>{item.cart_name}</option> 
    
    </>
  })
  
  //Toggles modal
  function toggleModal() {
      setIsModalOpen(!isModalOpen)
  }

  // -1 on quantity
  const decrementQuantity = () => {
    setEquipmentQuantity((prevequipmentQuantity) => (prevequipmentQuantity > 1 ? prevequipmentQuantity - 1 : 1))
  }

  // +1 on quantity 
  const incrementQuantity = () => {
    setEquipmentQuantity(prevequipmentQuantity => prevequipmentQuantity + 1)
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
          <div className="relative w-full max-w-2xl max-h-3/5 bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto">
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
                                        <option className="text-black"value="2"> Test 2</option>
                                  </select>
                                  <label
                                      htmlFor="remember" 
                                      className="text-sm ml-2 font-medium text-gray-900 dark:text-gray-300"
                                  >
                                  Make sure you've selected the correct cart! 
                                  </label>
                              </div>

                          </div>

                          {/* Cart Container Div */}
                          <div className="space-y-6 overflow-y-auto max-h-96">

                            {/* Grab this for the map */}
                            <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                {/* Image Preview */}
                                <img src={equipment_image} alt="product-image" className="w-full rounded-lg sm:w-40" />

                                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                    {/* Product Details */}
                                    <div className="mt-5 sm:mt-0">
                                        <h2 className="text-lg font-bold text-gray-900">{oneEquipment.make}</h2>
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
                          {/* Cart Container Div */}

                          <div className="flex justify-end">
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