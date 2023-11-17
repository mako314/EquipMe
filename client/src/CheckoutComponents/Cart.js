import React,{useContext, useEffect, useState, Fragment} from "react";
import CartItem from "./CartItem";
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'

function Cart(){
  const [currentCart, setCurrentCart] = useState(0)
  const [selectedRate, setSelectedRate] = useState('')
  const [dayRange, setDayRange] = useState('')
  const [rentalLength, setRentalLength] = useState(1)
  const [equipmentQuantity, setEquipmentQuantity] = useState(1)

  const [cartData, setCartData] = useState([]);

  const [user, setUser] = useContext(UserContext)
  const apiUrl = useContext(ApiUrlContext)

  // console.log(user)

  useEffect(() => {
    fetch(`${apiUrl}check_session`, {
      credentials: 'include'
    }).then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    })
  }, [])

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${apiUrl}user/${user?.id}/cart/`)
        if (response.ok) {
          const carts = await response.json()
          setCartData(carts)
          // update cart state here
        } else {
          // Handle errors
        }
      } catch (error) {
        console.log(error)
        // Handle fetching errors
      }
    }
  
    fetchCartData()
  }, [user])

  console.log(cartData[currentCart].items)

  const handleCartChange = (e) => {
    setCurrentCart(e.target.value)
  }

  let cart
  if (user){
    cart  = user?.cart
  }

  //-------------------------------------
  //Just basic day options, to track the amount of time they're trying to rent for
  const dayOptions = <>
  <option className="text-black"value="hours">Hours</option>
  <option className="text-black"value="days">Days</option>
  <option className="text-black"value="week">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

  // Map over carts, present options
  const cartOptions = cart?.map((item) => {
    return (
    <Fragment key={`${item.id} ${item.cart_name}`}>
    {/* so the value starts at 0, but the item.id (cart id) starts at 1. So I -1 here to get the right cart index */}
    <option className="text-black" value={item.id - 1}>{item.cart_name}</option> 
    </Fragment>)
  })

  // console.log(currentCart)

  if (!cart || cart?.length === 0) {
    return <div>Cart is empty or loading...</div>
  }

  //Map over equipment price, and take the rates as options
  let rateOptions
  if(Array.isArray(cart[currentCart].items)){
    cart[currentCart].items?.forEach((item) => {
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

  // console.log(currentCart)
  // console.log("The Current Cart:",cart[currentCart])
  // console.log("The Current Cart ITEMS:",cart[currentCart].items)

  // let cartItems
  // if(Array.isArray(cart[currentCart].items)){
  // cartItems = cart[currentCart].items.map((item) =>{
  //   // {console.log("The individual items",item)}
  //   // {console.log("ID", item)}
  //   // let timeDate = item.created_at
  //   // let uniqueId = `${item.equipment_id}_${timeDate}`
  //   // console.log("The UNIQUE ID:", uniqueId)
  //   return(
  //     <CartItem 
  //     // key={uniqueId}
  //     equipment_image={item.equipment.equipment_image}
  //     make={item.equipment.make}
  //     model={item.equipment.model}
  //     dayOptions={dayOptions}
  //     rateOptions={rateOptions}
  //     selectedRate={selectedRate}
  //     setSelectedRate={setSelectedRate}
  //     dayRange={dayRange}
  //     setDayRange={setDayRange}
  //     rentalLength={rentalLength}
  //     setRentalLength={setRentalLength}
  //     equipmentQuantity={equipmentQuantity}
  //     setEquipmentQuantity={setEquipmentQuantity}
  //     />
  // )})}

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
      {/* {cart[currentCart].items?.length === 0 ? <div>Cart is empty or loading...</div> : fetchedCartItems} */}

      { cart ? cartData[currentCart].items.map((item) => (
        <CartItem 
        key={ `${item.equipment_id}_${item.created_at}`}
        equipment_image={item.equipment.equipment_image}
        make={item.equipment.make}
        model={item.equipment.model}
        dayOptions={dayOptions}
        rateOptions={rateOptions}
        selectedRate={item.rental_rate}
        setSelectedRate={setSelectedRate}
        dayRange={dayRange}
        setDayRange={setDayRange}
        rentalLength={item.rental_length}
        setRentalLength={setRentalLength}
        equipmentQuantity={item.equipment.quantity}
        setEquipmentQuantity={setEquipmentQuantity}
        />
      ))  
     : <p> Give me a second im loading over here...</p>}

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
            <p className="mb-1 text-lg font-bold">$134.98 USD</p>
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