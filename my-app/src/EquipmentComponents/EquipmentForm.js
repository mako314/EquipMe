import React from "react";

function EquipmentForm(){

    function handleSubmit(e){
        e.preventDefault()
    }

    return(
        <div>
            <form className="form"
              onSubmit={handleSubmit}>

                <label className="text-white">
                    <label data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="text">Submission Form</label>

                <select className="text-black" name="postType" 
                onChange={(e) => setSubmitType(e.target.value)}>
                <option> Please Select an Option Below </option>
                <option value="set_rental">List a rental</option>
                <option value="user">Create an account to rent!</option>
                </select>

                </label>

                {/* {submitType === "set_rental" ? newRentalForm : "" }
                {submitType === "user" ? userForm : "" }
                This can be universal for our form if we'd like an extra form that changes and conditionally renders based on what a person is trying to do. For example, put something for rent, become an owner(technically they should if they put something for rent), or become a user
                */}
        </form>

        </div>
    )
}

export default EquipmentForm;

// This form still needs a lot of things in it. Check neatFleet formOne to see what else is required

// className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"

//was in this (label data-modal-target)

// may have to conditionally render it where this form submits to our owners also and only takes x data.


//EQUIPMENT RENTAL LISTING
// key
// type
// make
// model
// owner_name
// location
// availability
// delivery
// quantity

//OWNER CREATION
// id
// name
// location
// #may need to include a profession, i.e Heavy Machinery, Painting
// #Also may need to include contact information, this could be a string?