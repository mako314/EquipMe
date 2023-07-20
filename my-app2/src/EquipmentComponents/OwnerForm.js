import React from "react";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'

function UserForm({addOwner}){

    const [error, setError] = useState()
    const navigate = useNavigate()

    const formSchema = object({
        name: string().required('Please enter a name'),
        email: string().required('Please enter an email address')
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            location: '',
            profession: '',
            phone: '',
            email: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('http://127.0.0.1:5555/equipment_owners' , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(owner => {
                            addOwner(owner)
                            navigate('/equipment_owners')
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
            
        }
    })


    return(
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
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="submit-form"> 
                    <label>Profession</label>
                    <input
                        type="text"
                        name="profession"
                        value={formik.values.profession}
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
                </div>
                <input type='submit' className="submit-btn"/>

            </form>
        </div>
    )
}

export default UserForm;