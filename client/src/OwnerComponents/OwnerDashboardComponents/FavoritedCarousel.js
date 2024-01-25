import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function FavoriteCarousel({currentUser, setFromOwnerDash, role}) {

const [currentIndex, setCurrentIndex] = useState(0)
// console.log("CURRENT USER:",currentUser)
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

// Test owner user.favorites ? To see if they have either not been favorited, or if they haven't uploaded equipment
// console.log("FAVORITE CAROUSEL LENGTH:", currentUser?.equipment?.user_favorite?.length)

// console.log(" AND THE ROLE : ", role)
if (currentUser && role === 'owner') {
  const hasFavorites = currentUser.equipment.some(item => item.user_favorite && item.user_favorite.length > 0)

  if (!hasFavorites) {
    return(
      <div className="flex items-center justify-center h-full text-center text-gray-800">
        <p className="text-lg font-medium">Users haven't favorited any Equipment quite yet!</p>
      </div>
    )
  }
} else if (currentUser?.equipment?.length === 0 && role === 'owner') {
  return(
    <div className="flex items-center justify-center h-full text-center text-gray-800">
     <p className="text-lg font-medium">You haven't uploaded any equipment yet, until then a user can't favorite it, and the favorites won't be shown here!</p>
    </div>)
}

if (currentUser?.user_favorite?.length === 0 && role === 'user'){
  return(
    <div className="flex items-center justify-center h-full text-center text-gray-800">
     <p className="text-lg font-medium">You haven't favorited any Equipment yet, once you do you'll be able to see them here too! </p>
    </div>)
}

//Also, I didn't need to map, as I don't have it set to a variable, I'm just pushing stuff inside of carouselItems instead of mapping and creating a new array. If I had done something like const thisData.map for example

if(role ==='user'){
currentUser?.user_favorite?.forEach((favorite) => {
  // console.log("FAVORITE FOR USER:",favorite)
  // if(favorite?.user_favorite.length > 0){
    // let ownerOrEquipmentFavorite
    if(favorite.owner !== null){
      carouselItems.push({
        name: `${favorite?.owner?.firstName} ${favorite?.owner?.lastName}`,
        image: <img
              key={favorite?.owner?.firstNam +' '+ favorite?.owner?.lastName + '' + favorite?.owner?.id} 
              className="w-[350px] h-[250px] object-fill rounded-lg"
              src={favorite?.owner?.profileImage}
              alt={favorite?.owner?.firstNam +' '+ favorite?.owner?.lastName}
              onClick={() => handleEquipmentNavigation(favorite?.owner?.id)}
            />}
            )
      
    } else {
        carouselItems.push({
          name: `${favorite?.equipment?.make} ${favorite?.equipment?.model}`,
          image: <img
                key={favorite?.equipment?.make +' '+ favorite?.equipment?.model + '' + favorite?.equipment?.id} 
                className="w-[350px] h-[250px] object-fill rounded-lg"
                src={favorite?.equipment?.equipment_image}
                alt={favorite?.equipment?.make +' '+ favorite?.equipment?.model}
                onClick={() => handleEquipmentNavigation(favorite?.equipment?.id)}
              />}
              )

    }
  })
} else {
  currentUser?.equipment?.forEach((equipment) => {
    if(equipment?.user_favorite.length > 0){
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
    }
  })
}

  
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

export default FavoriteCarousel