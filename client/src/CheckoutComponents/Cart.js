import React,{useContext, useEffect, useState, Fragment} from "react";
import CartItem from "./CartItem";
import CreateNewCart from "./CreateNewCart";
import ApiUrlContext from '../Api'
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { UserSessionContext } from "../UserComponents/SessionContext";


function Cart(){

  const { currentUser, role } = UserSessionContext() 
  const apiUrl = useContext(ApiUrlContext)
  const [currentCart, setCurrentCart] = useState(0)
  const [cartData, setCartData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [selectedRate, setSelectedRate] = useState(0)
  const [individualTotal, setIndividualTotal] = useState([])
  const [currentCartTotal, setCurrentCartTotal] = useState(0)
  const [availableToCheckOutTotal, setAvailableToCheckOutTotal] = useState(0)

  const [cartItemFiltering, setCartItemFiltering] = useState('none')
  const [filteredCartItems, setFilteredCartItems] = useState([])

  const navigate = useNavigate()

  const handleCheckoutNavigation = () => {
    navigate(`/checkout`)
  }

  // console.log("THE CART TOTAL:", individualTotal)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some

  // console.log("THE CURRENT CART TOTAL:", currentCartTotal)
  // console.log("AVAILABLE TO CHECK OUT TOTAL:", availableToCheckOutTotal)
  // console.log("THE CURRENT CART TOTAL BACKEND:", cartData[currentCart]?.total)

  // console.log(Array.isArray(individualTotal))
  useEffect(() => {
    let itemsBothPartiesAgreedOn = 0
    let allTotalCarts = 0 

    if(Array.isArray(individualTotal)){
  // Individual total is calculated inside of CartItem.js, values passed in via props below in the return.
  // Filter items belonging to the current cart, filter any time need something for x, so I'm trying to only track totals for this specific cart, filter by cart ID.
  const itemsInCurrentCartBothAgreed = individualTotal.filter(item => item.cart_id === cartData[currentCart].id && item.agreement_status === 'both-accepted')

  // console.log("ITEMS IN CURRENT CART:", itemsInCurrentCart)

  //This just takes into account ALL the items in a users cart, where the items cart ID matches the current carts ID.
  const itemsInCurrentCartAll = individualTotal.filter(item => item.cart_id === cartData[currentCart].id)

  // Sum up the costs of these items
  itemsInCurrentCartBothAgreed.forEach((item) => {
      console.log("TOTAL COST OF ITEMS THAT BOTH USERS AGREED UPON:", item.cost)
      itemsBothPartiesAgreedOn += item.cost
  })

  // A for each that summarizes ALL items in the cart, 
  itemsInCurrentCartAll.forEach((item) => {
    // console.log(item)
    allTotalCarts += item.cost
})

 }

setCurrentCartTotal(allTotalCarts)
setAvailableToCheckOutTotal(itemsBothPartiesAgreedOn)
// console.log("THE CURRENT TOTAL FOR CART", cartData[currentCart]?.cart_name, ":", currentTotal)
}, [cartData, individualTotal])

console.log("CHECKING FRONT END TO SEE IF BACKEND VALUE IS EQUAL TO", availableToCheckOutTotal * 100 === cartData[currentCart]?.total )

console.log(availableToCheckOutTotal * 100)
console.log(cartData[currentCart]?.total)
  
useEffect(() => {
  if (cartItemFiltering === 'none') {
    // Include all cart items
    setFilteredCartItems(cartData[currentCart]?.cart_item)
  } else {
    // Apply the filter based on the selected agreement status
    const filteredItems = cartData[currentCart]?.cart_item.filter(item =>
      item.agreements.some(agreement => agreement.agreement_status === cartItemFiltering)
    )
    console.log(filteredItems)
    setFilteredCartItems(filteredItems)
  }
}, [cartItemFiltering, cartData, currentCart, currentUser])

// UseEffect for initial cart load,
  useEffect(() => {
    if (role === 'user') {
      setCartData(currentUser.cart)
    } else if (role === 'owner') {
      toast.warn(`🛒 We don't currently support owner carts`,{
        "autoClose" : 2000
      })
    }
  }, [currentUser])

  //If a user has no items in cart or no cart created display this instead
  if (!cartData || cartData?.length === 0) {
    return <div>Cart is empty or loading...</div>
  }

  //Changes cart based on cart ID
  const handleCartChange = (e) => {
    setCurrentCart(e.target.value)
  }

  //Simple open modal for cart creation
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  //Needed to move this here to have the state update for a re-render, allows for creating a new cart.
  const addCart = (newCart) => {
    setCartData((cartData) => [...cartData, newCart])
  }

  //-------------------------------------

  //  cartData[currentCart].cart_item?.length === 0 ?
  //   <p> Cart is empty or loading...</p> 
  //   : 
  //   cartData[currentCart]?.cart_item.forEach((item) => (
  //     // console.log("THE ITEM:", item)
  //   ))  
    


  // Map over carts, present options
  const cartOptions = cartData?.map((item) => {
    return (
    <Fragment key={`${item.id} ${item.cart_name}`}>
    {/* so the value starts at 0, but the item.id (cart id) starts at 1. So I -1 here to get the right cart index */}
    <option className="text-black" value={item.id - 1}>{item.cart_name}</option> 
    </Fragment>)
  })


  //Map over equipment price, and take the rates as options
  let rateOptions
  if(Array.isArray(cartData[currentCart].cart_item)){
    cartData[currentCart].cart_item?.flatMap(item => {
      if (Array.isArray(item.equipment.equipment_price)) {
        item.equipment.equipment_price?.map((price) => {
          return( rateOptions = 
          <Fragment key={price.id}>
            <option className="text-black"value="hourly">Hourly Rate: ${price.hourly_rate/100}</option>
            <option className="text-black"value="daily">Daily Rate: ${price.daily_rate/100}</option>
            <option className="text-black"value="weekly">Weekly Rate: ${price.weekly_rate/100}</option>
            <option className="text-black"value="promo">Promo Rate: ${price.promo_rate/100}</option>
          </Fragment>)
        })
      }
    })
  }


  // Handle item filtering radio button function
  const handleCartItemFiltering = (event) => {
    console.log('Selected value:', event.target.value)
    setCartItemFiltering(event.target.value)
  }


  // console.log("FILTERED CART ITEMS:", filteredCartItems)

    return(
      <div className="bg-gray-100 pt-10 pb-5">
        <div className="container mx-auto">
        <div className="container mx-auto px-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Cart Items</h1>
        <div className="flex flex-col items-center">
        <div className="mb-4 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-4 bg-white py-3 px-5 rounded-lg shadow-md">
        

        <form className="flex flex-row items-center mb-4">
        <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value='none' 
              id="none" 
              onChange={handleCartItemFiltering} 
              checked={cartItemFiltering === 'none'}
            />
            <label htmlFor="none" className="ml-2 text-gray-700">None</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="completed" 
              id="completed" 
              onChange={handleCartItemFiltering} 
              checked={cartItemFiltering === 'completed'}
            />
            <label htmlFor="completed" className="ml-2 text-gray-700">Completed</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value='owner-accepted' 
              id="owner-accepted" 
              onChange={handleCartItemFiltering} 
              checked={cartItemFiltering === 'owner-accepted'}
            />
            <label htmlFor="owner-accepted" className="ml-2 text-gray-700">Owner Accepted</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="user-accepted" 
              id="user-accepted" 
              onChange={handleCartItemFiltering} 
              checked={cartItemFiltering === 'user-accepted'}
            />
            <label htmlFor="user-accepted" className="ml-2 text-gray-700">User Accepted</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="in-progress" 
              id="in-progress" 
              onChange={handleCartItemFiltering} 
              checked={cartItemFiltering === 'in-progress'}
            />
            <label htmlFor="in-progress" className="ml-2 text-gray-700">In-Progress</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="both-accepted" 
              id="both-accepted" 
              onChange={handleCartItemFiltering} 
              checked={cartItemFiltering === 'both-accepted'}
            />
            <label htmlFor="ready-for-checkout" className="ml-2 text-gray-700">Ready for Checkout</label>
          </div>

        </form>
        </div>
        </div>
        </div>
        </div>
    
    <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
      <div className="rounded-lg md:w-2/3">
      <select
            className="text-sm mb-2 font-medium text-gray-900 dark:text-gray-300 border-2 border-black"
            value={currentCart} 
            onChange={handleCartChange}>
            {cartOptions}
      </select>
       {/* Button to open the modal */}
       <button
          onClick={toggleModal}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
        >
          Create New Cart
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 z-40 mt-36 overflow-y-auto h-full w-full" onClick={toggleModal}>
            {/* Modal */}
            <div className="relative top-20 mx-auto p-5 border-2 border-black w-96 shadow-lg rounded-md bg-white z-50" onClick={(e) => e.stopPropagation()}>
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#3b82f6" className="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
                </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Cart</h3>
                <CreateNewCart addCart={addCart} toggleModal={toggleModal} />
              </div>
            </div>
          </div>
        )}

      {/* <CreateNewCart addCart={addCart}/> */}
    {filteredCartItems && filteredCartItems.length > 0? (
        filteredCartItems.map((item) => {
          // console.log(item)
          const { hourly_rate, daily_rate, weekly_rate, promo_rate } = item.equipment.equipment_price[0]

          // Calculate rate values
          const hourlyRateValue = hourly_rate / 100
          const dailyRateValue = daily_rate / 100
          const weeklyRateValue = weekly_rate / 100
          const promoRateValue = promo_rate / 100
          
          // console.log("HOURLY RATE VALUE COMING IN TO CART ITEM:", hourlyRateValue)

          return (
            <CartItem 
              key={ `${item.equipment_id}_${item.created_at}_${item.equipment.make}_${item.equipment.model}`}
              equipment_image={item.equipment.equipment_image}
              make={item.equipment.make}
              model={item.equipment.model}
              rateOptions={rateOptions}
              cartItemRate={item.rental_rate}
              cartItemRentalLength={item.rental_length}
              cartItemQuantity={item.quantity}
              setIndividualTotal={setIndividualTotal}
              cartItemId={item.id}
              cartId={item.cart_id}
              costChange={item.price_cents_if_changed}
              agreementStatus={item.agreements[0].agreement_status}
              hourlyRate={hourlyRateValue}
              dailyRate={dailyRateValue}
              weeklyRate={weeklyRateValue}
              promoRate={promoRateValue}
            />
          )
        })
      )  : (
        <p>No items match your filter criteria.</p>
      )
    }

      </div>
      <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-12 md:w-1/3">
        <div className="mb-2 flex justify-between">
          <p className="text-gray-700">Total in Cart</p>
          <p className="text-gray-700">${(currentCartTotal).toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">Available to Checkout, both Parties Accepted</p>
          <p className="text-gray-700">${(availableToCheckOutTotal).toFixed(2)}</p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between">
          <p className="text-lg font-bold">Total</p>
          <div className="">
            <p className="mb-1 text-lg font-bold">${(availableToCheckOutTotal).toFixed(2)}</p>
            <p className="text-sm text-gray-700">including VAT</p>
          </div>
        </div>
        <button 
        className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
        onClick={handleCheckoutNavigation}
        >
        Check out
        </button>
      </div>

      
      </div>
    </div>
  </div>
    )
}

export default Cart