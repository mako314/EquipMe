import React from "react";

function Reviews({stars, comment}){

  let starDisplayer = [];

  for (let i = 0; i < stars; i++) {
    starDisplayer.push (
    <img src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f195bcf37f880_Vector.svg" 
    alt="" 
    class="mr-1.5 w-4" />)
  }

    return(
  
    <div class="mb-6 grid gap-5 sm:grid-cols-2 md:grid-cols-2">
      <div class="grid border border-solid border-[#dfdfdf] bg-white p-8 md:p-10">
        <div class="flex">
            {starDisplayer}
        </div>
        <p class="text-[#647084]">{comment}</p>
        <div class="flex">
          <img src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358cb67bf1bca198e298c35_Ellipse%205-2.png" alt="" class="mr-4 h-16 w-16" />
          <div class="flex flex-col">
            <h6 class="font-bold">Laila Bahar</h6>
            <p class="text-sm text-[#636262]">Designer</p>
          </div>
        </div>
      </div>
    </div>


    )
}

export default Reviews;