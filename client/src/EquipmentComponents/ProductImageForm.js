import React from "react";
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import {useFormik} from "formik"
import { object, string, number} from 'yup'

//-----------------Imports from Components-----------------
import OwnerContext from "../OwnerComponents/OwnerContext";
import ApiUrlContext from "../Api";
import { storage } from "../CloudComponents/Firebase";

//-----------------Imports from Firebase-------------------
import { ref, uploadBytes, listAll, getDownloadURL} from 'firebase/storage';
import {v4} from 'uuid';


function ProductImageForm({ addEquipment }){
    const [error, setError] = useState()
    const navigate = useNavigate()

    
    const [owner, setOwner] = useContext(OwnerContext)
    const apiUrl = useContext(ApiUrlContext)

//-----------------------Upload Portion-------------------------------
    const [imageUpload, setImageUpload] = useState(null)
    const [imageList, setImageList] = useState([])

    const imageListRef = ref(storage, "equipmentImages/")

//--------------------------------------------------------------------
    // Going to need to pass owner and setOwner context here, and apply some ifs to prepopulate this form. 
    // Will also need to hide this link in a good spot and make it a OWNER logged in display. Users should not be able to list equipment as they should be vetted.
    // LIST EQUIPMENT 

    // useEffect to check whether or not an owner is logged in! Succesfuly conditional rendering
    useEffect(() => {
        fetch(`${apiUrl}owner/check_session`).then((response) => {
          if (response.ok) {
            response.json().then((owner) => setOwner(owner));
          }
        });
      }, []);
    
      console.log(owner)

    


    const formSchema = object({
        // name: string().required('Please enter a name'),
        // quantity: number().positive().required('You cannot list less than 0 items.'),
        // email: string().required('Please enter an email address')
    })



    //Equipment POST
    const formik = useFormik({
        initialValues: {
            imageURL: '',
            equipment_id: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${apiUrl}equipment/images` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(equipmentImage => {
                            console.log(equipmentImage)
                            // addEquipment(equipment)
                            // navigate('/equipment')
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
                
        }
    })


    //This has to fire off first, so I need to upload the image, or tie in the button to the submit of the button for the form
    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `equipmentImages/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) =>{
            getDownloadURL(snapshot.ref).then((url) => {
                alert("Image Uploaded!")
                // formik.handleChange()
                formik.values.imageURL = url
            })
            
        })
    }

//     useEffect(() => {
//       if (owner && owner.id){
//       formik.setValues({
//         owner_id: owner.id,
//       })
//   }
//     }, [owner])



    // <form className="form" onSubmit={formik.handleSubmit}> FOR THE LOVE OF GOD INCLUDE THE SUBMIT IN THE FORM
    // MAKE 2 FORM COMPONENTS, CONDITIONALLY RENDER THOSE 2

    let ownerView = 
    <div className="bg-white py-6 sm:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
 
      <div className="mb-10 md:mb-16">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl"> Attempting File upload </h2>
 
        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Picture upload!</p>
      </div>
 
      <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
         
          <div className="sm:col-span-2">
            {/* display errors from formik/yup */}
            { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
            {/* display errors from backend */}
            {error && <p>{error}</p>}
          </div>
       
        <div>
          <label htmlFor="equipment_id" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Equipment ID (Will fix this later) </label>
          <input type="text" name="equipment_id" value={formik.values.equipment_id} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div>
          <label htmlFor="imageURL" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Picture </label>
          <input type="file" onChange={
                (event) => { setImageUpload(event.target.files[0])
                }}
                name="imageURL"
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                />
            <button onClick={uploadImage}> Upload Image </button>
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

