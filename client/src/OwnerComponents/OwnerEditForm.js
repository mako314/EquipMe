import React from "react";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'

function OwnerEditForm({ownerToEdit, updateOwner}){

    //Need a place in the ownerProfile / Display page to allocate for this, still need to build owner signup.

    const [error, setError] = useState()
    const navigate = useNavigate()

    const formSchema = object({
        name: string().required('Please enter a name'),
        email: string().required('Please enter an email address')
    })

    const formik = useFormik({
        initialValues: {
            name: ownerToEdit.name,
            location: ownerToEdit.location,
            profession: ownerToEdit.profession,
            phone: ownerToEdit.phone,
            email: ownerToEdit.email,
            website: ownerToEdit.website
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/equipment_owner/${ownerToEdit.id}` , {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
              .then(res =>{
                if (res.ok) {
                    res.json().then(owner => {
                        updateOwner(owner)
                        navigate('/equipment_owners')
                    })
                } else {
                    res.json().then(error => setError(error)) //for backend errors
                }
              })
        }
    })

    return(
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                

                <div className="mb-10 md:mb-16">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Edit Account</h2>

                {/* <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Get listing in a few simple steps!</p> */}
                </div>

                <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
                    
                    <div className="sm:col-span-2">
                    {/* display errors from formik/yup */}
                    { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
                    {/* display errors from backend */}
                    {error && <p>{error}</p>}
                    </div>

                {/* Avatar Section */}
                <div className="mr-10 flex flex-col items-center">
                {/* The circle avatar placeholder */}
                <div className="w-48 h-48 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold mb-4">
                    {/* Placeholder initial/text, e.g., "A" */}
                    Profile Image
                </div>
                
                <button className="block w-full rounded-lg bg-indigo-500 px-4 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base mb-4">
                Upload Avatar
                </button>

                {/* Input for image link */}
                <input type="text" placeholder="Or enter image URL" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"/>
                </div>
                
                <div>
                    <label htmlFor="name" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base"> Name </label>
                    <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                

                
                    <label htmlFor="phone" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base">Phone</label>
                    <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                

                
                    <label htmlFor="email" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
                    <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="profession" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Profession</label>
                    <input type="text" name="profession" value={formik.values.profession} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="location" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Location</label>
                    <input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>

                {/* <div className="sm:col-span-2">
                    <label htmlFor="profileImage" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Profile Image</label>
                    <input type="text" name="profileImage" value={formik.values.profileImage} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div> */}

                <div className="sm:col-span-2">
                    <label htmlFor="website" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Website</label>
                    <input type="text" name="website" value={formik.values.website} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>



                <div className="flex items-center justify-between sm:col-span-2">

                    {/* NEED TO CHANGE COLOR */}
                    <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"> Save All</button>

                    <span className="text-sm text-gray-500">*Required</span>
                </div>
                </form>

            </div>
        </div> 
    )

}

export default OwnerEditForm;

            // <div className = "form-container">
            
            //     <form className="form" onSubmit={formik.handleSubmit}>
            //         <div className="signup-form">
    
            //             {/* display errors from formik/yup */}
            //             { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
    
            //             {/* display errors from backend */}
            //             {error && <p>{error}</p>}
    
            //             <div className="submit-form"> 
            //             <label>Name</label>
            //             <input 
            //                 type="text"
            //                 name="name"
            //                 value={formik.values.name}
            //                 onChange={formik.handleChange}
            //             />
            //             </div>
    
            //             <div className="submit-form"> 
            //             <label>Location</label>
            //             <input
            //                 type="text"
            //                 name="location"
            //                 value={formik.values.location}
            //                 onChange={formik.handleChange}
            //             />
            //             </div>
                        
            //             <div className="submit-form"> 
            //             <label>Profession</label>
            //             <input
            //                 type="text"
            //                 name="profession"
            //                 value={formik.values.profession}
            //                 onChange={formik.handleChange}
            //             />
            //             </div>
                        
            //             <div className="submit-form"> 
            //             <label>Phone</label>
            //             <input
            //                 type="text"
            //                 name="phone"
            //                 value={formik.values.phone}
            //                 onChange={formik.handleChange}
            //             />
            //             </div>
                        
            //             <div className="submit-form"> 
            //             <label>Email</label>
            //             <input
            //                 type="text"
            //                 name="email"
            //                 value={formik.values.email}
            //                 onChange={formik.handleChange}
            //             />
            //             </div>
            //         </div>
            //         <input type='submit' className="submit-btn"/>
    
            //     </form>
            // </div>