import React from "react";
import OwnerCards from "./OwnerCards";

function OwnerList(){
    //do not forget to pass in state variable
    // map over things here once it's been fetched
    //something like the following:

    //this list portion is practically done if you're going to edit style edit the div in the return or the ownerCards


    const mappedOwnerCards = stateVariableHERE.map((stateVariable) => (
        <OwnerCards
        key={stateVariable.id}
        name={stateVariable.name}
        age={stateVariable.age}
        profession={stateVariable.profession}
        />
    ))


    return(

        <div>
            need to pass mapped stuff in here {mappedOwnerCards} 
            {/* just need to make sure that OwnerCards has a proper formatting / elements */}
        </div>

//  See All Owners (Anyone)
//  A button / navbar to see everyone that uses the site and lists equipment for rent
    )
}

export default OwnerList;

//id 
//name
//age
//location
//profession
// NOT YET ADDED TO MY MODELS PLEASE UPDATE ACCORDINGLY
//#might need to add email to identify user
// At first I thought this was the USER list, however this is owner
// IT would be a good idea to display their email and contact information, example phone #