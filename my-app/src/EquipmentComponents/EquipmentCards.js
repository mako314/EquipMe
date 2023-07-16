import React from "react";

function EquipmentCards(){

// DO NOT FORGET TO PASS PROPS
// in the phase 2 project I had nothing here, it was simply a return with props passed into the function
//might have to map over a span and include that stuff inside of my availability and delivery stuff for example...
//will need to test, because previously the tags were in an array, however in my current dataset the tags would be equivalent to the availability, delivery, and quantity. They're all a single thing and not an array 



    return(
        <div> 
            {/* Div to hold my tailwind and or css  */}
            <h2>Type of Equipment in squiggly brackets</h2>

            <h3 className=""> NAME IN "SQUIGGLY BRACKETS" here </h3>

            <img className="relative w-[500px]" src={image} alt={name}/> need to include updated image

            <span className="">
                Will need to include here likely my make, model.
            </span>

            <span>
                Need location towards the bottom, not sure if span is the best html tag to put it in 
            </span>

            <span> 
                availability, delivery, and quantity
            </span>

            
            {/* may need to break it up into divs or something for style */}
            {/* NEED A BUTTON TO DELETE AND EDIT HERE */}
        </div>
    )

}

// name
// type
// make
// model
// owner_name
// location
// availability
// delivery
// quantity
export default EquipmentCards;