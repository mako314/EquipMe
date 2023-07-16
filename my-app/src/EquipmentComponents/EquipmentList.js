import React from "react";
import EquipmentCards from "./EquipmentCards";

function EquipmentList(){
    //do not forget to pass in state variable
    // map over things here once it's been fetched
    //something like the following:

    const mappedEquipmentCards = stateVariableHERE.map((stateVariable) => (
        <EquipmentCards
        key={stateVariable.id}
        type={stateVariable.type}
        make={stateVariable.make}
        model={stateVariable.model}
        owner_name={stateVariable.owner_name}
        location={stateVariable.location}
        availability={stateVariable.availability}
        delivery={stateVariable.delivery}
        quantity={stateVariable.quantity}


        />
    ))


    return(

        <div>
            need to pass mapped stuff in here {mappedEquipmentCards} 
            {/* just need to make sure that equipmentCards has a proper formatting / elements */}
        </div>
    )
}

export default EquipmentList;


// name
// type
// make
// model
// owner_name
// location
// availability
// delivery
// quantity