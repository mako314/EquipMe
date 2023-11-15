import React,{useContext, useEffect, useState} from "react";
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

  console.log(user)

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
    return <>
    <option className="text-black"value={item.id - 1}>{item.cart_name}</option> 
    </>
  })

  if (!cart || cart?.length === 0) {
    return <div>Cart is empty or loading...</div>;
  }

  //Map over equipment price, and take the rates as options
  let rateOptions
  if(Array.isArray(cart[currentCart].items)){
    cart[currentCart].items?.forEach((item) => {
      if (Array.isArray(item.equipment.equipment_price)) {
        item.equipment.equipment_price?.map((price) =>{
          rateOptions = 
            <>
            <option className="text-black"value="hourly">Hourly Rate: ${price.hourly_rate/100}</option>
            <option className="text-black"value="daily">Daily Rate: ${price.daily_rate/100}</option>
            <option className="text-black"value="weekly">Weekly Rate: ${price.weekly_rate/100}</option>
            <option className="text-black"value="promo">Promo Rate: ${price.promo_rate/100}</option>
            </>
        })
      }
    })
  }

  // console.log(currentCart)
  // console.log("The Current Cart:",cart[currentCart])
  // console.log("The Current Cart ITEMS:",cart[currentCart].items)

  let cartItems
  if(Array.isArray(cart[currentCart].items)){
  cartItems = cart[currentCart].items.map((item, index) =>{
    // {console.log("The individual items",item)}
    {console.log("ID", item)}

    return(
      <CartItem 
      key={`${item.equipment_id}_${item.rental_length}_${item.quantity}_${index}`}
      equipment_image={item.equipment.equipment_image}
      make={item.equipment.make}
      model={item.equipment.model}
      dayOptions={dayOptions}
      rateOptions={rateOptions}
      />
  // <div className="space-y-6 overflow-y-auto max-h-96">

  //         {/* Grab this for the map */}
  //         <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
  //             {/* Image Preview */}
  //             <img src={item.equipment.equipment_image} alt="product-image" className="w-full rounded-lg sm:w-40" />

  //             <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
  //                 {/* Product Details */}
  //                 <div className="mt-5 sm:mt-0">
  //                     <h2 className="text-lg font-bold text-gray-900">{item.equipment.make}</h2>
  //                     {/* Additional details like size or color can go here */}
  //                     <p className="mt-1 text-xs text-gray-700">{item.equipment.model}</p>
  //                 </div>

  //                 {/* Quantity and Price */}
  //                 <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
  //                     <div className="flex items-center justify-end space-x-2">
  //                         {/* Quantity Adjustment */}
  //                         <span className='text-black'> Quantity </span>
  //                         <span
  //                             className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-white"
  //                             onClick={decrementQuantity}
  //                         >
  //                             -
  //                         </span>
  //                         <input 
  //                               className="h-8 w-8 border border-black bg-white text-black text-center text-xs outline-none"
  //                               type="number"
  //                               value={equipmentQuantity}
  //                               onChange={(e) => setEquipmentQuantity(parseInt(e.target.value, 10))}
  //                               min="1" />
  //                         <span
  //                           className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
  //                           onClick={incrementQuantity}
  //                       >
  //                           +
  //                       </span>
  //                     </div>

  //                     <div className="flex items-center justify-end space-x-2">
  //                         {/* Price */}
  //                         <input 
  //                               className="h-8 w-8 border border-black bg-white text-black text-center text-xs outline-none"
  //                               type="number"
  //                               value={rentalLength}
  //                               onChange={(e) => setRentalLength(parseInt(e.target.value, 10))}
  //                               min="1" />
  //                         <select
  //                         className="border-2 border-black text-sm text-black"
  //                         value={dayRange} 
  //                         onChange={handleDayRangeChange}>
  //                         {dayOptions}
  //                         </select>
  //                     </div>

  //                     <div className="flex items-center justify-end space-x-2">
  //                         {/* Price */}
  //                         <select
  //                         className="border-2 border-black text-sm text-black"
  //                         value={selectedRate} 
  //                         onChange={handleRateChange}>
  //                         {rateOptions}
  //                         </select>
  //                     </div>

                      
  //                 </div>
  //             </div>
  //         </div>
          
  //         {/* Grab this for the map */}

  //       </div>

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