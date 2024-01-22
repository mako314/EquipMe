import React from "react";
import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
// import OwnerContext from './OwnerContext'
import ApiUrlContext from "../Api"
import { UserSessionContext } from "../UserComponents/SessionContext";

function OwnerForm({addOwner}){
    const [showLinkCheckbox, setShowLinkCheckbox] = useState(false)
    const [error, setError] = useState()
    const navigate = useNavigate()
    const apiUrl = useContext(ApiUrlContext)
    const [loading, setLoading] = useState(false)
    // const [owner, setOwner] = useContext(OwnerContext)
    const { currentUser, role, setCurrentUser, setRole } = UserSessionContext()

    // https://formik.org/docs/api/formik#setfieldvalue-field-string-value-any-shouldvalidate-boolean--promisevoid--formikerrors
    const handleOwnerConsentChange = (e) => {
      formik.handleChange(e) // update formik state
      setShowLinkCheckbox(e.target.value === 'yes') // show or hide the checkbox
    }

    function handleLogin(stripe_onboard_link = null) {
      // console.log("Stripe Onboard Link:", stripe_onboard_link)
      // setLoading(true)
      let email = formik.values.email
      let password = formik.values.password
      let create_link = formik.values.create_link


      fetch(`${apiUrl}login`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( { email, password } ),
        }).then((resp) => {
          if (resp.ok) {
            resp.json().then((data) => {
              // console.log("LOGIN DATA:", data)
              setCurrentUser(data.owner)
              setRole(data.role)
              // console.log("the type of data the role is:", typeof(data.role))
              if (stripe_onboard_link && create_link === 'yes') {
                // Open the Stripe onboard link in a new tab
                // console.log("Stripe Onboard Link:", stripe_onboard_link)
                // window.open(stripe_onboard_link, '_blank')
                // Open stripe in same tab, leads to dashboard after completion
                window.location.href = stripe_onboard_link
                // window.location.href = "https://google.com"
                setLoading(false)
              } else {
                // If there's no Stripe onboard link, navigate to the dashboard
                navigate(`/dashboard`)
                setLoading(false)
              }
            })
          }
        })
  }

    const formSchema = object({
        firstName: string().required('Please enter a name'),
        email: string().required('Please enter an email address')
    })

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            country:'',
            state:'',
            city:'',
            postal_code: '',
            address:'',
            address_line_2:'',
            date_of_birth:'',
            profession: '',
            bio: '',
            phone: '',
            email: '',
            password: '',
            profileImage: '',
            website: '',
            owner_consent: '',
            create_link: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
          setLoading(true)
            fetch(`${apiUrl}equipment_owners` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(data => {
                            addOwner(data.owner)
                            // console.log("THE OWNER DATA:", data.owner)
                            handleLogin(data.stripe_onboard_link)
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
            
        }
    })


    return(
        <div key='signupForm' className="bg-white py-6 sm:py-8 lg:py-12">
        {loading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-white text-lg">Creating your Account...</p>
            </div>
          </div>
        )}
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
        <label htmlFor="firstName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> First Name </label>
        <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div>
        <label htmlFor="lastName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Last Name </label>
        <input type="text" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
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
          <label htmlFor="bio" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Tell us about yourself! </label>
          <textarea type="text" name="bio" value={formik.values.bio} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" 
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

      <div className="sm:col-span-2">
        <label htmlFor="phone" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Phone</label>
        <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="profession" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Profession</label>
        <input type="text" name="profession" value={formik.values.profession} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="profileImage" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Profile Image URL</label>
        <input type="text" name="profileImage" value={formik.values.profileImage} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="website" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Website</label>
        <input type="text" name="website" value={formik.values.website} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>


      <div className="sm:col-span-2">
        <label className="text-gray-800 sm:text-base">Would you like to create a Stripe Connect upon Signing up?</label>
      <div className="flex items-center">
          <input type="radio" name="owner_consent" value="yes" checked={formik.values.owner_consent === 'yes'} onChange={handleOwnerConsentChange} />
          <label htmlFor="owner_consent_yes" className="ml-2 text-sm text-gray-800 sm:text-base">Yes</label>
      </div>

      <div className="flex items-center">
          <input type="radio" name="owner_consent" value="no" checked={formik.values.owner_consent === 'no'} onChange={handleOwnerConsentChange} />
          <label htmlFor="owner_consent_no" className="ml-2 text-sm text-gray-800 sm:text-base">No</label>
      </div>
    
        {showLinkCheckbox && (
        <>
          <br/>
          <input type="checkbox" name="create_link" checked={formik.values.create_link === 'yes'} onChange={(e) => formik.setFieldValue('create_link', e.target.checked ? 'yes' : 'no')} />
          <label htmlFor="create_link" className="ml-2 text-sm text-gray-800 sm:text-base">Yes, and take me to complete my stripe onboarding now</label>
          <p className=" text-xs text-gray-800 sm:text-base"> 
          **
          <br/>
          Checking this box will open the stripe onboarding process in the same tab, after completion you'll be taken to your dashboard
          </p>
        </>
      )}

      </div> 


      <div className="flex items-center justify-between sm:col-span-2">
        {/* NEED TO CHANGE COLOR */}
        <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"> Sign Up!</button>

        <span className="text-sm text-gray-500">*Required</span>
      </div>
    </form>

  </div>
</div>
    )
}

export default OwnerForm;


// <form className="form" onSubmit={formik.handleSubmit}>
//                 <div className="signup-form">
                    
                    {/* display errors from formik/yup */}
                    // { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
                    
                    {/* display errors from backend */}
                    // {error && <p>{error}</p>}

                    {/* <div className="submit-form"> 
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

            </form> */}