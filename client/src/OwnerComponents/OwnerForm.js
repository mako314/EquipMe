import React from "react";
import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
import OwnerContext from './OwnerContext'
import ApiUrlContext from "../Api"
import { UserSessionContext } from "../UserComponents/SessionContext";

function OwnerForm({addOwner}){

    const [error, setError] = useState()
    const navigate = useNavigate()
    const apiUrl = useContext(ApiUrlContext)
    const [owner, setOwner] = useContext(OwnerContext)
    const { currentUser, role, setCurrentUser, setRole } = UserSessionContext()

    function handleLogin() {
        
      let email = formik.values.email;
      let password = formik.values.password;

      fetch(`${apiUrl}login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( { email, password } ),
        }).then((resp) => {
          if (resp.ok) {
            resp.json().then((data) => {
              setCurrentUser(data.owner)
              setRole('owner')
              navigate(`/dashboard`); // <-------- navigates to the dashboard
            });
          }
        });
  }

    const formSchema = object({
        firstName: string().required('Please enter a name'),
        email: string().required('Please enter an email address')
    })

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            location: '',
            profession: '',
            phone: '',
            email: '',
            password: '',
            profileImage: '',
            website: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${apiUrl}equipment_owners` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(owner => {
                            addOwner(owner)
                            handleLogin()
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
            
        }
    })


    return(
        <div key='signupForm' className="bg-white py-6 sm:py-8 lg:py-12">
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
        <label htmlFor="firstName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> First Name </label>
        <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div>
        <label htmlFor="lastName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Last Name </label>
        <input type="text" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="location" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Location</label>
        <input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
        <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="password" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
        <input type="text" name="password" value={formik.values.password} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="age" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Age </label>
        <input type="text" name="age" value={formik.values.age} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
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