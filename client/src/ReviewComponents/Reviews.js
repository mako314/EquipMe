import React, { useState, useContext } from 'react';
import ApiUrlContext from '../Api';
import {toast} from 'react-toastify'
import { UserSessionContext } from '../UserComponents/SessionContext';

function Reviews({stars, comment, image, firstName, lastName, profession, reviewId, onDelete, itemUserId, itemOwnerId}){

  const { currentUser, role, setCurrentUser, checkSession} = UserSessionContext() 
  const apiUrl = useContext(ApiUrlContext)
  const [toggleDelete, setToggleDelete] = useState(false)

  console.log("ITEM OWNER ID:", itemOwnerId)
  console.log("ITEM USER ID:", itemUserId)
  
  console.log("CURRENT USER ID:", currentUser?.id)

  let starDisplayer = []

  for (let i = 0; i < stars; i++) {
    starDisplayer.push (
    <img src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f195bcf37f880_Vector.svg" 
    alt="" 
    className="mr-1.5 w-4" 
    key={`star-${i}`} 
    />)
  }


  const handleDeleteReview = async (inReviewId) => {
    try {
      const response = await fetch(`${apiUrl}review/${inReviewId}/${role}`, {
        method: 'DELETE',
      })
  
      if (response.ok) {
        onDelete(inReviewId)
        // Filter out the deleted review
        const updatedReivews = currentUser.review.filter(item => item.id !== inReviewId)
        setCurrentUser(prevUser => ({
          ...prevUser,
          review: updatedReivews
        }))
        setToggleDelete(!toggleDelete)
        checkSession()
        toast.success(`💥 Review successfully deleted!`, {
          "autoClose": 2000
      })
      } else {
        console.log("Error in the fetch!")
      }
    } catch (error) {
      // Handle fetch errors
    }
  }

  const handleToggleDelete = () => {
    setToggleDelete(!toggleDelete)
  }

  {/* <div className="mb-6 grid gap-5 sm:grid-cols-2 md:grid-cols-2">
    </div> */}

    return(
<div className="grid border border-solid border-[#dfdfdf] bg-white p-8 md:p-10">
  <div className="flex justify-between mb-4">
    <div className="flex"> {/* Ensure this div has `flex` to layout stars horizontally */}
      {starDisplayer}
    </div>

    {((role === 'user' && currentUser?.id === itemUserId) || (role === 'owner' && currentUser?.id === itemOwnerId)) &&
    <button onClick={handleToggleDelete} className="ml-4 self-start">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
    }


  </div>
  <p className="text-[#647084]">{comment}</p>
  <div className="flex mt-4">
    <img src={image} alt="" className="mr-4 h-16 w-16 rounded-full" />
    <div className="flex flex-col justify-center">
      <h6 className="font-bold">{firstName} {lastName}</h6>
      <p className="text-sm text-[#636262]">{profession}</p>
    </div>
  </div>


  {toggleDelete && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 overflow-y-auto h-full w-full" onClick={() => setToggleDelete(false)}>
      <div className="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Are you sure you want to delete this item?</h3>
        <div className="mt-2">
          <button
            onClick={() => handleDeleteReview(reviewId)}
            className="mr-2 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
          >
            Yes, Remove This Review.
          </button>
          <button
            onClick={handleToggleDelete}
            className="rounded bg-gray-500 py-2 px-4 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    )
}

export default Reviews;