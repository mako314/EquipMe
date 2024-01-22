import React from "react";
import { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import { object, string, number} from 'yup'
// import  UserContext  from './UserContext';
import { UserSessionContext } from "./SessionContext";
import ApiUrlContext from "../Api";

function UserForm({ addUser }){
    const [error, setError] = useState()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // https://github.com/ErrorPro/react-google-autocomplete/issues/227
    // https://github.com/ErrorPro/react-google-autocomplete/blob/HEAD/docs/formik.js
    // https://www.npmjs.com/package/react-google-autocomplete
    // Was going to use the above, but honestly, I'd rather keep the packages / libraries small for this project, close it up and start on a new one. 

    // const [user, setUser] = useContext(UserContext)
    const { currentUser, role, setCurrentUser, setRole } = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)


    //Going to bring handleLogin so you're logged in when this fires off
    function handleLogin() {
        
        let email = formik.values.email;
        let password = formik.values.password;

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
                setCurrentUser(data.user)
                setLoading(false)
                setRole(data.role)
                navigate(`/dashboard`) // <-------- navigates to the profile
              })
            }
          })
    }

    const formSchema = object({
        firstName: string().required('Please enter a name'),
        // age: number().positive().required('You must be 18 years or older to sign up'),
        email: string().required('Please enter an email address')
    })

    //user POST
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            // age: '',
            email: '',
            password: '',
            phone: '',
            // location: '',
            country:'',
            state:'',
            city:'',
            postal_code: '',
            address:'',
            address_line_2:'',
            date_of_birth:'',
            postal_code:'',
            profession: '',
            bio: '',
            profileImage: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
          setLoading(true)
            fetch(`${apiUrl}users` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok){
                        res.json().then(user => {
                            addUser(user)
                            handleLogin()
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
        }
    })




    // <form className="form" onSubmit={formik.handleSubmit}> FOR THE LOVE OF GOD INCLUDE THE SUBMIT IN THE FORM
    // MAKE 2 FORM COMPONENTS, CONDITIONALLY RENDER THOSE 2


    return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
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
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">You're One Step Closer to Renting!</h2>

      <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Get renting in a few simple steps</p>
    </div>

    <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {/* display errors from formik/yup */}
          {formik.errors && Object.entries(formik.errors).map(([field, error]) => <p key={field + error}>{error}</p>)}
          {/* display errors from backend */}
          {error && <p>{error}</p>}
        </div>
      
      <div className="">
        <label htmlFor="firstName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> First Name </label>
        <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="">
        <label htmlFor="lastName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Last Name </label>
        <input type="text" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
        <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="phone" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Phone </label>
        <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="password" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Password </label>
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
          > </textarea>
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
        <label htmlFor="profession" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Profession</label>
        <input type="text" name="profession" value={formik.values.profession} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="profileImage" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Profile Image URL </label>
        <input type="text" name="profileImage" value={formik.values.profileImage} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
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

export default UserForm;