import React from "react";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'

function ProductForm({ addEquipment }){
    const [error, setError] = useState()
    const navigate = useNavigate()

    const formSchema = object({
        name: string().required('Please enter a name'),
        quantity: number().positive().required('You cannot list less than 0 items.'),
        email: string().required('Please enter an email address')
    })

    //Equipment POST
    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            make: '',
            model: '',
            owner_name: '',
            phone: '',
            email: '',
            location: '',
            availability: '',
            delivery: '',
            quantity: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('/equipment' , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(equipment => {
                            addEquipment(equipment)
                            navigate('/equipment')
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
                
        }
    })



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
                    <label>Owner Name</label>
                    <input
                        type="text"
                        name="owner_name"
                        value={formik.values.owner_name}
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

export default ProductForm;