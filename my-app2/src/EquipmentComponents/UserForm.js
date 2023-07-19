import React from "react";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'

function UserForm({ addUser }){
    const [error, setError] = useState()
    const navigate = useNavigate()

    const formSchema = object({
        name: string().required('Please enter a name'),
        age: number().positive().required('You must be 18 years or older to sign up'),
        email: string().required('Please enter an email address')
    })

    //user POST
    const formik = useFormik({
        initialValues: {
            name: '',
            age: '',
            location: '',
            profession: '',
            phone: '',
            email: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('http://127.0.0.1:5555/renters' , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => res.json())
                .then(user => {
                    addUser(user)
                    navigate('/equipment')
                })
        }
    })


    // const userSignup = (
    //     <div className="signup-form" onSubmit={formik.handleSubmit}>

    //         { formik.errors && Object.values(formik.errors).map(e => <p>(e)</p>) }
    //         <div className="owner-form"> 
    //         <label>Name</label>
    //         <input
    //             type="text"
    //             name="name"
    //             value={formik.values.name}
    //             onChange={formik.handleChange}
    //         />
    //         </div>

    //         <div className="owner-form"> 
    //         <label>Age</label>
    //         <input
    //             type="text"
    //             name="age"
    //             value={formik.values.age}
    //             onChange={formik.handleChange}
    //         />
    //         </div>

    //         <div className="owner-form"> 
    //         <label>Location</label>
    //         <input
    //             type="text"
    //             name="location"
    //             value={formik.values.location}
    //             onChange={formik.handleChange}
    //         />
    //         </div>
            
    //         <div className="owner-form"> 
    //         <label>Profession</label>
    //         <input
    //             type="text"
    //             name="profession"
    //             value={formik.values.profession}
    //             onChange={formik.handleChange}
    //         />
    //         </div>
            
    //         <div className="owner-form"> 
    //         <label>Phone</label>
    //         <input
    //             type="text"
    //             name="phone"
    //             value={formik.values.phone}
    //             onChange={formik.handleChange}
    //         />
    //         </div>
            
    //         <div className="owner-form"> 
    //         <label>Email</label>
    //         <input
    //             type="text"
    //             name="email"
    //             value={formik.values.email}
    //             onChange={formik.handleChange}
    //         />
    //         </div>
    //     </div>
    // )

    //---------------------------------------------------------------------------------------------------------------------------------------------------


    // const ownerForm = (
    //   <form>
    //     <div className = "signup-form">

    //         <div className="owner-form"> 
    //         <label>Name</label>
    //         <input
    //             type="text"
    //             name="name"
    //         />
    //         </div>

    //         <div className="owner-form"> 
    //         <label>Location</label>
    //         <input
    //             type="text"
    //             name="location"
    //         />
    //         </div>

    //         <div className="owner-form"> 
    //         <label>Profession</label>
    //         <input
    //             type="text"
    //             name="profession"
    //         />
    //         </div>

    //         <div className="owner-form"> 
    //         <label>Phone</label>
    //         <input
    //             type="text"
    //             name="phone"
    //         />
    //         </div>

    //         <div className="owner-form"> 
    //         <label>Email</label>
    //         <input
    //             type="text"
    //             name="email"
    //         />
    //         </div>

    //     </div>
    // </form>

    // )

    // name = data['name'],
    // location = data['location'],
    // profession = data['profession'],
    // phone = data['phone'],
    // email = data['email']


    // <form className="form" onSubmit={formik.handleSubmit}> FOR THE LOVE OF GOD INCLUDE THE SUBMIT IN THE FORM
    // MAKE 2 FORM COMPONENTS, CONDITIONALLY RENDER THOSE 2


    return (
        <div className = "form-container">
            <form className="form" onSubmit={formik.handleSubmit}>
                <div className="signup-form">
                    
                    { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }

                    <div className="owner-form"> 
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="owner-form"> 
                    <label>Age</label>
                    <input
                        type="text"
                        name="age"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                    />
                    </div>

                    <div className="owner-form"> 
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="owner-form"> 
                    <label>Profession</label>
                    <input
                        type="text"
                        name="profession"
                        value={formik.values.profession}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="owner-form"> 
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    />
                    </div>
                    
                    <div className="owner-form"> 
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