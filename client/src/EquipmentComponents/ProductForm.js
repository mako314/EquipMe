import React from "react";
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import OwnerContext from "../OwnerComponents/OwnerContext";

function ProductForm({ addEquipment }){
    const [error, setError] = useState()
    const navigate = useNavigate()

    
    const [owner, setOwner] = useContext(OwnerContext)
    // Going to need to pass owner and setOwner context here, and apply some ifs to prepopulate this form. 
    // Will also need to hide this link in a good spot and make it a OWNER logged in display. Users should not be able to list equipment as they should be vetted.
    // LIST EQUIPMENT 

    //useEffect to check whether or not an owner is logged in! Succesfuly conditional rendering
    useEffect(() => {
        fetch("/owner/check_session").then((response) => {
          if (response.ok) {
            response.json().then((owner) => setOwner(owner));
          }
        });
      }, []);
    
      console.log(owner)

    


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

    let ownerView = 
    <div className="bg-white py-6 sm:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
 
      <div className="mb-10 md:mb-16">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Ready to List?</h2>
 
        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Get listing in a few simple steps!</p>
      </div>
 
      <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
         
          <div className="sm:col-span-2">
            {/* display errors from formik/yup */}
            { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
            {/* display errors from backend */}
            {error && <p>{error}</p>}
          </div>
       
        <div>
          <label htmlFor="name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Name </label>
          <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="type" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">What type of Equipment is this?</label>
          <input type="text" name="type" value={formik.values.type} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="make" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">What's the Make of this Equipment?</label>
          <input type="text" name="make" value={formik.values.make} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="model" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">What's the Model of this Equipment? </label>
          <input type="text" name="model" value={formik.values.model} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="owner_name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Owner Name Placeholder (USE FORMIK SETVALUES) </label>
          <input type="text" name="owner_name" value={formik.values.owner_name} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Phone Placeholder (USE FORMIK SETVALUES)</label>
          <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email (placeholder) </label>
          <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="location" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">location, I should give them option to select other locations
           (placeholder) </label>
          <input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="availability" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Is this Equipment available to rent now?
           (placeholder) </label>
          <input type="text" name="availability" value={formik.values.availability} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="delivery" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Is this Equipment capable of being delivered??
           (placeholder) </label>
          <input type="text" name="delivery" value={formik.values.delivery} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="quantity" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Quantity of Equipment
           (placeholder) </label>
          <input type="text" name="quantity" value={formik.values.quantity} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
 
 
        <div className="flex items-center justify-between sm:col-span-2">
 
          {/* NEED TO CHANGE COLOR */}
          <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Submit</button>
 
          <span className="text-sm text-gray-500">*Required</span>
        </div>
      </form>
 
    </div>
  </div> 

  let notOwnerView =
  <>
  You must be an owner to view this page!
  </>
         


    return (
        <>
        { owner ? ownerView : notOwnerView}
        </>
    )
}

export default ProductForm;



// 


// {/* <div className = "form-container">
//             <form className="form" onSubmit={formik.handleSubmit}>
//                 <div className="signup-form">

//                     {/* display errors from formik/yup */}
//                     { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }

//                     {/* display errors from backend */}
//                     {error && <p>{error}</p>}

//                     <div className="submit-form"> 
//                     <label>Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formik.values.name}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Type</label>
//                     <input
//                         type="text"
//                         name="type"
//                         value={formik.values.type}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Manufacturer</label>
//                     <input
//                         type="text"
//                         name="make"
//                         value={formik.values.make}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Model</label>
//                     <input
//                         type="text"
//                         name="model"
//                         value={formik.values.model}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Owner Name</label>
//                     <input
//                         type="text"
//                         name="owner_name"
//                         value={formik.values.owner_name}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Phone</label>
//                     <input
//                         type="text"
//                         name="phone"
//                         value={formik.values.phone}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Email</label>
//                     <input
//                         type="text"
//                         name="email"
//                         value={formik.values.email}
//                         onChange={formik.handleChange}
//                     />
//                     </div>
                    
//                     <div className="submit-form"> 
//                     <label>Location</label>
//                     <input
//                         type="text"
//                         name="location"
//                         value={formik.values.location}
//                         onChange={formik.handleChange}
//                     />
//                     </div>
                    
//                     <div className="submit-form"> 
//                     <label>Availability</label>
//                     <input
//                         type="text"
//                         name="availability"
//                         value={formik.values.availability}
//                         onChange={formik.handleChange}
//                     />
//                     </div>

//                     <div className="submit-form"> 
//                     <label>Delivery</label>
//                     <input
//                         type="text"
//                         name="delivery"
//                         value={formik.values.delivery}
//                         onChange={formik.handleChange}
//                     />
//                     </div>
                    
//                     <div className="submit-form"> 
//                     <label>Quantity</label>
//                     <input
//                         type="text"
//                         name="quantity"
//                         value={formik.values.quantity}
//                         onChange={formik.handleChange}
//                     />
//                     </div>
                    
//                 </div>
//                 <input type='submit' className="submit-btn"/>
//             </form>
//         </div> */}