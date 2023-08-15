import React from "react";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"
import { object, string, number } from 'yup'

function RentalForm({ addRentalAgreement, owners, equipmentArray, featuredRental }) {
    const [error, setError] = useState()
    const [rentFrom, setRentFrom] = useState("")
    const [locRent, setLocRent] = useState("")
    const [selectFrom, setSelectFrom] = useState([])

    const navigate = useNavigate()
    console.log(featuredRental[0].location)

    const formSchema = object({
        location: string().required('We need your coordinates Masterchief'),
        total_price: number().positive().required('You must enter a positive offer.'),
        renter_id: string().required('Please select who you would like to rent from.')
    })

    //user POST
    const formik = useFormik({
        initialValues: {
            location: featuredRental[0].location,
            total_price: '',
            rental_dates: '',
            owner_id: featuredRental[0].owner_name,
            renter_id: '',
            equipment_id: featuredRental[0].id
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('http://127.0.0.1:5555/rental_agreements', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok) {
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

    // const mappedOwnerSelect = owners.map((owner) => (
    //     <option key={owner.id} value={owner.id}> {owner.name}</option>
    //     // can match up with name maybe
    // ))
    // // key needed here or error.

    const handleOwnerFilter = (event) => {
        formik.handleChange(event);
        setRentFrom(event.target.value);
    }

    // const handleLocationFilter = (event) => {
    //     formik.handleChange(event);
    //     setLocRent(event.target.value);
    // }

    //it's not fucked, but I don't think it matters what you put as your company name or actual name, you'll always get benjamin davis. hopefully we can work out the quirks





    // const mappedEquipmentSelect = selectFrom.map((equipment) => (
    //     <option value={equipment.id}> Make: {equipment.make}  Model: {equipment.model}</option>
    // ))

    // useEffect(() => {
    //     fetch(`http://127.0.0.1:5555/all_equipment/${rentFrom}`)
    //         .then((resp) => resp.json())
    //         .then((data) => {
    //             setSelectFrom(data)
    //         })
    // }, [rentFrom])




    // <form className="form" onSubmit={formik.handleSubmit}> FOR THE LOVE OF GOD INCLUDE THE SUBMIT IN THE FORM
    // MAKE 2 FORM COMPONENTS, CONDITIONALLY RENDER THOSE 2


    return (
        <div className="form-container">
            <form className="form" onSubmit={formik.handleSubmit}>
                <div className="signup-form">

                    {/* display errors from formik/yup */}
                    {formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>)}

                    {/* display errors from backend */}
                    {error && <p>{error}</p>}

                    <div className="submit-form">
                        <label>Location: </label>
                        <input
                            type="text"
                            name="location"
                            value={formik.values.location = featuredRental[0].location}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Total Price $:  </label>
                        <input
                            type="text"
                            name="total_price"
                            value={formik.values.total_price}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Rental Dates: </label>
                        <input
                            type="text"
                            name="rental_dates"
                            value={formik.values.rental_dates}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>My Name or Company: </label>
                        <input
                            type="text"
                            name="renter_id"
                            value={formik.values.renter_id}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Owner: </label>
                        <input
                            type="text"
                            name="owner_id"
                            value={formik.values.owner_id = featuredRental[0].owner_name}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Equipment ID: </label>
                        <input
                            type="text"
                            name="equipment_id"
                            value={formik.values.equipment_id = featuredRental[0].id}
                            onChange={formik.handleChange}
                        />
                    </div>





                </div>
                <input type='submit' className="submit-btn" />
            </form>
        </div>
    )
}

export default RentalForm;