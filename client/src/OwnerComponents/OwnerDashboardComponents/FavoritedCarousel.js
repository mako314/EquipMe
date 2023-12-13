import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function FavoriteCarousel({currentUser, setFromOwnerDash}) {
console.log("CAROUSEL:",currentUser)
const navigate = useNavigate()

const handleEquipmentNavigation = (equipmentId) => {
  setFromOwnerDash(true)
  // Use setTimeout to allow state update before navigation
  setTimeout(() => {
    navigate(`/equipment/${equipmentId}`)
  }, 0)
}

let carouselItems = []
currentUser?.equipment?.map((equipment) => {
  if(equipment?.user_favorite){
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

console.log(carouselItems)



// const carouselItems = [
//     {
//         src: '/images/image1.jpg',
//         alt: 'First Image',
//     },
//     {
//         src: '/images/image2.jpg',
//         alt: 'Second Image',
//     },
//     // Add more images as needed
//     ]

  const [currentIndex, setCurrentIndex] = useState(0)

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
        <h2 className="text-lg font-medium text-center mb-2">User Favorites</h2>
        <div className="flex-grow overflow-hidden w-full flex items-center justify-center"> {/* Container for the image */}
          {carouselItems[currentIndex]?.image}
        </div>
        <div className="flex justify-between items-center w-full pt-4"> {/* Container for the buttons and description */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            onClick={goToPrevious}
          >
            Previous
          </button>
          <div className="text-center truncate px-4"> {/* Container for the image description */}
            {carouselItems[currentIndex]?.equipmentName}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            onClick={goToNext}
          >
            Next
          </button>
        </div>
      </>
  )
}

export default FavoriteCarousel