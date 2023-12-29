import React, { useState } from 'react';

function InsuranceRecommendations(){

const [currentIndex, setCurrentIndex] = useState(0)
// console.log("CAROUSEL:",currentUser)

//Just did something similar as to when I had the review submission stars, but instead I'm pushing an object into carouselItems, the image has an image element 
let carouselItems = []

const insuranceData = [{
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
      link: `${insurance?.link}`,
      image: <img
            key={insurance?.name} 
            className="w-[250px] h-[150px] object-scale-down rounded-lg mt-2"
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
    <div className="h-full flex flex-col justify-between">
      <h2 className="text-lg font-medium text-center mb-2 bg-gray-100 rounded-t-lg shadow-lg p-2">
        We Recommend the Following Insurance Providers:
      </h2>
      <div className="flex-grow overflow-hidden flex items-center justify-center">
        <a href={carouselItems[currentIndex]?.link} target="_blank" rel="noopener noreferrer">
          {carouselItems[currentIndex]?.image}
        </a>
      </div>
      <div className="text-center px-4">
        <a href={carouselItems[currentIndex]?.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold">
          {carouselItems[currentIndex]?.name}
        </a>
        <p className="text-sm mt-2 px-4 mb-2">{carouselItems[currentIndex]?.description}</p>
      </div>
      <div className="flex space-x-4 justify-center mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow"
          onClick={goToPrevious}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow"
          onClick={goToNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default InsuranceRecommendations