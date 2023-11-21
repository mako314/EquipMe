import React,{useContext, useEffect, useState, Fragment} from "react";
import CartItem from "./CartItem";
import CreateNewCart from "./CreateNewCart";
import ApiUrlContext from '../Api'
import {toast} from 'react-toastify'
import { UserSessionContext } from "../UserComponents/SessionContext";


function Cart(){

  const { currentUser, role } = UserSessionContext() 
  const apiUrl = useContext(ApiUrlContext)
  const [currentCart, setCurrentCart] = useState(0)
  const [cartData, setCartData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)


  // console.log(currentCart)

  useEffect(() => {
    if (role === 'user') {
      setCartData(currentUser.cart)
    } else if (role === 'owner') {
      toast.warn(`🛒 We don't currently support owner carts`,{
        "autoClose" : 2000
      })
    }
  }, [currentUser])

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
    cartData[currentCart].cart_item?.forEach((item) => {
      if (Array.isArray(item.equipment.equipment_price)) {
        item.equipment.equipment_price?.map((price) => {
          return(
          rateOptions = 
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

  // console.log("JUST CART:", cartData)
  // console.log("CART DATA:", cartData)

    return(
        <div className="h-screen bg-gray-100 pt-20 overflow-y-auto">
    <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
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

      { cartData[currentCart].cart_item?.length === 0 ?
        <p> Cart is empty or loading...</p> 
        : 
        cartData[currentCart]?.cart_item.map((item) => (
          // console.log("THE ITEM:", item),
          <CartItem 
          key={ `${item.equipment_id}_${item.created_at}`}
          equipment_image={item.equipment.equipment_image}
          make={item.equipment.make}
          model={item.equipment.model}
          rateOptions={rateOptions}
          cartItemRate={item.rental_rate}
          cartItemRentalLength={item.rental_length}
          cartItemQuantity={item.quantity}
          />
        ))  
        }

      </div>
      <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
        <div className="mb-2 flex justify-between">
          <p className="text-gray-700">Subtotal</p>
          <p className="text-gray-700">$129.99</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">Shipping</p>
          <p className="text-gray-700">$4.99</p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between">
          <p className="text-lg font-bold">Total</p>
          <div className="">
            <p className="mb-1 text-lg font-bold">${(cartData[currentCart]?.total / 100)}</p>
            <p className="text-sm text-gray-700">including VAT</p>
          </div>
        </div>
        <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">Check out</button>
      </div>

    </div>
  </div>
    )
}

export default Cart