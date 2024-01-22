import React from "react";
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
// import OwnerContext from "../OwnerComponents/OwnerContext";
import { UserSessionContext } from "../UserComponents/SessionContext";
import ApiUrlContext from "../Api";

//----------------------------IMAGE UPLOAD----------------------------
import { ref, uploadBytes, listAll, getDownloadURL} from 'firebase/storage';
import { storage } from "../CloudComponents/Firebase";
import {v4} from 'uuid';
//--------------------------------------------------------------------

import {toast} from 'react-toastify'


function ProductForm({ addEquipment }){
    const [error, setError] = useState()
    const [featureEquipment, setFeatureEquipment] = useState(false)
    const navigate = useNavigate()
    const { currentUser, role, checkSession } = UserSessionContext()
    // const [owner, setOwner] = useContext(OwnerContext)
    const apiUrl = useContext(ApiUrlContext)
//----------------------------IMAGE UPLOAD----------------------------
    const [imageUpload, setImageUpload] = useState(null)
    const [imageList, setImageList] = useState([])

    //This is in case I need to start displaying the image previews (I intend to)
    const imageListRef = ref(storage, "equipmentImages/")
//--------------------------------------------------------------------

    // Going to need to pass owner and setOwner context here, and apply some ifs to prepopulate this form. 
    // Will also need to hide this link in a good spot and make it a OWNER logged in display. Users should not be able to list equipment as they should be vetted.
    // LIST EQUIPMENT 

    //useEffect to check whether or not an owner is logged in! Succesfuly conditional rendering
    // useEffect(() => {
    //     fetch(`${apiUrl}owner/check_session`, {
    //       credentials: 'include'
    //     }).then((response) => {
    //       if (response.ok) {
    //         response.json().then((owner) => setOwner(owner));
    //       }
    //     });
    //   }, []);
    
    //   console.log(owner)
    // console.log(featureEquipment)
    


    const formSchema = object({
        name: string().required('Please enter a name'),
        totalQuantity: number().positive().required('You cannot list less than 0 items.'),
        hourly_rate: number().positive().required('Must be a positive dollar amount.'),
        daily_rate: number().positive().required('Must be a positive dollar amount.'),
        weekly_rate: number().positive().required('Must be a positive dollar amount.'),
        promo_rate: number().positive().required('Must be a positive dollar amount.'),
        // email: string().required('Please enter an email address')
    })

  useEffect(() => {
      if (role === 'owner' && currentUser.id){
      formik.setValues({
        owner_id: currentUser.id,
      })
  }
    }, [currentUser])

    //Equipment POST
    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            make: '',
            model: '',
            country:'',
            state:'',
            city:'',
            postal_code: '',
            address:'',
            address_line_2:'',
            availability: '',
            delivery: '',
            totalQuantity: '',
            availableQuantity: '',
            owner_id: '',
            equipment_image: '',
            description: '',
            imageURL: '',
            hourly_rate : '',
            daily_rate : '',
            weekly_rate : '',
            promo_rate : '',
            // equipment_id: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${apiUrl}equipment` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(data => {
                            // console.log(data)
                            const equipment = data.equipment
                            const updatedValues = {
                              ...values,
                              equipment_id: equipment.id
                          }
                            addEquipment(equipment)
                            // navigate('/equipment')
                          //   const equipmentImage = {
                          //     equipment_id: equipment.id,
                          //     imageURL: values.imageURL,
                          // }
                          // console.log('THE EQUIPMENT:', equipment)
                            fetch (`${apiUrl}equipment/price` , {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(updatedValues)
                            })
                            .then(res => {
                              if (res.ok){
                                if(featureEquipment !== true){
                                toast.success(`🏗 Succesfully added ${equipment.make} ${equipment.name} as a rental equipment.`,
                                {
                                  "autoClose" : 2000
                                })}
                                checkSession()
                                res.json().then(updatedValues =>{
                                  // console.log(featureEquipment)
                                  if(featureEquipment === true){
                                  fetch (`${apiUrl}feature/equipment/${equipment.id}` , {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(updatedValues)
                                  }).then(res => {
                                    if(res.ok){
                                      toast.success(`🏗 Succesfully added ${equipment.make} ${equipment.name} and set it as a featured equipment.`,
                                      {
                                        "autoClose" : 2000
                                      })
                                      checkSession()
                                      navigate('/dashboard')
                                      // console.log(res)
                                    }
                                    // console.log(res)
                                  })}
                                })
                              }
                            })
                          })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
                
        }
    })

    const handleFeaturingEquipment = (e) => {
      // IF you are wanting to feature equipment, set it to true, otherwise set it to false
      setFeatureEquipment(e.target.value === 'true')
  }



    // const uploadImage = () => {
    //   if (imageUpload == null) return;
    //   const imageRef = ref(storage, `equipmentImages/${imageUpload.name + v4()}`);
    //   uploadBytes(imageRef, imageUpload).then((snapshot) =>{
    //       getDownloadURL(snapshot.ref).then((url) => {
    //           alert("Image Uploaded!")
    //           // formik.handleChange()
    //           formik.values.imageURL = url
    //       })
          
    //   })
  // }

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
            {formik.errors && Object.entries(formik.errors).map(([field, error]) => <p key={field + error}>{error}</p>)}
            {/* display errors from backend */}
            {error && <p>{error}</p>}
          </div>
       
        <div>
          <label htmlFor="name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Name of the Equipment </label>
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
          <label htmlFor="description" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Description of the Equipment</label>
          <textarea type="text" name="description" value={formik.values.description} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" 
          > </textarea>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="equipment_image" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Image URL</label>
          <input type="text" name="equipment_image" value={formik.values.equipment_image} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>
 
        <div className="sm:col-span-2">
        <label htmlFor="country" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Country </label>
        <input type="text" name="country" value={formik.values.country} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="state" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> State </label>
          <input type="text" name="state" value={formik.values.state} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="city" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> City </label>
          <input type="text" name="city" value={formik.values.city} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Address Line 1 </label>
          <input type="text" name="address" value={formik.values.address} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address_line_2" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Address Line 2 </label>
          <input type="text" name="address_line_2" value={formik.values.address_line_2} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="postal_code" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Postal / Zip Code </label>
          <input type="text" name="postal_code" value={formik.values.postal_code} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
        <label htmlFor="availability" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Is this Equipment available to rent now? </label>
        <div className="flex items-center">
          <input type="radio" name="availability" value="yes" checked={formik.values.availability === 'yes'} onChange={formik.handleChange}/>
          <label htmlFor="availability_yes" className="ml-2 text-sm text-gray-800 sm:text-base">Yes</label>
        </div>
        <div className="flex items-center">
          <input type="radio" name="availability" value="no" checked={formik.values.availability === 'no'} onChange={formik.handleChange}/>
          <label htmlFor="availability_no" className="ml-2 text-sm text-gray-800 sm:text-base">No</label>
        </div>

        </div>
 

        <div className="sm:col-span-2">
        <label htmlFor="delivery" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Is this Equipment currently Avaiable to be Delivered? </label>
        <div className="flex items-center">
          <input type="radio" name="delivery" value="True" checked={formik.values.delivery === 'True'} onChange={formik.handleChange}/>
          <label htmlFor="delivery_yes" className="ml-2 text-sm text-gray-800 sm:text-base">Yes</label>
        </div>
        <div className="flex items-center">
          <input type="radio" name="delivery" value="False" checked={formik.values.delivery === 'False'} onChange={formik.handleChange} />
          <label htmlFor="delivery_no" className="ml-2 text-sm text-gray-800 sm:text-base">No</label>
        </div>

        </div>
 
        <div className="sm:col-span-2">
          <label htmlFor="totalQuantity" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Total Quantity of Equipment </label>
          <input type="number" name="totalQuantity" value={formik.values.totalQuantity} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="availableQuantity" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Available Quantity </label>
          <input type="number" name="availableQuantity" value={formik.values.availableQuantity} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>


        <label htmlFor="format" className="mb-2 inline-block text-sm sm:text-base font-semibold text-red-600">
          Format: 0000.00 *$ NOT REQUIRED
        </label>

        <div className="sm:col-span-2">
          <label htmlFor="hourly_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Hourly Rate:</label>
          <input type="number" name="hourly_rate" value={formik.values.hourly_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="daily_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Daily Rate: </label>
          <input type="number" name="daily_rate" value={formik.values.daily_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="weekly_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Weekly Rate:</label>
          <input type="number" name="weekly_rate" value={formik.values.weekly_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="promo_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Promo Rate:</label>
          <input type="number" name="promo_rate" value={formik.values.promo_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>


        {/* <div>
          <label htmlFor="imageURL" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Picture </label>
          <input type="file" onChange={
                (event) => { setImageUpload(event.target.files[0])
                }}
                name="imageURL"
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                />
            <button onClick={uploadImage}> Upload Image </button>
        </div> */}

            <div className="mt-6 flex"> 

            <label className="inline-flex items-center font-bold text-gray-900">
                <input
                    type="radio"
                    className="form-radio"
                    name="decline_feature"
                    value="false"
                    checked={featureEquipment === false}
                    onChange={handleFeaturingEquipment}
                />
                <span className="ml-2"> I would not like to feature this Equipment. </span>
            </label>

            <label className="inline-flex items-center font-bold text-gray-900">
                <input
                    type="radio"
                    className="form-radio"
                    name="allow_feature"
                    value="true"
                    checked={featureEquipment === true}
                    onChange={handleFeaturingEquipment}
                />
                <span className="ml-2"> I would like to feature this Equipment. </span>
            </label>

            </div>

        <div className="flex items-center justify-between sm:col-span-2">
 
          {/* NEED TO CHANGE COLOR */}
          <span className="text-sm text-gray-500">*Required</span>
          <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Submit</button>
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
        { role === "owner" ? ownerView : notOwnerView}
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
//                         name="totalQuantity"
//                         value={formik.values.totalQuantity}
//                         onChange={formik.handleChange}
//                     />
//                     </div>
                    
//                 </div>
//                 <input type='submit' className="submit-btn"/>
//             </form>
//         </div> */}