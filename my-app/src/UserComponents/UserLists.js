import React from "react";

function UserLists(){

    const mappedUserCards = stateVariableHERE.map((stateVariable) => (
        <UserCards
        key={stateVariable.id}
        name={stateVariable.name}
        age={stateVariable.age}
        location={stateVariable.location}
        profession={stateVariable.profession}
        />
    ))



    return(
        <div>
            need to pass mapped stuff in here {mappedUserCards} 
            {/* just need to make sure that UserCards has a proper formatting / elements */}

        </div>
    )
}

export default UserLists;

//id
//name
//age
//location
//profession
//might need to add email to identify user WILL NOT MAKE USER EMAIL PUBLIC IT IS SIMPLY FOR MAKING SURE ITS THEM
//and reviews