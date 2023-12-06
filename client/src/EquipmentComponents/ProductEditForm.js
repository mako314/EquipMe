import React from "react";
import { useContext, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";

function ProductEditForm({equipmentToEdit, updateEquipment}){
    
    //Going to likely need owner context and check session here also
    const [featureEquipment, setFeatureEquipment] = useState(null)
    const [error, setError] = useState()
    const navigate = useNavigate()
    const location = useLocation()
    const { oneEquipment } = location.state || {}
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession } = UserSessionContext()

    console.log(oneEquipment)
    // Going to need to pass owner and setOwner context here, and apply some ifs comparing the owner id to the equipment owner_id. If matching, it's the owners equipment and they'll be allowed to edit the equipment. IF the equipment is out for rent, I will have to not allow adjustment of certain things I believe? 
    // Will also need to hide this link in a good spot and make it a OWNER logged in display. Users should not be able to list equipment as they should be vetted.


    const formSchema = object({
        name: string().required('Please enter a name'),
        quantity: number().positive().required('You cannot list less than 0 items.'),
        quantity: number().positive().required('You cannot list less than 0 items.'),
        hourly_rate: number().positive().required('Must be a positive dollar amount.'),
        daily_rate: number().positive().required('Must be a positive dollar amount.'),
        weekly_rate: number().positive().required('Must be a positive dollar amount.'),
        promo_rate: number().positive().required('Must be a positive dollar amount.'),
    })

    const formik = useFormik({
        initialValues: {
            name: oneEquipment.name,
            type: oneEquipment.type,
            make: oneEquipment.make,
            model: oneEquipment.model,
            location: oneEquipment.location,
            availability: oneEquipment.availability,
            delivery: oneEquipment.delivery,
            quantity: oneEquipment.quantity,
            owner_id: currentUser?.id,
            equipment_image: oneEquipment.equipment_image,
            description: oneEquipment.description,
            imageURL: '',
            hourly_rate : (oneEquipment.equipment_price[0].hourly_rate) / 100  ,
            daily_rate : (oneEquipment.equipment_price[0].daily_rate ) / 100 ,
            weekly_rate : (oneEquipment.equipment_price[0].weekly_rate) / 100  ,
            promo_rate : (oneEquipment.equipment_price[0].promo_rate ) / 100 ,
            equipment_id: oneEquipment.id
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
          try{
            const patchResponse = await fetch(`${apiUrl}equipment/${oneEquipment.id}` , {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            if (!patchResponse.ok){
              const patchError = await patchResponse.json()
              setError(patchError)
              return 
            }

            const equipment = await patchResponse.json()
            console.log("THE EQUIPMENT:", equipment)

            const priceResponse = await fetch(`${apiUrl}equipment/${equipment.id}/price`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(equipment)
            })

            if (!priceResponse.ok) {
              const priceError = await priceResponse.json()
              setError(priceError)
              return
            }

            if (featureEquipment !== null){
              const featureURL = featureEquipment === true 
              ? '/feature/equipment' 
              : `${apiUrl}feature/equipment/${equipment.id}`
              const featureMethod = featureEquipment === true ? 'POST' : 'DELETE'

              const featureResponse = await fetch(featureURL, {
                method: featureMethod,
                headers: {
                  "Content-Type" : "application/json"
                },
                body: JSON.stringify(equipment)
              })

              if(!featureResponse.ok){
                const featureError = await featureResponse.json()
                setError(featureError)
                return
              }
            }
            checkSession();
            // navigate(`/equipment/${equipment.id}`);
        } catch (error) {
            console.error("Network error:", error);
            setError("An unexpected error occurred");
          }
      }
  })



    console.log(oneEquipment.featured_equipment?.equipment_id === oneEquipment.id)

    // console.log(oneEquipment.featured_equipment[0].equipment_id)
    // console.log(oneEquipment.id)

    const handleFeaturingEquipment = (e) => {
        // IF you are wanting to feature equipment, set it to true, otherwise set it to false
        setFeatureEquipment(e.target.value === 'true')
    }

    return (
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
          <textarea type="text" name="description" value={formik.values.description} onChange={formik.handleChange} className="w-full h-48  rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" 
          > </textarea>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="equipment_image" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Image URL</label>
          <input type="text" name="equipment_image" value={formik.values.equipment_image} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
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


        <label htmlFor="format" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Format: 0000.00</label>


        <div className="sm:col-span-2">
          <label htmlFor="hourly_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Hourly Rate: *$ NOT REQUIRED</label>
          <input type="number" name="hourly_rate" value={formik.values.hourly_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="daily_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Daily Rate *$ NOT REQUIRED: </label>
          <input type="number" name="daily_rate" value={formik.values.daily_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="weekly_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Weekly Rate: *$ NOT REQUIRED</label>
          <input type="number" name="weekly_rate" value={formik.values.weekly_rate} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="promo_rate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Promo Rate: *$ NOT REQUIRED</label>
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
            <span> This item is {oneEquipment.featured_equipment[0]?.equipment_id === oneEquipment.id ? 'Currently Featured': 'Not Featured' }</span>
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
    )

}

export default ProductEditForm;