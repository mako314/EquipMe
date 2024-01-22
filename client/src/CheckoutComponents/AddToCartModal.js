import React, { useContext, useState, useEffect, Fragment } from 'react'
import ApiUrlContext from '../Api'
import { UserSessionContext } from '../UserComponents/SessionContext'
import Calendar from '../CalendarComponents/Calendar'
import CreateNewCart from './CreateNewCart'
import {toast} from 'react-toastify'
import { mixed, object } from 'yup'

function AddToCartModal({equip_id, oneEquipment, toggleModal, isModalOpen }){

  //Grab apiUrl from context + user info
  const apiUrl = useContext(ApiUrlContext)
  const { currentUser, role, checkSession } = UserSessionContext()

  // console.log("THE delivery state:", oneEquipment.delivery)
  //States to capture info, day ranges, costs, length of rental, quantity, and track modal, cart
  //This might be multiple states for now, but the plan is to convert it to one big state object.
  const [selectedRate, setSelectedRate] = useState("hourly")
  const [dayRange, setDayRange] = useState('')
  const [rentalLength, setRentalLength] = useState(1)
  const [equipmentQuantity, setEquipmentQuantity] = useState(1)
  const [currentCart, setCurrentCart] = useState(null) 
  const [cartData, setCartData] = useState([])
  const [isDelivery, setIsDelivery] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')

  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewCartModalOpen, setIsNewCartModalOpen] = useState(false)
  
  //State for calendar
  const [startRental, setStartRental] = useState('')
  const [endRental, setEndRental] = useState('')

  //Destructure for equipment_price
  const { equipment_price, equipment_image } = oneEquipment

  // console.log("Equipment price:", equipment_price)
  // console.log("Your Equipment:",oneEquipment)
  
  // Swapped the ifs here to test whether the role is user (not really needed since button is hidden, but hey, better than not doing it?) and whether current cart exists. if it does, exit the if, and just set cart data.
  useEffect(() => {
    if (role === 'user' && currentCart != null) {
    setCartData(currentUser.cart)
    // console.log(' first if ')
    } else if (role === 'user' && currentUser?.cart?.length > 0){
    setCartData(currentUser.cart)
    setCurrentCart(currentUser.cart[0]) // Set the first cart as the current cart
    // console.log(' second if ')
  }
  }, [currentUser])

  const currentUserAddress = `${currentUser?.address_line_2 === '' ?  currentUser?.address : currentUser?.address + ',' + currentUser?.address_line_2}, ${currentUser?.city}, ${currentUser?.state} ${currentUser?.postal_code} `

  // console.log("THE CURRENT CART DATA:", currentUser.cart)

  const addCart = (newCart) => {
    setCartData((cartData) => [...cartData, newCart])
  }
  // console.log("YOUR CART:", cartData)
  // console.log("This is the selected rate:", selectedRate)
  // console.log("this is the date range:", dayRange)
  // console.log("The Cart CURRENTLY:", currentCart)


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
  <option className="text-black"value="weeks">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

  // Cart options are mapped from a users cart data, using the value to find and set current cart
  const cartOptions = cartData?.map((item) => {
    return (
    <Fragment key={`${item.id} ${item.cart_name}`}>
    <option className="text-black"value={item.id}>{item.cart_name}</option> 
    </Fragment>)
  })

  // console.log("CART OPTIONS:",cartOptions)
  
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
    // this has been grabbing the ID. But I made currentCart an object, wonder if it is the best practice? I think so.
    // Ended up using a variable to grab the target . value, state would set it in one go, and then you'd need to click again to get that state value.
    const selectedCartId = e.target.value
    // console.log("THE CART ID",selectedCartId)

    const selectedCart = cartData.find(item => item.id.toString() === selectedCartId)
    // console.log("THE CART CHANGE:",selectedCart)
    if (selectedCart) {
        setCurrentCart(selectedCart)
    }
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
      setDayRange("weeks")
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
    } else if (newDayRange === "weeks"){
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

  // console.log("The start rental:", startRental)
  // console.log("The end rental:", endRental)
  // Handles adding item to cart, may need to create a cart first, haha...ha......ha.
  // So the post works, but you have to play around with it, I needto capture values prior to 
  // console.log("This is the rental length:",rentalLength)
  // console.log("This is the selected rate:",selectedRate)
  // console.log("This is the equipment quantity:",equipmentQuantity)
  // console.log("This is the equipment ID:",equip_id)
  // console.log("This is the current cart ID:",currentCart.id)
  // console.log("ALL THE CART DATA:", cartData)
  // console.log("REAL CURRENT CART:", currentCart)

  function handleAddToCartClick() {
    if(startRental === '' || endRental === ''){
      return toast.warn(`📆 Please pick a date to add this item to your cart!`,
        {
        "autoClose" : 2000
        })
    } if(deliveryAddress ===''){
      return toast.warn(`📆 Please put a delivery address, or select for pickup.`,
      {
      "autoClose" : 2000
      })
    } 
    // The Object.keys() static method returns an array of a given object's own enumerable string-keyed property names.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!currentCart || Object.keys(currentCart).length === 0) {
      return toast.warn(`🛒 Please select a cart, or create a new one to add this item.`,
      {
      "autoClose" : 2000
      })
    }
    let newCartItem ={
      'rental_length' : rentalLength,
      'rental_rate' : selectedRate,
      'quantity' : equipmentQuantity,
      'equipment_id' : equip_id
    }
    // Have useEffect to fix initial load and selecting first in users cart array
    fetch(`${apiUrl}cart/${currentCart?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCartItem),
      }).then((resp) => {
        if (resp.ok) {
          resp.json().then((newCartData) => {
            // console.log(newCartData.id)
            if(startRental && endRental){
            let cartAndEquipment = {
              'cart_id': currentCart.id,
              'equipment_id': oneEquipment.id
            }

            let newRentalAgreement = {
              'rental_start_date': new Date(startRental).toISOString(),
              'rental_end_date': new Date(endRental).toISOString(),
              'owner_id': oneEquipment.owner_id,
              'user_id': currentUser.id,
              'cart_item_id': newCartData.id,
              'delivery' : isDelivery,
              'delivery_address': deliveryAddress
            }

            //Spread two above objects into the bodyData object
            let bodyData = {
              ...cartAndEquipment,
              ...newRentalAgreement
            }

            fetch(`${apiUrl}rental/agreements`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyData),
            }).then((resp) => {
              if (resp.ok) {
                resp.json().then((rentalAgreementData) => {
                  // console.log("The new rental agreement", rentalAgreementData)
                  toast.success(`🛒 Succesfully added ${newCartItem.quantity} ${oneEquipment.make} ${oneEquipment.name} ${oneEquipment.model}, to ${currentCart.cart_name} `,
                  {
                    "autoClose" : 2000
                  })
                  checkSession()
                })
              }
            })} else {
              // console.log(resp.error)
              // console.log("Start or End Rental Date is missing or invalid")
            }
          })
        } else{
          return toast.error(`There seems to be an error, it's likely that there's no more equipment available, or you're attempting to rent too high of a quantity. If you believe this to be an error, contact the owner of this equipment.`,
          {
          "autoClose" : 8000
          })
        }
      })
  }

  useEffect(() => {
    // This function formats the date to the local timezone and removes seconds and milliseconds
    const toLocalISOString = (date) => {
      const tzOffset = date.getTimezoneOffset() * 60000 // timezone offset in milliseconds
      // https://www.w3schools.com/jsref/jsref_toisostring.asp
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1)
      //https://www.w3schools.com/jsref/jsref_substring.asp
      return localISOTime.substring(0, localISOTime.lastIndexOf(':'))
    }
  
    // This function calculates the end date based on the start date and rental duration duration type is just weekly, hourly, etc
    const calculateEndDate = (startDate, duration, durationType) => {
      const endDate = new Date(startDate)
  
      switch (durationType) {
        case 'hourly':
          endDate.setHours(endDate.getHours() + duration)
          break
        case 'daily':
          endDate.setDate(endDate.getDate() + duration)
          break
        case 'weekly':
          endDate.setDate(endDate.getDate() + (duration * 7))
          break
        default:
          throw new Error('Invalid duration type')
      }
      return endDate
    }
  
    if (startRental && rentalLength && selectedRate) {
      try {
        // Assume rentalLength is a number and selectedRate is one of 'hourly', 'daily', 'weekly'
        let duration = rentalLength
        let durationType = selectedRate // This # needs to correspond to 'hours', 'days', or 'weeks'

        // take end date and then calculate it wit hthe above function
        const endDate = calculateEndDate(new Date(startRental), duration, durationType)
        const formattedEndDate = toLocalISOString(endDate)
        setEndRental(formattedEndDate) // Update the state with the formatted end date
      } catch (error) {
        console.error(error)
        // Handle the error appropriately
        // toast.error('Error calculating end date.')
      }
    }
  }, [startRental, rentalLength, selectedRate]) 
  //toast

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
        // If the checkbox is checked, set the delivery address to the user's address
        setDeliveryAddress(currentUserAddress)
    } else {
        // If the checkbox is unchecked, clear the delivery address
        setDeliveryAddress('')
    }
  }

  const handlePickupChange = () => {
        // If pickup selected setDelivery to false
        setIsDelivery(false)
        // If the checkbox is unchecked, clear the delivery address
        setDeliveryAddress('Pickup')
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
          onClick={toggleModal}
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
                                        value={currentCart?.id} 
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
                              <img src={equipment_image} alt="product-image" className=" object-contain w-full rounded-lg sm:w-40" />

                              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                  {/* Product Details */}
                                  <div className="mt-5 sm:mt-0">
                                      <h2 className="text-lg font-bold text-gray-900">{oneEquipment.make} {oneEquipment.name}</h2>
                                      {/* Additional details like size or color can go here */}
                                      <p className="mt-1 text-xs text-gray-700 mb-2">{oneEquipment.model}</p>
                                      
                                      <Calendar startRental={startRental} setStartRental={setStartRental} endRental={endRental} setEndRental={setEndRental} durationType={dayRange} duration={rentalLength}/>
                                      
                                      {/* THE BUTTONS TO TOGGLE DELIVERY AND OR PICK UP */}
                                      <div className="mt-4">
                                      <div className="mt-4 flex items-center">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="deliveryOption"
                                                value="pickup"
                                                onChange={handlePickupChange}
                                            />
                                            <span className="ml-2 font-bold text-gray-900">Pickup</span>
                                        </label>
                                        
                                        {oneEquipment.delivery === 'True' ? 
                                        <label className="inline-flex items-center ml-6">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="deliveryOption"
                                                value="delivery"
                                                onChange={() => setIsDelivery(true)}
                                            />
                                            <span className="ml-2 font-bold text-gray-900">Delivery</span>
                                        </label> 
                                        : 
                                        <span className="ml-4 font-bold text-gray-900">Delivery not Available</span>}
                                        </div>
                                        {isDelivery && (
                                          <> 
                                          {/* https://www.w3schools.com/jsref/prop_radio_defaultchecked.asp#:~:text=Description,default%2C%20otherwise%20it%20returns%20false. */}
                                          <label className="inline-flex items-center">
                                          <input
                                              type="checkbox"
                                              className="form-checkbox"
                                              name="delivery_address"
                                              checked={deliveryAddress === currentUserAddress}
                                              onChange={handleCheckboxChange}
                                          />
                                            <span className="ml-2 font-bold text-gray-900">Use my Address on File</span>
                                        </label> 
                                            <input
                                                type="text"
                                                placeholder="Delivery Address"
                                                name="delivery_address"
                                                className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                            />
                                          </>
                                        )}
                                    </div>
                                          {/* This is the div holding the calendar also */}
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

                          <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mr-auto">
                          * Please note: <br></br>
                          The start date cannot be in the past and must be at least one hour ahead of the current local time.
                          <br></br> 
                          The end date must be scheduled after the start date.
                          <br></br> 
                          You will have the opportunity to review and edit your cart's contents before checking out.
                          </p>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#3b82f6" className="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                        </div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Cart</h3>
                                        <CreateNewCart addCart={addCart} toggleModal={toggleCartCreationModal} setCurrentCart={setCurrentCart}/>
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