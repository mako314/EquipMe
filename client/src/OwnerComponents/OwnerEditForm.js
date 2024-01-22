import React from "react";
import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";
import {toast} from 'react-toastify'

function OwnerEditForm(){
    // READ ME READ ME READ ME
    // THIS ALMOST CONFUSED ME, BUT THIS FORM  EDITS BOTH USERS AND OWNERS

    //Need a place in the ownerProfile / Display page to allocate for this, still need to build owner signup.
    // Turns out, I can use this for both owner edit and user edit
    // https://avatarfiles.alphacoders.com/352/352560.png
    // https://avatarfiles.alphacoders.com/111/111689.jpg
    // https://avatarfiles.alphacoders.com/224/224246.png

    const [error, setError] = useState()
    const [toggleDelete, setToggleDelete] = useState(false)
    const navigate = useNavigate()
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession} = UserSessionContext()

    const formSchema = object({
        firstName: string().required('Please enter a name'),
        email: string().required('Please enter an email address')
    })

    const formik = useFormik({
        initialValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            password: '',
            country: currentUser.country,
            state: currentUser.state,
            city: currentUser.city,
            postal_code: currentUser.postal_code,
            address: currentUser.address,
            address_line_2: currentUser.address_line_2,
            date_of_birth: currentUser.date_of_birth,
            profession: currentUser.profession,
            bio: currentUser.bio,
            phone: currentUser.phone,
            email: currentUser.email,
            profileImage: currentUser.profileImage,
            website: currentUser.website
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${apiUrl}${role === 'owner' ? 'equipment_owner/':'user/'}${currentUser.id}` , {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formik.values)
            })
              .then(res =>{
                if (res.ok) {
                    res.json().then(owner => {
                        // console.log("The UPDATED Owner:", owner)
                        // updateOwner(owner)
                        toast.success(`Succesfully updated your account `,
                        {
                        "autoClose" : 2000
                        })
                        checkSession()
                        // navigate('/equipment_owners')
                    })
                } else {
                    res.json().then(error => setError(error)) //for backend errors
                }
              })
        }
    })




    // Handles deleting the account 
    const handleToggleDelete = () => {
        setToggleDelete(!toggleDelete)
      }
      
    const handleDeleteUser = async () => {
        try {
          const response = await fetch(`${apiUrl}${role === 'owner' ? 'equipment_owner/':'user/'}${currentUser.id}`, {
            method: 'DELETE',
          })
      
          if (response.ok) {
            // Should I just send them to the home screen?
            toast.success(`Succesfully Deleted your account `,
            {
              "autoClose" : 2000
            })
            navigate('/')
            window.scrollTo(0, 0)

          } else {
            // console.log("Error in the fetch!")
          }
        } catch (error) {
          // Handle fetch errors
        }
      }

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
                    {formik.errors && Object.entries(formik.errors).map(([field, error]) => <p key={field + error}>{error}</p>)}
                    {/* display errors from backend */}
                    {error && <p>{error.message ? error.message : 'An error occurred'}</p>}

                    </div>

                {/* Avatar Section */}
                <div className="mr-10 flex flex-col items-center">
                {/* The circle avatar placeholder */}
                <img src={currentUser.profileImage}  className="w-48 h-48 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold mb-4"/>
                    {/* Placeholder initial/text, e.g., "A" */}
                    Profile Image

                
                <button className="block w-full rounded-lg bg-indigo-500 px-4 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base mb-4">
                Upload Avatar
                </button>

                {/* Input for image link */}
                <input type="text" name="profileImage" value={formik.values.profileImage} onChange={formik.handleChange} placeholder="Or enter image URL" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"/>
                </div>
                
                <div>
                    <label htmlFor="firstName" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base"> First Name </label>
                    <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />

                    <label htmlFor="lastName" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base"> Last Name </label>
                    <input type="text" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />

                    <label htmlFor="phone" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base">Phone</label>
                    <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                
                    <label htmlFor="email" className="mt-4 mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
                    <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="password" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
                    <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="date_of_birth" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Date of Birth</label>
                    <input 
                        type="date" 
                        name="date_of_birth" 
                        value={formik.values.date_of_birth} 
                        onChange={formik.handleChange} 
                        className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" 
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="profession" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Profession</label>
                    <input type="text" name="profession" value={formik.values.profession} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="bio" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Bio </label>
                    <textarea type="text" name="bio" value={formik.values.bio || ''} onChange={formik.handleChange} className="w-full h-48  rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" 
                    /> 
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

                {/* <div className="sm:col-span-2">
                    <label htmlFor="profileImage" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Profile Image</label>
                    <input type="text" name="profileImage" value={formik.values.profileImage} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div> */}

                {role === 'owner' &&
                <div className="sm:col-span-2">
                    <label htmlFor="website" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Website</label>
                    <input type="text" name="website" value={formik.values.website} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>}



                <div className="flex items-center justify-between sm:col-span-2">
                <div>
                    <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">
                        Save All
                    </button>
                    {!toggleDelete ? (
                <button
                    onClick={handleToggleDelete}
                    type="button"
                    className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                >
                    Delete my Account
                </button>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => handleDeleteUser()}
                        className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                    >
                        Yes, I'm sure
                    </button>
                    <button
                        type="button"
                        onClick={handleToggleDelete}
                        className="bg-gray-500 text-white px-8 py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-4 mb-2"
                    >
                        No, I changed my mind
                    </button>
                </>
          )}
                </div>

                <span className="text-sm text-gray-500">
                    *Required
                </span>
                </div>
                </form>

            </div>
        </div> 
    )

}

export default OwnerEditForm;