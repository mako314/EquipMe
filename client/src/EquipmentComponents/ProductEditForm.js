import React from "react";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'

function ProductEditForm({equipmentToEdit, updateEquipment}){
    
    const [error, setError] = useState()
    const navigate = useNavigate()

    // Going to need to pass owner and setOwner context here, and apply some ifs comparing the owner id to the equipment owner_id. If matching, it's the owners equipment and they'll be allowed to edit the equipment. IF the equipment is out for rent, I will have to not allow adjustment of certain things I believe? 
    // Will also need to hide this link in a good spot and make it a OWNER logged in display. Users should not be able to list equipment as they should be vetted.


    const formSchema = object({
        name: string().required('Please enter a name'),
        quantity: number().positive().required('You cannot list less than 0 items.'),
        email: string().required('Please enter an email address')
    })

    const formik = useFormik({
        initialValues: {
            name: equipmentToEdit.name,
            type: equipmentToEdit.type,
            make: equipmentToEdit.make,
            model: equipmentToEdit.model,
            owner_name: equipmentToEdit.owner_name,
            phone: equipmentToEdit.phone,
            email: equipmentToEdit.email,
            location: equipmentToEdit.location,
            availability: equipmentToEdit.availability,
            delivery: equipmentToEdit.delivery,
            quantity: equipmentToEdit.quantity
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/equipment/${equipmentToEdit.id}` , {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
              .then(res =>{
                if (res.ok) {
                    res.json().then(equipment => {
                        updateEquipment(equipment)
                        navigate(`/equipment/${equipmentToEdit.id}`)
                    })
                } else {
                    res.json().then(error => setError(error)) //for backend errors
                }
              })
        }
    })

    return (
        <div className = "form-container">
            <form className="form" onSubmit={formik.handleSubmit}>
                <div className="signup-form">

                    {/* display errors from formik/yup */}
                    { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }

                    {/* display errors from backend */}
                    {error && <p>{error}</p>}

                    <div className="submit-form"> 
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>Type</label>
                    <input
                        type="text"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>Manufacturer</label>
                    <input
                        type="text"
                        name="make"
                        value={formik.values.make}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>Model</label>
                    <input
                        type="text"
                        name="model"
                        value={formik.values.model}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
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
                    <label>Availability</label>
                    <input
                        type="text"
                        name="availability"
                        value={formik.values.availability}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="submit-form"> 
                    <label>Delivery</label>
                    <input
                        type="text"
                        name="delivery"
                        value={formik.values.delivery}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="submit-form"> 
                    <label>Quantity</label>
                    <input
                        type="text"
                        name="quantity"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                </div>
                <input type='submit' className="submit-btn"/>
            </form>
        </div>
    )

}

export default ProductEditForm;