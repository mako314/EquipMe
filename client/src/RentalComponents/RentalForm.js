import React from "react";
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import ApiUrlContext from "../Api";

function RentalForm({ addRentalAgreement, owners, equipmentArray }){
    const [error, setError] = useState()
    const [rentFrom, setRentFrom] = useState("")
    const [locRent, setLocRent] = useState("")
    const [selectFrom, setSelectFrom] = useState([])

    const apiUrl = useContext(ApiUrlContext)


// ------------------------------------------THIS CODE IS FOR RENTAL AGREEMENTS, RENTALFORMPREPOP IS FOR LISTING EQUIPMENT-----------------------------------------------------
//---------------------------------This is going to need to be re-written, this at the moment, lets you just do a general form that you can select from owner, however in theory it's too general. I want an individual to click the equipment and this be pre-populated with the EQUIPMENT OWNER and logged in USER information.--------------------
//---------------------------------For example, the equipment Owners location, equipment, their name, etc. 
//--------------------------------- The users ID, their name, their contact information, it should almost be just a confirmation window in a sense all their information ready, and just a confirmation needed.
//--------------------------------- Form worked for my project, but ideally I'd like to reflect how I did it in hobby wars more

    //Going to need to edit this with useEffect like I did prior in the hobbyWars code, waiting for stuff to set and then using setFormikValues
    // Just need to remember that I do not want this form to be blanket, they will have to click rent from somewhere, (product display, product cards, etc)
    // Remember I want to filter by location /equipment type is fine

    const navigate = useNavigate()

    const formSchema = object({
        location: string().required('We need your coordinates Masterchief'),
        total_price: number().positive().required('You must enter a positive offer.'),
        user_id: string().required('Please select who you would like to rent from.')
    })

    //user POST
    const formik = useFormik({
        initialValues: {
            location: '',
            total_price: '',
            rental_dates: '',
            owner_id: '',
            user_id: '',
            equipment_id: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${apiUrl}rental_agreements` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(user => {
                            addRentalAgreement(user)
                            navigate('/rental_agreements')
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
        }
    })

    const mappedOwnerSelect = owners.map((owner) =>(
        <option key={owner.id} value={owner.id}> {owner.name}</option>
        // can match up with name maybe
    ))
    // key needed here or error.

    const handleOwnerFilter = (event) => {
        formik.handleChange(event);
        setRentFrom(event.target.value);
    }

    // const handleLocationFilter = (event) => {
    //     formik.handleChange(event);
    //     setLocRent(event.target.value);
    // }

    //it's not , but I don't think it matters what you put as your company name or actual name, you'll always get benjamin davis. hopefully we can work out the quirks
    
    
    
    

    const mappedEquipmentSelect = selectFrom.map((equipment) =>(
        <option value={equipment.id}> Make: {equipment.make}  Model: {equipment.model}</option>
    ))

    useEffect(() => {
    fetch(`${apiUrl}all_equipment/${rentFrom}`)
        .then((resp) => resp.json())
        .then((data) => {
        setSelectFrom(data)
        })
    }, [rentFrom])
    
    


    // <form className="form" onSubmit={formik.handleSubmit}> FOR THE LOVE OF GOD INCLUDE THE SUBMIT IN THE FORM
    // MAKE 2 FORM COMPONENTS, CONDITIONALLY RENDER THOSE 2


    return (
        <div className = "form-container">
            <form className="form" onSubmit={formik.handleSubmit}>
                <div className="signup-form">

                    {/* display errors from formik/yup */}
                    { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }

                    {/* display errors from backend */}
                    {error && <p>{error}</p>}

                    <div className="submit-form"> 
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="submit-form"> 
                    <label>Total Price $ </label>
                    <input
                        type="text"
                        name="total_price"
                        value={formik.values.total_price}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="submit-form"> 
                    <label>Rental Dates</label>
                    <input
                        type="text"
                        name="rental_dates"
                        value={formik.values.rental_dates}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>My Name or Company</label>
                    <input
                        type="text"
                        name="owner_id"
                        value={formik.values.owner_id}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form">
                        <label>Who would you like to rent from?</label>
                    <select
                        className="text-black"
                        name="user_id"
                        value={formik.values.user_id}
                        onChange={handleOwnerFilter}>
                        <option> Select from the options below:</option>
                        {mappedOwnerSelect}
                    </select>
                    </div>

                    <div className="submit-form">
                    <select
                        className="text-black"
                        name="equipment_id"
                        value={formik.values.equipment_id}
                        onChange={formik.handleChange}>
                        <option> Select from the rentals below</option>
                        {mappedEquipmentSelect}
                    </select>
                    </div>

                </div>
                <input type='submit' className="submit-btn"/>
            </form>
        </div>
    )
}

export default RentalForm;