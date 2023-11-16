import React,{useContext, useEffect, useState} from "react";
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'

function CartItem({equipment_image, make, model, dayOptions, rateOptions, selectedRate, setSelectedRate, dayRange, setDayRange, rentalLength, setRentalLength, equipmentQuantity, setEquipmentQuantity}){

  // const [selectedRate, setSelectedRate] = useState('')
  // const [dayRange, setDayRange] = useState('')
  // const [rentalLength, setRentalLength] = useState(1)
  // const [equipmentQuantity, setEquipmentQuantity] = useState(1)

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

    //----------------------
    // -1 on quantity
    const decrementQuantity = () => {
      setEquipmentQuantity((prevequipmentQuantity) => (prevequipmentQuantity > 1 ? prevequipmentQuantity - 1 : 1))
    }

    // +1 on quantity 
    const incrementQuantity = () => {
      setEquipmentQuantity(prevequipmentQuantity => prevequipmentQuantity + 1)
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
                      <h2 className="text-lg font-bold text-gray-900">{make}</h2>
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
    )
}

export default CartItem