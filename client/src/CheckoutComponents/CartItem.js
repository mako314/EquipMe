import React,{useContext, useEffect, useState} from "react";
import ApiUrlContext from '../Api'
import {toast} from 'react-toastify'

function CartItem({equipment_image, name, make, model, rateOptions, cartItemRate, cartItemRentalLength, cartItemQuantity, setIndividualTotal, hourlyRate, dailyRate, weeklyRate, promoRate, cartItemId, cartId, agreementStatus, costChange}){

  console.log("LOOKING FOR THE AGREEMENT STATUS:", agreementStatus)
  const apiUrl = useContext(ApiUrlContext)
  // console.log("whole Item:", wholeItem)
  // console.log("Rental cartItemRate:", cartItemRate)
  // A lot of props and state. Can  likely move in "day options"
  const [selectedRate, setSelectedRate] = useState(cartItemRate)

  const rateArray = [hourlyRate, dailyRate, weeklyRate, promoRate]

  const [dayRange, setDayRange] = useState('') //Can't set this to cartItemRate because this is hours, days, week. While cartItemRate is hourly, daily, weekly. 
  const [rentalLength, setRentalLength] = useState(cartItemRentalLength)
  const [equipmentQuantity, setEquipmentQuantity] = useState(cartItemQuantity)
  
  
  // console.log("THE WHOLE ITEM ",cartId)
  
  //Just basic day options, to track the amount of time they're trying to rent for
  const dayOptions = <>
  <option className="text-black"value="hours">Hours</option>
  <option className="text-black"value="days">Days</option>
  <option className="text-black"value="week">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

console.log("make:", make, "model:", model,"THE AGREEMENT STATUS:", agreementStatus)

// let testData
// console.log("TESTING DATA:", testData)

function checkAgreementStatus(agreementStatus) {
  if (agreementStatus === 'both-accepted' || agreementStatus === 'completed' || agreementStatus === 'in-progress') {
      const statusMessage = agreementStatus === 'both-accepted' ? 'Already Accepted' : 'Completed this Agreement'
      toast.warn(`🤝 Both Parties have ${statusMessage}, Unable to Edit this Item.`, {
          "autoClose": 2000
      })
      return true //  prevents further action
  }
  return false // Continue
}


const handleTotalChange = async (rateValue = 0, totalQuantity = equipmentQuantity, totalLength = rentalLength) => {
  
  if (checkAgreementStatus(agreementStatus)) {
    return
  }

  // console.log(agreement_status)
  // console.log('THE RENTAL LENGTH:', rentalLength)
  // console.log('THE RATE VALUE:', rateValue)
  // const rateValue = rateArray[e.target.options.selectedIndex]
  let currentRate = ''
  if (rateValue === 0){
    switch (selectedRate) {
        case "hourly":
            currentRate = hourlyRate
            break
        case "daily":
            currentRate = dailyRate
            break
        case "weekly":
            currentRate = weeklyRate
            break
        case "promo":
            currentRate = promoRate
            break
        default:
            break
    }
  }

  console.log("THE RATE VALUE:", rateValue)
  console.log("THE CURRENT RATE VALUE:", currentRate)
  
  console.log("THE UPDATED RATE:", costChange)

  console.log("PRICE CENTS IF CHANGED:", (currentRate || rateValue) * 100,)
  // console.log("THE TOTAL QUANTITY:", totalQuantity)
  // console.log("THE TOTAL LENGTH:", totalLength)

  //Calculate the total cost
  const newCost = ((rateValue ? rateValue : currentRate) * totalQuantity) * totalLength
  // (currentRate || rateValue) * 100
  console.log("RATE:", newCost)
  if(agreementStatus !== 'both-accepted'){
  const dataToSend = {
    price_cents_if_changed: (currentRate || rateValue) * 100,
    rental_rate : selectedRate,
    rental_length: rentalLength,
    // cart_item_id: cartItemId,
    quantity: equipmentQuantity,
    // agreement_status: agreementStatus,
  }

  console.log("THE DATA TO SEND:", dataToSend)

  try {
    const response = await fetch(`${apiUrl}cart/${cartId}/item/${cartItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      const updatedItem = await response.json()
      console.log("THE UPDATED CART ITEM:",updatedItem)
      
    } else {
      console.error('Failed to update cart item:', await response.text())
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}


  setIndividualTotal(prevTotals => {
  // Find the index of the item with the same id
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
  const index = prevTotals.findIndex(item => item.id === cartItemId)

  if (index !== -1) {
    // If found, update the cost of the existing item
    return prevTotals.map((item, idx) => 
      idx === index ? { ...item, cost: newCost } : item
    )
  } else {
    // If not found, add a new item
    return [...prevTotals, { id: cartItemId, cart_id: cartId,cost: newCost, agreement_status: agreementStatus}]
    // 
  }
})
}


  // Set a day range if cartItemRate exists, it should exist. This component will likely only be used inside of Cart. We'll see!
  useEffect(() => {
    // setSelectedRate(cartItemRate)
    if (cartItemRate === "hourly"){
      setDayRange("hours")
    } else if (cartItemRate === "daily"){
      setDayRange("days")
    } else if (cartItemRate === "weekly"){
      setDayRange("week")
    } else if (cartItemRate === "promo"){
      setDayRange("promo")
    }
    let currentRate = ''
    switch (selectedRate) {
        case "hourly":
            currentRate = hourlyRate
            break
        case "daily":
            currentRate = dailyRate
            break
        case "weekly":
            currentRate = weeklyRate
            break
        case "promo":
            currentRate = promoRate
            break
        default:
            break
    }

    // console.log( "THE NEW COST:", (currentRate * cartItemQuantity * cartItemRentalLength))
    const newCost = currentRate * cartItemQuantity * cartItemRentalLength
    console.log("THE CURRENT RATE:", currentRate)
    console.log("THE CURRENT QUANTITY:",cartItemQuantity )
    console.log("THE CURRENT CART ITEM RENTAL LENGTH:", cartItemRentalLength)
    // console.log("THE currentRate * cartItemQuantity:", currentRate * cartItemQuantity)
    console.log("THE NEW COST:", newCost)
    // handleTotalChange(currentRate, equipmentQuantity, rentalLength)
    setIndividualTotal(prevTotals => {
      // Find the index of the item with the same id
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
      const index = prevTotals.findIndex(item => item.id === cartItemId)
  
      if (index !== -1) {
        // If found, update the cost of the existing item
        return prevTotals.map((item, idx) => 
          idx === index ? { ...item, cost: newCost } : item
        )
      } else {
        // If not found, add a new item
        return [...prevTotals, { id: cartItemId, cart_id: cartId,cost: newCost, agreement_status: agreementStatus}]
      }
    })

  }, [])

  // console.log('THE RATE:',selectedRate)

  const handleRateChange = (e) => {
    if (checkAgreementStatus(agreementStatus)) {
      return
    }
    const newRate = e.target.value
    setSelectedRate(newRate)
    let newDayRange = ''
    switch (newRate) {
        case "hourly":
            newDayRange = "hours"
            break
        case "daily":
            newDayRange = "days"
            break
        case "weekly":
            newDayRange = "week"
            break
        case "promo":
            newDayRange = "promo"
            break
        default:
            break
    }
    setDayRange(newDayRange)

    // console.log("THE NEW RATE:", rateArray)

    //E.target.options.selected index finds the index of the selected option. I made an array with the values of the equipment cost

    const rateValue = rateArray[e.target.options.selectedIndex]

    handleTotalChange(rateValue)
}


  // console.log('THE DAY RANGE:', dayRange)
  //Concide rental length (dayRange) with rate
  const handleDayRangeChange = (e) => {
      if (checkAgreementStatus(agreementStatus)) {
    return
  }
    const newDayRange = e.target.value
    setDayRange(newDayRange)

    let newSelectedRate = ''
    switch (newDayRange) {
        case "hours":
            newSelectedRate = "hourly"
            break
        case "days":
            newSelectedRate = "daily"
            break
        case "week":
            newSelectedRate = "weekly"
            break
        case "promo":
            newSelectedRate = "promo"
            break
        default:
            break
    }
    setSelectedRate(newSelectedRate)

    const rateValue = rateArray[e.target.options.selectedIndex]

    handleTotalChange(rateValue)
}

  const handleRentalLength = (e) =>{
  if (checkAgreementStatus(agreementStatus)) {
    return
  }
    // setRentalLength(parseInt(e.target.value, 10))
    const newLength = parseInt(e.target.value, 10)

    setRentalLength(newLength)

    handleTotalChange(undefined, undefined, newLength)
  }

  

  const handleEquipmentQuantity = (e) =>{
  if (checkAgreementStatus(agreementStatus)) {
    return
  }
    // setRentalLength(parseInt(e.target.value, 10))
    const newQuantity = parseInt(e.target.value, 10)

    setEquipmentQuantity(newQuantity)

    handleTotalChange(undefined, newQuantity, undefined)
  }

    //----------------------
    // -1 on quantity
    // Needed to set a new quantity to pass into handleTotal change for both of these functions, that way it can account for the new quantity and multiply it when the buttons are clicked to + or - 1 
    const decrementQuantity = () => {
      if (checkAgreementStatus(agreementStatus)) {
        return
      }
      setEquipmentQuantity(prevequipmentQuantity => { 
        const newQuantity = prevequipmentQuantity > 1 ? prevequipmentQuantity - 1 : 1
        handleTotalChange(undefined, newQuantity, undefined)
        return newQuantity
        })
    }

    // +1 on quantity 
    const incrementQuantity = () => {
      if (checkAgreementStatus(agreementStatus)) {
        return
      }
      setEquipmentQuantity(prevequipmentQuantity => {
        const newQuantity = prevequipmentQuantity + 1
        handleTotalChange(undefined, newQuantity, undefined)
        return newQuantity
      })
    }

    return(
      <div className="space-y-6 overflow-y-auto max-h-96">

          {/* Grab this for the map */}
          <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
              {/* Image Preview */}
              <img src={equipment_image} alt="product-image" className="w-full rounded-lg sm:w-40" />

              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  {/* Product Details */}
                  <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">{make} {name}</h2>
                      {/* Additional details like size or color can go here */}
                      <p className="mt-1 text-xs text-gray-700">{model}</p>
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
                                onChange={handleEquipmentQuantity}
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
                                onChange={handleRentalLength}
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
    )
}

export default CartItem


  // //Concide rate with rental length (dayRange)
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