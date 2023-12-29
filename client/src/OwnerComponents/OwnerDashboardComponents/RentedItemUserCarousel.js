import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function RentedItemUserCarousel({currentUser, setFromOwnerDash, role}) {

const [currentIndex, setCurrentIndex] = useState(0)
console.log("CAROUSEL:",currentUser)
const navigate = useNavigate()


let userAgreementsForDateSorting = []

const flatMappedUserAgreement = currentUser?.cart?.flatMap(item => {
  console.log('FULL ITEM:', item) 
  return item.cart_item?.map(cartItem  => {
      console.log('Cart Item:', cartItem) 
      return cartItem.agreements.map(agreement => { 
          console.log('Agreement:', agreement)
          if(agreement.agreement_status === "in-progress"){
      return {
          id : agreement.id,
          agreement_status: agreement.agreement_status,
          rental_start_date: agreement.rental_start_date,
          rental_end_date: agreement.rental_end_date,
          equipment_make: cartItem?.equipment.make,
          equipment_model: cartItem?.equipment.make,
          rental_quantity: cartItem?.quantity,
          cart_total: item.total,
          ownerFirstName: cartItem?.equipment.owner?.firstName,
          ownerLastName:  cartItem?.equipment.owner?.lastName,
          ownerFirstName: cartItem?.equipment.owner?.email,
          ownerLastName:  cartItem?.equipment.owner?.phone,
      }}
      })
  })
}) || []

userAgreementsForDateSorting = flatMappedUserAgreement.flatMap(item => item)

console.log("THE DATA YOU'RE LOOKING FOR:", userAgreementsForDateSorting)

{/* 
to make the #'s pretty
<span className="text-lg font-semibold text-green-600">${totalRevenuePerMonth.toFixed(2)}</span> */}

const handleEquipmentNavigation = (equipmentId) => {
  setFromOwnerDash(true)
  // Use setTimeout to allow state update before navigation
  setTimeout(() => {
    navigate(`/equipment/${equipmentId}`)
  }, 0)
}

//Just did something similar as to when I had the review submission stars, but instead I'm pushing an object into carouselItems, the image has an image element 
let carouselItems = []


userAgreementsForDateSorting.map((equipment) => {
    carouselItems.push({
    name: `${equipment?.make} ${equipment?.model}`,
    image: <img
          key={equipment?.make +' '+ equipment?.model + '' + equipment?.id} 
          className="w-[350px] h-[250px] object-fill rounded-lg"
          src={equipment?.equipment_image}
          alt={equipment?.make +' '+ equipment?.model}
          onClick={() => handleEquipmentNavigation(equipment?.id)}
        />}
    )
})
  
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

  return (
    <>
    <h2 className="text-lg font-medium text-center mb-2 bg-gray-100 rounded-lg shadow-lg ">{role ==='owner' ? 'User Favorites' : 'Your Favorites' }</h2>
    <div className="flex-grow overflow-hidden w-full flex items-center justify-center bg-gray-100 rounded-lg shadow-lg pt-4"> {/* Container for the image */}
      {carouselItems[currentIndex]?.image}
    </div>
    <div className="flex justify-between items-center w-full pt-4 px-4 bg-gray-100 rounded-lg shadow-lg py-2"> {/* Container for the buttons and description */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow"
        onClick={goToPrevious}
      >
        Previous
      </button>
      <div className="text-center truncate px-4 py-1 bg-white rounded-lg shadow"> {/* Container for the image description */}
        {carouselItems[currentIndex]?.name}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow"
        onClick={goToNext}
      >
        Next
      </button>
    </div>
  </>
  )
}

export default RentedItemUserCarousel