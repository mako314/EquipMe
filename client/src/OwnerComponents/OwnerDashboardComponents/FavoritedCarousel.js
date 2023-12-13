import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function FavoriteCarousel({currentUser, setFromOwnerDash}) {

const [currentIndex, setCurrentIndex] = useState(0)
// console.log("CAROUSEL:",currentUser)
const navigate = useNavigate()

const handleEquipmentNavigation = (equipmentId) => {
  setFromOwnerDash(true)
  // Use setTimeout to allow state update before navigation
  setTimeout(() => {
    navigate(`/equipment/${equipmentId}`)
  }, 0)
}

//Just did something similar as to when I had the review submission stars, but instead I'm pushing an object into carouselItems, the image has an image element 
let carouselItems = []
currentUser?.equipment?.map((equipment) => {
  if(equipment?.user_favorite.length > 0){
    carouselItems.push({
    equipmentName: `${equipment?.make} ${equipment?.model}`,
    image: <img
          key={equipment?.make +' '+ equipment?.model + '' + equipment?.id} 
          className="w-[350px] h-[250px] object-fill rounded-lg"
          src={equipment?.equipment_image}
          alt={equipment?.make +' '+ equipment?.model}
          onClick={() => handleEquipmentNavigation(equipment?.id)}
        />}
        )
  }
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
    <h2 className="text-lg font-medium text-center mb-2 bg-gray-100 rounded-lg shadow-lg ">User Favorites</h2>
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
        {carouselItems[currentIndex]?.equipmentName}
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

export default FavoriteCarousel