import React from "react";

function Reviews({stars, comment, image, firstName, lastName, profession}){

  let starDisplayer = [];

  for (let i = 0; i < stars; i++) {
    starDisplayer.push (
    <img src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f195bcf37f880_Vector.svg" 
    alt="" 
    className="mr-1.5 w-4" 
    key={`star-${i}`} 
    />)
  }

  {/* <div className="mb-6 grid gap-5 sm:grid-cols-2 md:grid-cols-2">
    </div> */}

    return(
  
      
      <div className="grid border border-solid border-[#dfdfdf] bg-white p-8 md:p-10">
        <div className="flex">
            {starDisplayer}
        </div>
        <p className="text-[#647084] mb-4">{comment}</p>
        <div className="flex mt-auto">
          <img src={image} alt="" className="mr-4 h-16 w-16 rounded-full" />
          <div className="flex flex-col justify-center">
            <h6 className="font-bold">{firstName} {lastName}</h6>
            <p className="text-sm text-[#636262]">{profession}</p>
          </div>
        </div>
      </div>




    )
}

export default Reviews;