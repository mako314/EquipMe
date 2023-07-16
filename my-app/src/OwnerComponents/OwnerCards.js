import React from "react";

function OwnerCards(){

    // DO NOT FORGET TO PASS PROPS
    // in the phase 2 project I had nothing here, it was simply a return with props passed into the function
    // name
    // location
    // may need to include a profession, i.e Heavy Machinery, Painting
    // also a random logo i make if i have time

    return(
        <div>
            Just need to do all the elements and styling in here if using tailwind
            <h1> Include name of the owner here</h1>
            <h2> Location here</h2>
            <span> Location </span>
            <img className="relative w-[500px]" src={image} alt={name}/> need to include updated image this would be the logo
            

            {/* may need to break it up into divs or something for style */}

        </div>
    )
}

export default OwnerCards;