import React from "react";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"
import { object, string, number } from 'yup'

function RentalForm({ addRentalAgreement, owners, equipmentArray, featuredRental }) {
    const [error, setError] = useState()
    const [rentFrom, setRentFrom] = useState("")
    const [locRent, setLocRent] = useState("")
    const [selectFrom, setSelectFrom] = useState([])

    const navigate = useNavigate()
    console.log(featuredRental[0].location)

    const formSchema = object({
        location: string().required('We need your coordinates Masterchief'),
        total_price: number().positive().required('You must enter a positive offer.'),
        user_id: string().required('Please select who you would like to rent from.')
    })

    //user POST
    const formik = useFormik({
        initialValues: {
            location: featuredRental[0].location,
            total_price: '',
            rental_dates: '',
            owner_id: featuredRental[0].owner_name,
            user_id: '',
            equipment_id: featuredRental[0].id
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('http://127.0.0.1:5555/rental_agreements', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
                .then(res => {
                    if (res.ok) {
                        res.json().then(user => {
                            addRentalAgreement(user)
                            navigate('/rental_agreements')
                        })
                    } else {
                        res.json().then(error => setError(error)) //for backend errors
                    }
                })
        }
    })

    // const mappedOwnerSelect = owners.map((owner) => (
    //     <option key={owner.id} value={owner.id}> {owner.name}</option>
    //     // can match up with name maybe
    // ))
    // // key needed here or error.

    const handleOwnerFilter = (event) => {
        formik.handleChange(event);
        setRentFrom(event.target.value);
    }

    // const handleLocationFilter = (event) => {
    //     formik.handleChange(event);
    //     setLocRent(event.target.value);
    // }

    //it's not fucked, but I don't think it matters what you put as your company name or actual name, you'll always get benjamin davis. hopefully we can work out the quirks





    // const mappedEquipmentSelect = selectFrom.map((equipment) => (
    //     <option value={equipment.id}> Make: {equipment.make}  Model: {equipment.model}</option>
    // ))

    // useEffect(() => {
    //     fetch(`http://127.0.0.1:5555/all_equipment/${rentFrom}`)
    //         .then((resp) => resp.json())
    //         .then((data) => {
    //             setSelectFrom(data)
    //         })
    // }, [rentFrom])




    // <form className="form" onSubmit={formik.handleSubmit}> FOR THE LOVE OF GOD INCLUDE THE SUBMIT IN THE FORM
    // MAKE 2 FORM COMPONENTS, CONDITIONALLY RENDER THOSE 2


    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

    <div className="mb-10 md:mb-16">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Ready to List?</h2>

      <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Get listing in a few simple steps!</p>
    </div>

    <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
      
          {/* display errors from formik/yup */}
          { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
          {/* display errors from backend */}
          {error && <p>{error}</p>}
      
      <div>
        <label htmlFor="location" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Location </label>
        <input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="phone" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Phone</label>
        <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="total_price" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Total Price</label>
        <input type="text" name="total_price" value={formik.values.total_price} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="rental_dates" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Rental Dates</label>
        <input type="text" name="rental_dates" value={formik.values.rental_dates} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
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

export default RentalForm;


// {/* <div className="bg-white py-6 sm:py-8 lg:py-12">
//   <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

//     <div className="mb-10 md:mb-16">
//       <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Ready to List?</h2>

//       <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"> Get listing in a few simple steps!</p>
//     </div>

//     <form onSubmit={formik.handleSubmit} className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
      
//           {/* display errors from formik/yup */}
//           { formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>) }
//           {/* display errors from backend */}
//           {error && <p>{error}</p>}
      
//       <div>
//         <label htmlFor="name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Name </label>
//         <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
//       </div>

//       <div className="sm:col-span-2">
//         <label htmlFor="location" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Location</label>
//         <input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
//       </div>

//       <div className="sm:col-span-2">
//         <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
//         <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
//       </div>

//       <div className="sm:col-span-2">
//         <label htmlFor="phone" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Phone</label>
//         <input type="text" name="phone" value={formik.values.phone} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
//       </div>

//       <div className="sm:col-span-2">
//         <label htmlFor="profession" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Profession</label>
//         <input type="text" name="profession" value={formik.values.profession} onChange={formik.handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
//       </div>


//       <div className="flex items-center justify-between sm:col-span-2">

//         {/* NEED TO CHANGE COLOR */}
//         <button type="submit" className="inline-block rounded-lg bg-orange-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"> Sign Up!</button>

//         <span className="text-sm text-gray-500">*Required</span>
//       </div>
//     </form>

//   </div>
// </div> */}



// <div className="form-container">
//             <form className="form" onSubmit={formik.handleSubmit}>
//                 <div className="signup-form"> */}

                    {/* display errors from formik/yup */}
                    {/* {formik.errors && Object.values(formik.errors).map(e => <p>{e}</p>)} */}

                    {/* display errors from backend */}
                    {/* {error && <p>{error}</p>} */}

                    {/* <div className="submit-form">
                        <label>Location: </label>
                        <input
                            type="text"
                            name="location"
                            value={formik.values.location = featuredRental[0].location}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Total Price $:  </label>
                        <input
                            type="text"
                            name="total_price"
                            value={formik.values.total_price}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Rental Dates: </label>
                        <input
                            type="text"
                            name="rental_dates"
                            value={formik.values.rental_dates}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>My Name or Company: </label>
                        <input
                            type="text"
                            name="user_id"
                            value={formik.values.user_id}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Owner: </label>
                        <input
                            type="text"
                            name="owner_id"
                            value={formik.values.owner_id = featuredRental[0].owner_name}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="submit-form">
                        <label>Equipment ID: </label>
                        <input
                            type="text"
                            name="equipment_id"
                            value={formik.values.equipment_id = featuredRental[0].id}
                            onChange={formik.handleChange}
                        />
                    </div>





                </div>
                <input type='submit' className="submit-btn" />
            </form>
        </div> */}