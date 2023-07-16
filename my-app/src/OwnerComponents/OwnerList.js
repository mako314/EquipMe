import React from "react";
import OwnerCards from "./OwnerCards";

function OwnerList(){
    //do not forget to pass in state variable
    // map over things here once it's been fetched
    //something like the following:

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
    )
}

export default OwnerList;

//id 
//name
//age
//location
//profession
//#might need to add email to identify user
// At first I thought this was the USER list, however this is owner
// IT would be a good idea to display their email and contact information, example phone #