import React,{useContext, useEffect, useState, Fragment} from "react";
import CartItem from "./CartItem";
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'

function Cart(){
  const [currentCart, setCurrentCart] = useState(0)
  // const [selectedRate, setSelectedRate] = useState('')
  // const [dayRange, setDayRange] = useState('')
  // const [rentalLength, setRentalLength] = useState(1)
  // const [equipmentQuantity, setEquipmentQuantity] = useState(1)
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

  const handleCartChange = (e) => {
    setCurrentCart(e.target.value)
  }

  let cart
  if (user){
    cart  = user?.cart
  }

  // //----------------------
  // // -1 on quantity
  // const decrementQuantity = () => {
  //   setEquipmentQuantity((prevequipmentQuantity) => (prevequipmentQuantity > 1 ? prevequipmentQuantity - 1 : 1))
  // }

  // // +1 on quantity 
  // const incrementQuantity = () => {
  //   setEquipmentQuantity(prevequipmentQuantity => prevequipmentQuantity + 1)
  // }


  //Concide rate with rental length (dayRange)
  // const handleRateChange = (e) => {
  //   const newRate = e.target.value
  //   setSelectedRate(newRate)
  //   if (newRate === "hourly"){
  //     setDayRange("hours")
  //   } else if (newRate === "daily"){
  //     setDayRange("days")
  //   } else if (newRate === "weekly"){
  //     setDayRange("week")
  //   } else if (newRate === "promo"){
  //     setDayRange("promo")
  //   }
  // }

  // //Concide rental length (dayRange) with rate
  // const handleDayRangeChange = (e) => {
  //   const newDayRange = e.target.value
  //   setDayRange(newDayRange)
  //   if (newDayRange === "hours"){
  //     setSelectedRate("hourly")
  //   } else if (newDayRange === "days"){
  //     setSelectedRate("daily")
  //   } else if (newDayRange === "week"){
  //     setSelectedRate("weekly")
  //   } else if (newDayRange === "promo"){
  //     setSelectedRate("promo")
  //   }
  // }

  //-------------------------------------
  //Just basic day options, to track the amount of time they're trying to rent for
  const dayOptions = <>
  <option className="text-black"value="hours">Hours</option>
  <option className="text-black"value="days">Days</option>
  <option className="text-black"value="week">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

  const cartOptions = cart?.map((item) => {
    return (
    <Fragment key={`${item.id} ${item.cart_name}`}>
    <option className="text-black" value={item.id - 1}>{item.cart_name}</option> 
    </Fragment>)
  })

  if (!cart || cart?.length === 0) {
    return <div>Cart is empty or loading...</div>;
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

  let cartItems
  if(Array.isArray(cart[currentCart].items)){
  cartItems = cart[currentCart].items.map((item) =>{
    // {console.log("The individual items",item)}
    // {console.log("ID", item)}
    let timeDate = item.created_at
    let uniqueId = `${item.equipment_id}_${timeDate}`
    console.log("The UNIQUE ID:", uniqueId)
    return(
      <CartItem 
      key={uniqueId}
      equipment_image={item.equipment.equipment_image}
      make={item.equipment.make}
      model={item.equipment.model}
      dayOptions={dayOptions}
      rateOptions={rateOptions}
      />
  )})}

  

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
            <option className="text-black"value="2"> Test 2</option>
      </select>

      {cartItems}

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