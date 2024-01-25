import React,{useContext, useEffect, useState} from "react";
import ApiUrlContext from '../Api'
import { UserSessionContext } from "../UserComponents/SessionContext";
import {toast} from 'react-toastify'

function CartItem({equipment_image, name, make, model, rateOptions, cartItemRate, cartItemRentalLength, cartItemQuantity, setIndividualTotal, hourlyRate, dailyRate, weeklyRate, promoRate, cartItemId, cartId, agreementStatus, costChange, handleItemCheck, proceedToCheckout, setFilteredCartItems, filteredCartItems, onItemDeleted}){

  // console.log("LOOKING FOR THE AGREEMENT STATUS:", agreementStatus)
  const apiUrl = useContext(ApiUrlContext)
  // console.log("whole Item:", wholeItem)
  // console.log("Rental cartItemRate:", cartItemRate)
  // A lot of props and state. Can  likely move in "day options"
  // The below holds the actual time (daily, hourly, weekly, etc)
  const [selectedRate, setSelectedRate] = useState(cartItemRate)
  const rateArray = [hourlyRate, dailyRate, weeklyRate, promoRate]
  // This holds the # of days, so not the actual rate of time as expected (meaning, daily, hourly, weekly , etc)
  const [dayRange, setDayRange] = useState('') //Can't set this to cartItemRate because this is hours, days, week. While cartItemRate is hourly, daily, weekly. 
  const [rentalLength, setRentalLength] = useState(cartItemRentalLength)
  const [equipmentQuantity, setEquipmentQuantity] = useState(cartItemQuantity)

  const [toggleDelete, setToggleDelete] = useState(false)

  // console.log("The whole item:", wholeItem)
  
  
  // console.log("THE WHOLE ITEM ",cartId)
  
  //Just basic day options, to track the amount of time they're trying to rent for
  const dayOptions = <>
  <option className="text-black"value="hours">Hours</option>
  <option className="text-black"value="days">Days</option>
  <option className="text-black"value="week">Weeks</option>
  <option className="text-black"value="promo">Promo</option>
  </>

// console.log("make:", make, "model:", model,"THE AGREEMENT STATUS:", agreementStatus)

// let testData
// console.log("TESTING DATA:", testData)

// Checks the agreement status of the cart item before allowing any changes to be made. If something is in-progress, completed, or both parties have accepted, you cannot do anything to it. I.E adjust price, rental length, quantity.
function checkAgreementStatus(agreementStatus) {
  if (agreementStatus === 'both-accepted' || agreementStatus === 'completed') {
      const statusMessage = agreementStatus === 'both-accepted' ? 'Already Accepted' : 'Completed this Agreement'
      toast.warn(`🤝 Both Parties have ${statusMessage}, Unable to Edit this Item.`, {
          "autoClose": 2000
      })
      return true //  prevents further action
  }
  return false // Continue
}

function checkBothAgreedStatus(agreementStatus) {
  return agreementStatus === 'both-accepted'
}

// Need to check this with regular variables and send a request off (regular meaning total, total length, etc)
// This handles calculating the total cost (and sending it to the backend to update there)
// It takes into account the rate value, total quantity, and totallength of a rental. There are some checks. For example it takes the selectedRate (THIS IS KIND OF THE COST BUT NOT REALLY, IT'S MORE LIKE WEEKLY/DAILY/HOURLY,) and uses the props (actual monetary values $) to give a value to the current rate. This also only happens if there is NO change to the rateValue and it comes in as the defaulted 0.
// newRateLength is the length of the darn rental, daily, weekly, hourly, etc

//Foolishly since I have longer coding sessions, I was trying to use existing values cartItemRentalLength, cartItemQuantity, which I initially set my state too in the math for the new cost. Instead of implementing the new parameters I passed totalQuantity and totalLength in, but never really accessed them. I've gone ahead and implemented them here for the fix.

const handleTotalChange = async (rateValue = 0, totalQuantity = equipmentQuantity, totalLength = rentalLength, newRateLength = selectedRate) => {
  
  if (checkAgreementStatus(agreementStatus)) {
    return
  }

  // console.log(agreement_status)
  // console.log('THE RENTAL LENGTH:', rentalLength)
  // console.log('THE RATE VALUE:', rateValue)
  // const rateValue = rateArray[e.target.options.selectedIndex]
  let currentRate = 0
  if (rateValue === 0){
    switch (newRateLength) {
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

  const rateForCalculation = currentRate > 0 ? currentRate : rateValue

  // console.log("THE RATE VALUE:", rateValue)
  // console.log("THE CURRENT RATE VALUE:", currentRate)
  // console.log("THE UPDATED RATE:", costChange)
  // console.log("PRICE CENTS IF CHANGED:", (currentRate || rateValue) * 100,)

  // console.log("THE PRE-EXISTING QUANTITY:", equipmentQuantity)
  // console.log("THE PRE-EXISTING LENGTH:", rentalLength)
  // console.log("THE TOTAL QUANTITY:", totalQuantity)
  // console.log("THE TOTAL LENGTH:", totalLength)
  // console.log("WHAT THE NEW RATE SHOULD BE: INSIDE THE SEND", newRateLength)


  //Calculate the total cost
  // const newCost = ((rateValue ? rateValue : currentRate) * totalQuantity) * totalLength
  const newCostRounded = parseFloat((rateForCalculation * totalQuantity * totalLength).toFixed(2))

  // console.log("THE CURRENT RATE VALUE:", currentRate, "THE TOTAL QUANTITY:", totalQuantity, "THE TOTAL LENGTH:", totalLength, "THE NEW COST ROUNDED:", newCostRounded)

  // (currentRate || rateValue) * 100
  // console.log("RATE:", newCost)
  if(agreementStatus !== 'both-accepted'){
  const dataToSend = {
    price_cents_if_changed: rateForCalculation * 100,
    rental_rate : newRateLength,
    rental_length: totalLength,
    // cart_item_id: cartItemId,
    quantity: totalQuantity,
    // agreement_status: agreementStatus,
  }

  // console.log("THE DATA TO SEND:", dataToSend)

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
      // console.log("THE UPDATED CART ITEM:",updatedItem)
      
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
      idx === index ? { ...item, cost: newCostRounded } : item
    )
  } else {
    // If not found, add a new item
    return [...prevTotals, { id: cartItemId, cart_id: cartId,cost: newCostRounded, agreement_status: agreementStatus}]
    // 
  }
})
}


  // Set a day range if cartItemRate exists, it should exist. This component will likely only be used inside of Cart. We'll see!
  useEffect(() => {
    // setSelectedRate(currentRate)
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
    // const newCost = currentRate * cartItemQuantity * cartItemRentalLength
    
    const newCostRounded = parseFloat((currentRate * cartItemQuantity * cartItemRentalLength).toFixed(2))
    // console.log("THE TYPE OF newCostRounded:", typeof(newCostRounded))

    // console.log("THE NEW COST ROUNDED:", newCostRounded)
    // console.log("THE CURRENT RATE:", currentRate)
    // console.log("THE CURRENT QUANTITY:",cartItemQuantity )
    // console.log("THE CURRENT CART ITEM RENTAL LENGTH:", cartItemRentalLength)
    // console.log("THE currentRate * cartItemQuantity:", currentRate * cartItemQuantity)
    // console.log("THE NEW COST:", newCost)

    // handleTotalChange(currentRate, equipmentQuantity, rentalLength) basically accounting for the total cost the individual cart item
    setIndividualTotal(prevTotals => {
      // Find the index of the item with the same id
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
      const index = prevTotals.findIndex(item => item.id === cartItemId)
  
      if (index !== -1) {
        // If found, update the cost of the existing item
        return prevTotals.map((item, idx) => 
          idx === index ? { ...item, cost: newCostRounded } : item
        )
      } else {
        // If not found, add a new item
        return [...prevTotals, { id: cartItemId, cart_id: cartId,cost: newCostRounded, agreement_status: agreementStatus}]
      }
    })

    // console.log("I'VE RAN INSIDE THE USE EFFECT")

  }, [])

  // console.log('THE RATE:',selectedRate)
  // Handles the rate change, The below holds the actual time (daily, hourly, weekly, etc)
  // console.log("WHAT THE NEW RATE SHOULD BE: ABOVE HANDLE RATE CHANGE", selectedRate)
  const handleRateChange = (e) => {
    if (checkAgreementStatus(agreementStatus)) {
      return
    }
    const newRate = e.target.value
    // console.log("WHAT THE NEW RATE SHOULD BE: E.TARGET.VALUE", e.target.value)
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
    // console.log("THE NEW RATE SELECTED INDEX IN HANDLE RATE CHANGE:", rateValue)

    // Ideally I'm only sending in rateValue, because i'm just calculating the new cost, if there's been a change in the rate, I made a rateArray that holds the same amount of indexes as the rates.

    // so if rateArray holds [$1, $2, $3, $4]
    // The e.target.options.selctedIndex has 4 options to choose from here: 
    // Hourly, daily, weekly, promo
    // Where they all coincide with the rateArray
    // console.log("THE NEW RATE BEING SENT IN:", newRate)
    // Due to the asynchrous nature of state, my fetch was sending off the older state, instead I had to implement another parameter, and send in the newRate to accurately capture the rental rate (daily, hourly, weekly, etc)
    handleTotalChange(rateValue, undefined, undefined, newRate)
}


  // console.log('THE DAY RANGE:', dayRange)
  //Concide rental length (dayRange) with rate, this is just the hours days, weeks, etc.
  // console.log("THE DAY RANGE:", dayRange)
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
    // console.log("THE NEW RATE SELECTED INDEX IN HANDLE DAY RANGE CHANGE:", rateValue)
    // Due to the asynchrous nature of state, my fetch was sending off the older state, instead I had to implement another parameter, and send in the newRate to accurately capture the rental rate (daily, hourly, weekly, etc)

    // Since I could've had better naming conventions likely, day range is capturing the "x hours, days, weeks, promo <- words here."
    // Not the actual quantity, but I match the words with a switch statement to know what the new selected rate should be and set it to that. I can also just pass that new variable of the selected rate as my 4th parameter!

    handleTotalChange(rateValue, undefined, undefined, newSelectedRate)
}

  const handleRentalLength = (e) =>{
  if (checkAgreementStatus(agreementStatus)) {
    return
  }
    // setRentalLength(parseInt(e.target.value, 10))
    const newLength = parseInt(e.target.value, 10)

    setRentalLength(newLength)

    handleTotalChange(undefined, undefined, newLength, undefined)
  }

  

  const handleEquipmentQuantity = (e) =>{
  if (checkAgreementStatus(agreementStatus)) {
    return
  }
    // setRentalLength(parseInt(e.target.value, 10))
    const newQuantity = parseInt(e.target.value, 10)

    setEquipmentQuantity(newQuantity)

    handleTotalChange(undefined, newQuantity, undefined, undefined)
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
        handleTotalChange(undefined, newQuantity, undefined, undefined)
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
        handleTotalChange(undefined, newQuantity, undefined, undefined)
        return newQuantity
      })

    }

    // A prop passed down from the Cart component that assigns a checked flag to the items after mapping over filtered items. 
    // From there a user can go and select certain items to checkout and leave the rest without checking out
    const handleConfirmCheckout = (e) => {
      if (checkBothAgreedStatus(agreementStatus)) {
        const isChecked = e.target.checked

        setIndividualTotal(prevTotals => {
          // Find the index of the item with the same id
          const index = prevTotals.findIndex(item => item.id === cartItemId)
    
          // Update the isChecked status of the existing item
          return prevTotals.map((item, idx) => 
            idx === index ? { ...item, isChecked: isChecked } : item
          )
        })

        handleItemCheck(cartItemId, isChecked)
      }
    }


    // Delete a cart item
    const handleDeleteCartItem = async (cartItemId) => {
      try {
        const response = await fetch(`${apiUrl}cart/item/${cartItemId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Filter out the deleted item
          const updatedCartItems = filteredCartItems.filter(item => item.id !== cartItemId)
          setFilteredCartItems(updatedCartItems)
          onItemDeleted(cartItemId)

        } else {
          // console.log("Error in deleting the cart item")
          toast.error(`Error in deleting the cart item`,
          {
            "autoClose" : 2000
          })
        }
      } catch (error) {
        console.error('Fetch Error:', error)
        toast.error(`Error in deleting the cart item: ${error}`,
          {
            "autoClose" : 2000
          })
        // Handle fetch errors
      }
    }

    // Toggle for delete button
    const handleToggleDelete = () => {
      setToggleDelete(!toggleDelete)
    }


    return(
      <div className="space-y-6 overflow-y-auto max-h-96">

          {/* Grab this for the map */}
          <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
              {/* Image Preview */}
              <img src={equipment_image} alt="product-image" className="w-full rounded-lg sm:w-40 object-contain" />

              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  {/* Product Details */}
                  <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">{make} {name}</h2>
                      {/* Additional details like size or color can go here */}
                      <p className="mt-1 text-xs text-gray-700">{model}</p>
                  </div>

                  {/* Quantity and Price */}
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">


                  {/* DELETE BUTTON IT'S AN SVG X */}
                  <div className="flex justify-end">
                  <button
                    onClick={handleToggleDelete}
                    className="ml-4" 
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                  </button>

                  {toggleDelete && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 overflow-y-auto h-full w-full" onClick={() => setToggleDelete(false)}>
        <div className="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Are you sure you want to delete this item?</h3>
            <p className="mt-4 mb-6 text-red-600">Warning: Deleting this cart item will also delete any associated rental agreement.</p>
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={() => handleDeleteCartItem(cartItemId)}
                    className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
                >
                    Yes, Remove This Item and Its Rental Agreement.
                </button>
                <button
                    onClick={handleToggleDelete}
                    className="rounded bg-gray-500 py-2 px-4 text-white hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}


                  </div>
                  {/* DELETE BUTTON IT'S AN SVG X */}





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
                    {checkBothAgreedStatus(agreementStatus) && 
                    <div className="mt-4 flex items-center sm:mt-0 sm:ml-4">
                    <input
                        type="checkbox"
                        id={`confirmCheckout-${cartItemId}`}
                        checked={proceedToCheckout}
                        onChange={handleConfirmCheckout}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="confirmCheckout" className="ml-2 text-sm font-medium text-gray-700">
                        Confirm Checkout
                    </label>
                    </div>}

                  </div>
              </div>
          </div>
          
          {/* Grab this for the map */}

        </div>
    )
}

export default CartItem