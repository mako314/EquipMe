import React from "react";
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import OwnerContext from "../OwnerComponents/OwnerContext";

function ProductImageForm({ addEquipment }){
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
        // quantity: number().positive().required('You cannot list less than 0 items.'),
        // email: string().required('Please enter an email address')
    })



    //Equipment POST
    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            make: '',
            model: '',
            location: '',
            availability: '',
            delivery: '',
            quantity: '',
            owner_id: ' '
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
                            console.log(equipment)
                            addEquipment(equipment)
                            navigate('/equipment')
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
                
        }
    })

    useEffect(() => {
      if (owner && owner.id){
      formik.setValues({
        owner_id: owner.id,
      })
  }
    }, [owner])



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
          <label htmlFor="name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Name of the Equipment </label>
          <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
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

export default ProductImageForm;

