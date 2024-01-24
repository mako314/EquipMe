import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function RentedItemUserCarousel({currentUser, setFromOwnerDash, role}) {

const [currentIndex, setCurrentIndex] = useState(0)
// console.log("CAROUSEL:",currentUser)
const navigate = useNavigate()


let userAgreementsForDateSorting = []

// I need to adjust what the 'in-progress' agreement_status entails

const flatMappedUserAgreement = currentUser?.cart?.flatMap(item => {
  return item.cart_item?.flatMap(cartItem => {
    return cartItem.agreements
      .filter(agreement => agreement.agreement_status === "completed") // Filter first, forgot and tried to just do an if, but why use an if when you can filter
      .map(agreement => { 
        // Then map
        // console.log('Agreement:', agreement)
        return {
          id: agreement.id,
          agreement_status: agreement.agreement_status,
          rental_start_date: agreement.rental_start_date,
          rental_end_date: agreement.rental_end_date,
          equipment_make: cartItem?.equipment.make,
          equipment_model: cartItem?.equipment.model,
          equipment_image: cartItem?.equipment.equipment_image,
          rental_quantity: cartItem?.quantity,
          cart_total: (item.total) / 100,
          ownerFirstName: cartItem?.equipment.owner?.firstName,
          ownerLastName: cartItem?.equipment.owner?.lastName,
          ownerEmail: cartItem?.equipment.owner?.email, 
          ownerPhone: cartItem?.equipment.owner?.phone,
        }
      })
  })
}) || []

userAgreementsForDateSorting = flatMappedUserAgreement.flatMap(item => item)

// console.log("THE DATA YOU'RE LOOKING FOR:", userAgreementsForDateSorting)

{/* 
to make the #'s pretty
<span className="text-lg font-semibold text-green-600">${totalRevenuePerMonth.toFixed(2)}</span> */}

const handleRentalAgreementNavigation = (rentalId) => {
  setFromOwnerDash(true)
  // Use setTimeout to allow state update before navigation
  setTimeout(() => {
    navigate(`/handle/agreements/${rentalId}`)
  }, 0)
}

//Just did something similar as to when I had the review submission stars, but instead I'm pushing an object into carouselItems, the image has an image element 
let carouselItems = []


userAgreementsForDateSorting.forEach((equipment) => {
    // console.log("THE EQUIPMENT:", equipment)
    carouselItems.push({
    name: `${equipment?.equipment_make} ${equipment?.equipment_model}`,
    duration: `${equipment?.rental_start_date} to ${equipment?.rental_end_date}`,
    ownerEmail: `${equipment.ownerEmail}`,
    ownerPhone: `${equipment.ownerPhone}`,
    quantityRented: `${equipment.rental_quantity}`,
    amountTotal: `${equipment.cart_total}`,
    image: <img
          key={equipment?.equipment_make +' '+ equipment?.equipment_model + '' + equipment?.id} 
          className="w-[350px] h-[250px] object-fill rounded-lg"
          src={equipment?.equipment_image}
          alt={equipment?.equipment_make +' '+ equipment?.equipment_model}
          onClick={() => handleRentalAgreementNavigation(equipment?.id)}
        />}
    )
})

// console.log(carouselItems)
  
  // Rather simple previous and next functions. Sets a variable to 0 to test if it's the first item in the array, from then it either adds one or removes one depending on whether or not which is being called.
  const goToPrevious = () => {
    const isFirstItem = currentIndex === 0
    const newIndex = isFirstItem ? carouselItems.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastItem = currentIndex === carouselItems.length - 1
    const newIndex = isLastItem ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  if (userAgreementsForDateSorting.length === 0){
    return(
      <div className="flex items-center justify-center h-full text-center text-gray-800">
       <p className="text-lg font-medium">You haven't rented any Equipment yet, you can use this area later to track those! </p>
      </div>
    )
  }

  return (
      <>
        <h2 className="text-lg font-medium text-center mb-2 bg-gray-100 rounded-lg shadow-lg p-2">
          Your Current Rentals
        </h2>
        <div className="flex w-full bg-gray-100 rounded-lg shadow-lg p-2 items-center"> {/* Container for the image and details */}
          <div className="w-1/2 p-4"> {/* Container for the image */}
            {carouselItems[currentIndex]?.image}
          </div>
          <div className="w-1/2 p-4 flex flex-col justify-between"> {/* Container for the details and buttons */}
            <div>
              <p className="text-lg font-semibold">
                {carouselItems[currentIndex]?.name}
              </p>
              <p className="text-sm">
                Quantity: {carouselItems[currentIndex]?.quantityRented}
              </p>
              <p className="text-sm">
                Total Cost: {carouselItems[currentIndex]?.amountTotal}
              </p>
              <p className="text-sm">
                {carouselItems[currentIndex]?.duration}
              </p>
              <p className="text-sm">
                Owner Phone: {carouselItems[currentIndex]?.ownerPhone}
              </p>
              <p className="text-sm mb-4">
                Owner Email: {carouselItems[currentIndex]?.ownerEmail}
              </p>
            </div>
            <div className="flex justify-start space-x-4 mt-4"> {/* Adjusted Button container */}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 ease-in-out"
                onClick={goToPrevious}
              >
                Previous
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 ease-in-out"
                onClick={goToNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
  )
}

export default RentedItemUserCarousel