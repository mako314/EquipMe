import React, { useState } from 'react';

function InsuranceRecommendations(){

const [currentIndex, setCurrentIndex] = useState(0)
console.log("CAROUSEL:",currentUser)

//Just did something similar as to when I had the review submission stars, but instead I'm pushing an object into carouselItems, the image has an image element 
let carouselItems = []

insuranceData = [{
    name: "The Hartford",
    image: "https://s24.q4cdn.com/306296537/files/images/logo/TheHartfordLogo_2.jpg",
    description: "The Hartford provides well-rounded insurance for equipment rental, covering damages and liability with dependable service and a trusted legacy.",
    link: "https://www.thehartford.com/inland-marine-insurance/equipment-rental",
},
{
    name: "Xinsurance",
    image: "https://www.xinsurance.com/wp-content/uploads/2019/03/xinsurance_icon_color.png",
    description: "Xinsurance offers customized insurance that fills coverage gaps, ensuring tailored protection for construction equipment rentals.",
    link: "https://www.xinsurance.com/risk-class/construction-equipment-rental-insurance/",
},
{
    name: "The Browning Agency",
    image: "https://www.browningagency.com/wp-content/uploads/2020/12/browning-agency-logo.png",
    description: "Specializing in equipment rental insurance, The Browning Agency delivers policies that safeguard your rentals against damage and theft.",
    link: "https://www.browningagency.com/specialty-insurance/equipment-rental/",
},
{
    name: "JT Bates Group",
    image: "https://m.bbb.org/prod/ProfileImages/082fdeef-cdcb-4550-b926-ee7d08971c2e.png",
    description: "JT Bates Group focuses on the heavy equipment sector, offering straightforward insurance solutions to protect against equipment loss and damage.",
    link: "https://jtbatesgroup.com/",
},
]


insuranceData.forEach((insurance) => {
      carouselItems.push({
      name: `${insurance?.name}`,
      description: `${insurance?.description}`,
      image: <img
            key={insurance?.name} 
            className="w-[350px] h-[250px] object-fill rounded-lg"
            src={insurance?.image}
            alt={insurance?.name}
            // onClick={() => handleEquipmentNavigation(equipment?.id)}
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

export default InsuranceRecommendations