import React from "react";
import { useContext, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";
import {toast} from 'react-toastify'

function ProductEditForm({equipmentToEdit, updateEquipment, setEquipmentArray}){
    
    //Going to likely need owner context and check session here also
    const [featureEquipment, setFeatureEquipment] = useState(null)
    const [error, setError] = useState()
    const navigate = useNavigate()
    const location = useLocation()
    const { oneEquipment } = location.state || {}
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession } = UserSessionContext()
    const [toggleDelete, setToggleDelete] = useState(false)

    
    // Need some toast notifications
    // STILL NEED TO WRITE THE DELETE
    // https://reactrouter.com/en/main/hooks/use-location
    // https://www.educative.io/answers/how-to-use-the-uselocation-hook-in-react
    // https://reactrouter.com/en/main/components/link#state IN PRODUCT DISPLAY
    // I think the react route location stuff I did does not belong here, it seems to be somewhere else too

    // console.log("EQUIPMENT TO EDIT",oneEquipment)
    // console.log("ONE EQUIPMENT ID:", oneEquipment.id)
    // console.log(error)

  


    
    const formSchema = object({
        name: string().required('Please enter a name'),
        totalQuantity: number()
        .positive('Total Quantity must be a positive number.')
        .required('Total Quantity is required. You cannot list less than 0 items.'),
        hourly_rate: number().positive().required('Hourly rate must be a positive dollar amount.'),
        daily_rate: number().positive().required('Daily rate Must be a positive dollar amount.'),
        weekly_rate: number().positive().required('Weekly rate must be a positive dollar amount.'),
        promo_rate: number().positive().required('Promo rate Must be a positive dollar amount.'),
    })

    const formik = useFormik({
        initialValues: {
            name: oneEquipment.name,
            type: oneEquipment.type,
            make: oneEquipment.make,
            model: oneEquipment.model,
            // location: oneEquipment.location,
            country:oneEquipment.country,
            state:oneEquipment.state,
            city:oneEquipment.city,
            postal_code: oneEquipment.postal_code,
            address:oneEquipment.address,
            address_line_2:oneEquipment.address_line_2,
            availability: oneEquipment.availability,
            delivery: oneEquipment.delivery,
            totalQuantity: oneEquipment.status[0].total_quantity,
            availableQuantity: oneEquipment.status[0].available_quantity,
            owner_id: currentUser?.id,
            equipment_image: oneEquipment.equipment_image,
            description: oneEquipment.description,
            imageURL: oneEquipment.imageURL,
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
            // console.log("I'VE FIRED")
            // console.log("THE VALUES", values)

            // if(patchResponse.ok){
            //   toast.success(`🏗 Succesfully edited ${oneEquipment.make} ${oneEquipment.name}.`,
            //   {
            //     "autoClose" : 2000
            //   })
            // }

            if (!patchResponse.ok){
              const patchError = await patchResponse.json()
              console.log(patchError)
              setError(patchError)
              return 
            }
            
            const equipment = await patchResponse.json()
            console.log("THE EQUIPMENT:", equipment)

            const pricingData = {
              hourly_rate: values.hourly_rate,
              daily_rate: values.daily_rate,
              weekly_rate: values.weekly_rate,
              promo_rate: values.promo_rate,
            }

            // console.log('PRICING DATA:',pricingData)

            const priceResponse = await fetch(`${apiUrl}equipment/${oneEquipment.id}/price`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(pricingData)
            })

            // console.log('I FIRED OFF')
      
            if (!priceResponse.ok) {
              const priceError = await priceResponse.json()
              setError(priceError)
              return
            }
            if (featureEquipment == null){
            toast.success(`🏗 Succesfully edited ${values.make} ${values.name} rental equipment.`,
            {
              "autoClose" : 2000
            })}

            // console.log("FEATURED RESPONSE : ", featureEquipment)
            if (featureEquipment !== null){
              const featureURL = featureEquipment === true 
              ? `/feature/equipment/${oneEquipment.id}` 
              : `${apiUrl}feature/equipment/${oneEquipment.id}`
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

              if (featureEquipment === true){
              toast.success(`🏗 Succesfully edited  ${equipment.make} ${equipment.name} and set it as a featured equipment.`,
              {
                "autoClose" : 2000
              })
            } else if (featureEquipment === false){
                toast.success(`🏗 Succesfully edited ${equipment.make} ${equipment.name} and removed it as a featured equipment.`,
                {
                  "autoClose" : 2000
                })
              }
            }

            checkSession();
            // navigate(`/equipment/${equipment.id}`);
        } catch (error) {
            console.error("Network error:", error)
            setError("An unexpected error occurred")
          }
      }
  })

    // console.log(oneEquipment.featured_equipment?.equipment_id === oneEquipment.id)

    // console.log(oneEquipment.featured_equipment[0].equipment_id)
    // console.log(oneEquipment.id)

    const handleFeaturingEquipment = (e) => {
        // IF you are wanting to feature equipment, set it to true, otherwise set it to false
        setFeatureEquipment(e.target.value === 'true')
    }

  const handleEquipmentCollectionNav = () => {
      window.scrollTo(0, 0)
      navigate(`/equipment`)
  }

  // Toggle for delete button
  const handleToggleDelete = () => {
    setToggleDelete(!toggleDelete)
  }

  const fetchAndUpdateEquipmentData = async () => {
    try {
      const response = await fetch(`${apiUrl}equipment`)
      if (response.ok) {
        const updatedEquipment = await response.json()
        setEquipmentArray(updatedEquipment)
        checkSession()
        handleEquipmentCollectionNav()
      } else {
        const errorData = await response.json()
        console.error("An error occurred:", errorData.message)
        toast.error(`Error: ${errorData.message}`,
        {
          "autoClose" : 2000
        })
      }
    } catch (error) {
      console.error("A network or JavaScript error occurred:", error.message)
      toast.error(`Network/JavaScript Error: ${error.message}`,
      {
        "autoClose" : 2000
      })
    }
  }

  //Handles deleting the cart item!
  const handleDeleteEquipment = async () => {
    try {
      const response = await fetch(`${apiUrl}equipment/${oneEquipment.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAndUpdateEquipmentData()
        setToggleDelete(!toggleDelete)
        
        toast.success(`💥 Equipment Item successfully deleted!`, {
          "autoClose": 2000
      })
      } else {
        // console.log("Error in the fetch!")
        toast.error(`Error: Failed to delete, check your input and try again!`,
        {
          "autoClose" : 2000
        })
      }
    } catch (error) {
      // Handle fetch errors
      toast.error(`Error: Failed to delete, check your input and try again!`,
      {
        "autoClose" : 2000
      })
    }
  }





    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
 
      <div className="mb-10 md:mb-16">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Ready to List?</h2>
 
        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Get listing in a few simple steps!</p>
      </div>
      <div className="mx-auto max-w-screen-md px-4 md:px-8"> 
      <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
         
          <div className="sm:col-span-2">
            {/* display errors from formik/yup */}
            {formik.errors && Object.entries(formik.errors).map(([field, error]) => <p key={field + error}>{error}</p>)}
            {/* display errors from backend */}
            {error && <p>{error.message}</p>}
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
          <label htmlFor="totalQuantity" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Total Quantity of Equipment </label>
          <input type="number" name="totalQuantity" value={formik.values.totalQuantity} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="availableQuantity" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Available Quantity </label>
          <input type="number" name="availableQuantity" value={formik.values.availableQuantity} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
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

        <div className="flex items-center justify-between sm:col-span-2 mt-4">
 
          {/* NEED TO CHANGE COLOR */}
          <span className="text-sm text-gray-500">*Required</span>
          <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Submit</button>

        </div>
      </form>
      
      <div className="flex justify-end items-center mt-4 mb-2"> 
      {!toggleDelete ? (
                <button
                    onClick={handleToggleDelete}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-300 mb-2"
                >
                    Delete this Equipment
                </button>
            ) : (
                <>
                    <button
                        onClick={handleDeleteEquipment}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                    >
                        Yes, I'm sure
                    </button>
                    <button
                        onClick={handleToggleDelete}
                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                    >
                        No, I changed my mind
                    </button>
                </>
          )}
          </div>
          </div>
    </div>
  </div> 
    )

}

export default ProductEditForm;