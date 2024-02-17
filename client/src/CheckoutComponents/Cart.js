import React,{useContext, useEffect, useState, Fragment} from "react";
import CartItem from "./CartItem";
import CreateNewCart from "./CreateNewCart";
import ApiUrlContext from '../Api'
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { UserSessionContext } from "../UserComponents/SessionContext";
import LoadingPage from "../ExtraPageComponents/LoadingPage";
import Page404 from "../ExtraPageComponents/Page404";


function Cart(){

  const { currentUser, role, setCurrentUser, checkSession} = UserSessionContext() 
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
  const [cartItemsChecked, setCartItemsChecked] = useState({})

  const [isLoading, setIsLoading] = useState(true)

  const [toggleDelete, setToggleDelete] = useState(false)

  const [noCarts, setNoCarts] = useState(false)
  const navigate = useNavigate()

  // https://stackoverflow.com/questions/42173786/react-router-pass-data-when-navigating-programmatically
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some

  // Handles navigating to the checkout with the clientSecret
  const handleCheckoutNavigation = (client_secret) => {
    navigate('/checkout', { state: { clientSecret: client_secret} });
  }

  // console.log("THE CART TOTAL:", individualTotal)
  // console.log("THE CURRENT CART TOTAL:", currentCartTotal)
  // console.log("AVAILABLE TO CHECK OUT TOTAL:", availableToCheckOutTotal)
  // console.log("THE CURRENT CART TOTAL BACKEND:", cartData[currentCart]?.total)
  // console.log(Array.isArray(individualTotal))
  // console.log("THE CART TESTING:", cartData[currentCart])
  // console.log("THE CART DATA:", cartData)
  // console.log("THE CURRENT CART VALUE:", currentCart)

  useEffect(() => {

    let itemsBothPartiesAgreedOn = 0
    let allTotalCarts = 0 

    if(Array.isArray(individualTotal)){
  // Individual total is calculated inside of CartItem.js, values passed in via props below in the return.
  // Filter items belonging to the current cart, filter any time need something for x, so I'm trying to only track totals for this specific cart, filter by cart ID.
  const itemsInCurrentCartBothAgreed = individualTotal?.filter(item => item?.cart_id === cartData[currentCart]?.id && item?.agreement_status === 'both-accepted')

  // console.log("NUMBER I'D TRY TO USE FOR CART STANDING TOTAL AVAILABLE TO CHECKOUT?", itemsInCurrentCartBothAgreed.length)

  // if(itemsInCurrentCartBothAgreed.length > 0){
  //   setAvailableToCheckoutNumb(itemsInCurrentCartBothAgreed.length)
  // } else{
  //   setAvailableToCheckOutTotal(0)
  // }

  // console.log("ITEMS IN CURRENT CART:", itemsInCurrentCart)

  //This just takes into account ALL the items in a users cart, where the items cart ID matches the current carts ID.
  const itemsInCurrentCartAll = individualTotal?.filter(item => item?.cart_id === cartData[currentCart]?.id)
  
  // console.log("CURRENT ITEMS IN CART:", itemsInCurrentCartAll)
  // Sum up the costs of these items in the users current cart
  itemsInCurrentCartBothAgreed.forEach((item) => {
    // console.log("LOOK HERE FOR THE ITEM:",item)
    // Can likely just do a +1 here or prevCount => prevCount +1 state for the cart number

    if(item.isChecked) {
      // console.log("TOTAL COST OF ITEMS THAT BOTH USERS AGREED UPON AND ARE CHECKED:", item.cost)
      itemsBothPartiesAgreedOn += item.cost
    }

  })

  // A for each that summarizes ALL items in the cart, 
  itemsInCurrentCartAll.forEach((item) => {
    // console.log("INDIVIDUAL ITEM IN CART:", item)
    // console.log(item)
    allTotalCarts += item.cost
})

 }
// Calculates current carts total, and the available to check out total (meaning both parties accepted the rental agreement)
setCurrentCartTotal(allTotalCarts)
setAvailableToCheckOutTotal(itemsBothPartiesAgreedOn)
// console.log("THE CURRENT TOTAL FOR CART", cartData[currentCart]?.cart_name, ":", currentTotal)

}, [cartData, individualTotal])

// Math to check for the total amounts both backend and front end
// console.log("CHECKING FRONT END TO SEE IF BACKEND VALUE IS EQUAL TO", availableToCheckOutTotal * 100 === cartData[currentCart]?.total )
// console.log(availableToCheckOutTotal * 100)
// console.log(cartData[currentCart]?.total)


// useEffect(() => {
//   console.log("cartData updated:", cartData);
//   console.log("currentCart updated:", currentCart);
// }, [cartData, currentCart])


useEffect(() => {
  if (cartItemFiltering === 'none') {
    // Include all cart items
    setFilteredCartItems(cartData[currentCart]?.cart_item)
  } else {
    // Apply the filter based on the selected agreement status
    const filteredItems = cartData[currentCart]?.cart_item.filter(item =>
      item.agreements.some(agreement => agreement.agreement_status === cartItemFiltering)
    )
    // console.log(filteredItems)
    setFilteredCartItems(filteredItems)
  }
}, [cartItemFiltering, cartData, currentCart, currentUser])

// UseEffect for initial cart load,
  useEffect(() => {
    // console.log("Fetching cart data...")
    if (role === 'user') {
      setCartData(currentUser.cart)
      setIsLoading(false)
    } else if (role === 'owner') {
      toast.warn(`🛒 We don't currently support owner carts`,{
        "autoClose" : 2000
      })
      
    }
  }, [currentUser, currentCart])

  //If a user has no items in cart or no cart created display this instead
  if (role === 'owner'){
      return <div> Not available! </div>
  }

  if (isLoading){
    return <LoadingPage loadDetails={"Cart"}/>
  }



  //Changes cart based on cart ID
  const handleCartChange = (e) => {
    if(currentUser.cart.length === 0){

    }
    // setCurrentCart(e.target.value)
    // Find index found it's way back in, what an amazing function
    const cartId = parseInt(e.target.value, 10) // assuming your IDs are integers
    const cartIndex = cartData.findIndex(cart => cart.id === cartId)
    setCurrentCart(cartIndex)
  }

  // //Needed to move this here to have the state update for a re-render, allows for creating a new cart.

  const addCart = (newCart) => {
    setCartData(prevCartData => {
      const updatedCartData = [...prevCartData, newCart]
      setCurrentCart(updatedCartData.length - 1) // Set currentCart to the index of the new cart
      return updatedCartData
    })
  }

  // console.log("THE CURRENT CART INDEX:", currentCart)

  //Simple open modal for cart creation
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const cartOptions = currentUser?.cart?.length > 0 ? (
    cartData?.map((item) => (
      <option key={item.id} value={item.id}>{item.cart_name}</option>
    ))
  ) : (
    <option key="no-cart" value="" disabled>No carts available</option>
  )


  //Map over equipment price, and take the rates as options
  let rateOptions
  if(Array.isArray(cartData[currentCart]?.cart_item)){
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

  // console.log("THE CURRENT CART ID:", currentCart)
  // Handle item filtering radio button function:
  // Takes into account the cart item rental agreement status and filters for only those, i.e. both-accepted, completed, user accepted, owner accepted.
  const handleCartItemFiltering = (event) => {
    // console.log('Selected value:', event.target.value)
    setCartItemFiltering(event.target.value)
  }

  // console.log("The filtered Cart Items:", filteredCartItems)

  

  // This function handles the actual checkout aspect, and grabbing the client_secret that is passed into the embedded from located in the StripeCheckout component. This is needed to create the options for the checkout provider.
  // Essentially we map over the filtered cart items (and we check to see if that item has been checked for checkout with isChecked) we then map over and send that item as json to the backend so we can map over it and include it in the line items for the checkout. In the end it just navigates you to the page and stripe handles checkout
  const handleCheckoutStripe = async () => {
    const itemsReadyForCheckout = filteredCartItems.filter(item => item.isChecked)
    .map(item => {
      // console.log(item)
      return {
        agreement_status: item.agreements[0].agreement_status,
        delivery: item.agreements[0].delivery,
        delivery_address: item.agreements[0].delivery_address,
        quantity: item.quantity,
        price_cents_at_addition: item.price_cents_at_addition,
        price_cents_if_changed : item.price_cents_if_changed,
        rental_rate: item.rental_rate,
        rental_length: item.rental_length,
        equipment_id: item.equipment_id,
        cart_id: item.cart_id,
        cart_item_id: item.id,
        user_id: currentUser.id
      }
    })

    // console.log("ITEMS THAT HAVE BEEN CHECKBOXED:", itemsReadyForCheckout)
    // Or I can likely use this : o, but this is just checkboxed, so I'd need something to determine it previously (cart amount ready to checkout )
    // console.log("THE USER ID:", currentUser.id)
    // console.log("THE CART ID", currentCart)

    if (itemsReadyForCheckout.length === 0) {
      console.log("No items are ready for checkout")
      toast.warn(`🛒 You haven't selected anything to checkout yet!`,{
        "autoClose" : 2000
      })
      return
    }

    try {
      const response = await fetch(`${apiUrl}v1/checkout/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(itemsReadyForCheckout),
      })
  
      if (response.ok) {
        const data = await response.json()
        // console.log("Checkout Successful:", data)
        handleCheckoutNavigation(data.client_secret)
        // navigate(`/checkout`)
      } else {
        const errorData = await response.json()
        toast.warn(`🚧 The owner likely either hasn't finished their stripe onboarding yet, or there's an error with the reserved quantity. Please contact the owner of this equipment`,{
        "autoClose" : 6000
        })
        console.error('Error Response:', errorData)
      }
    } catch (error) {
      console.error('Fetch Error:', error)
    }
  }


// This function maps over the filteredCartItems, and is passed to cart_item to be incorporated with the checkbox. When an item is checked it gives the isChecked a value of true, which then allows for that item to be checked out. 
// This way if a user has say 5 items, and only wants to check out 2, they are able to select the 2 they'd like to checkout.
//If it matches, a new object is created using the spread operator to copy all existing properties of the item. Then, the `isChecked` property is set to the new value provided by the `isChecked` parameter.
const handleItemCheck = (cartItemId, isChecked) => {
  const updatedCartItems = filteredCartItems.map(item => 
    item.id === cartItemId ? {...item, isChecked} : item
  )
  setFilteredCartItems(updatedCartItems)
}


// Toggle for delete button
const handleToggleDelete = () => {
  setToggleDelete(!toggleDelete)
}

//Handles deleting the cart item!
const handleDeleteCart = async (cartId) => {
  try {
    const response = await fetch(`${apiUrl}user/${currentUser.id}/cart/${cartId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      // Filter out the deleted cart
      // const updatedCarts = cartData.filter(cart => cart.id !== cartId)
      // Update the state
      // setCartData(updatedCarts)
      await fetchAndUpdateCartData()
      setToggleDelete(!toggleDelete)
      toast.success(`💥 Cart successfully deleted!`, {
        "autoClose": 2000
    })
    } else {
      // console.log("Error in the fetch!")
      toast.error(`Error: Failed to delete, check your input and try again!`,
      {
        "autoClose" : 2000
      })
    }
  } catch (error) {
    // Handle fetch errors
    toast.error(`Error: Failed to delete, check your input and try again!`,
    {
      "autoClose" : 2000
    })
  }
}

const onItemDeleted = (deletedItemId) => {
  const updatedCartItems = filteredCartItems.filter(item => item.id !== deletedItemId)
  setFilteredCartItems(updatedCartItems)

  // Recalculate total and console log each item
  const newTotal = updatedCartItems.reduce((total, item) => {
    // console.log(item) // Log each item

    // Determine the price to use (if changed or at addition)
    const itemPrice = (item.price_cents_if_changed != null) ? item.price_cents_if_changed : item.price_cents_at_addition

    // Calculate item total considering quantity and rental length
    const itemTotal = itemPrice * item.quantity * item.rental_length

    return total + itemTotal 
  }, 0)

  // console.log(newTotal)

  // Convert total to a more readable format
  const newTotalInDollars = newTotal / 100
  // console.log("New Total:", newTotalInDollars)

  setCurrentCartTotal(newTotalInDollars)
  fetchAndUpdateCartData()
  
}


const fetchAndUpdateCartData = async () => {
  try {
    const response = await fetch(`${apiUrl}user/${currentUser.id}/cart`)
    if (response.ok) {
      const updatedCartData = await response.json()
      if (updatedCartData.length === 0) {
        // No carts are available
        setCartData([])
        setNoCarts(true)
        setCurrentCart(-1) // Resetting currentCart
        checkSession()
        // console.log('Updated cartData: updatedCartData.length === 0', updatedCartData)
      } else {
        // Carts are available
        setCartData(updatedCartData)
        // console.log('Updated cartData: else', updatedCartData)
        setCurrentUser(prevUser => ({
          ...prevUser,
          cart: updatedCartData
        }))
        checkSession()
        setNoCarts(false)
      }
    } else {
      const errorData = await response.json()
      console.error("An error occurred:", errorData.message)
      setNoCarts(true)
      setCartData([])
      setCurrentCart(-1)
      checkSession()
      toast.error(`Error: ${errorData.message}`,
      {
        "autoClose" : 2000
      })
    }
  } catch (error) {
    // Handle network/JS errors
    console.error("A network or JavaScript error occurred:", error.message)
    toast.error(`Network/JavaScript Error: ${error.message}`,
    {
      "autoClose" : 2000
    })
  }
}


// console.log("THE ITEMS TO CHECK OUT:", filteredCartItems)
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
            key={`cart-select-${cartData.length}`}
            className="text-sm mb-2 font-medium text-gray-900 dark:text-gray-300 border-2 border-black"
            value={currentCart >= 0 && currentCart < cartData.length ? cartData[currentCart].id : ''} 
            onChange={handleCartChange}>
            <option value="" disabled>--Please Select a Cart--</option>
            {cartOptions}


      </select>
       {/* Button to open the modal */}
       <button
          onClick={toggleModal}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
        >
          Create New Cart
        </button>


        {!toggleDelete ? (
                <button
                    onClick={handleToggleDelete}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                >
                    Delete my cart
                </button>
            ) : (
                <>
                    <button
                        onClick={() => handleDeleteCart(cartData[currentCart]?.id)}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                    >
                        Yes, I'm sure
                    </button>
                    <button
                        onClick={handleToggleDelete}
                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                    >
                        No, I changed my mind
                    </button>
                </>
          )}


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
                <CreateNewCart addCart={addCart} toggleModal={toggleModal} setCurrentCart={setCurrentCart}/>
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
              proceedToCheckout={cartItemsChecked[item.id]}
              handleItemCheck={handleItemCheck}
              setFilteredCartItems={setFilteredCartItems}
              filteredCartItems={filteredCartItems}
              onItemDeleted={onItemDeleted}
            />
          )
        })
      )  : (
        <p>No items match your filter criteria.</p>
      )
    }

{cartData.length === 0 && (
          <div className="text-center p-10">
            <h2 className="text-2xl font-bold mb-4">No Carts Available</h2>
            <p>Create a new cart to get started.</p>
            {/* You can add a button or link to create a new cart here */}
          </div>
        )}

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
          </div>
        </div>
        <button 
        className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
        onClick={handleCheckoutStripe}
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