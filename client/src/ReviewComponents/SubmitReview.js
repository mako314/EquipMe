import React, {useState, useContext, useEffect} from "react";
import ApiUrlContext from '../Api'
import { UserSessionContext } from "../UserComponents/SessionContext";
import {toast} from 'react-toastify'


function SubmitReview({toggleReviewModal, isModalOpen, renterId, ownerId, rentalId, renterFirstName, renterLastName, ownerFirstName, ownerLastName, existingReviews}){
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession } = UserSessionContext()

    const [starAmount, setStarAmount] = useState(0)
    const [reviewComment, setReviewComment] = useState('')
    

    const postedReview = existingReviews?.find((review) => review.reviewer_type === role)
    // console.log("REVIEW THAT WAS POSTED:", postedReview)
    // console.log("RENTER ID:", renterId)
    // console.log("OWNER ID:", ownerId)

    // console.log("THE REVIEW COMMENT:", reviewComment)
    // console.log("THE STAR AMOUNT:", starAmount)

    useEffect(() => {
      if (postedReview && postedReview.review_comment !== undefined && postedReview.review_stars !== undefined) {
        setReviewComment(postedReview.review_comment)
        setStarAmount(postedReview.review_stars)
      }
    }, [postedReview, toggleReviewModal])

    function handleReviewSubmission() {
         if(reviewComment ===''){
          return toast.warn(`📝 Please leave a comment greater than 0 characters.`,
          {
          "autoClose" : 2000
          })
        }

        if(starAmount === 0){
            return toast.warn(`⭐ Star amount must be at least 1.`,
            {
            "autoClose" : 2000
            })
          }
        

        // I could probably also make this a ternary and make the patch smaller, but I don't think it'll be needed
        let newReview ={
          'review_stars': starAmount,
          'review_comment' : reviewComment,
          'reviewer_type' : role,
          'agreement_id' : rentalId,
          'user_id' : renterId,
          'owner_id' : ownerId
        }

        //Conditional for fetchin
        let reviewMethod = postedReview ? "PATCH" : "POST"

        let patchURLs = postedReview && role === 'user' ? `user/${currentUser?.id}/review/${postedReview?.id}/` : `/owner/${currentUser?.id}/review/${postedReview?.id}/`

        let reviewUrl = postedReview ? patchURLs : `${apiUrl}review`

        // console.log('REVIEW COMMENT INSIDE OF THE FETCH:', reviewComment)
    
        fetch(reviewUrl, {
            method: reviewMethod,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReview),
          }).then((resp) => {
            if (resp.ok) {
              resp.json().then((newReviewData) => {
                // console.log(newReviewData)
                postedReview ?
                toast.success(`✅ Succesfully edited the review you left ${role === 'owner' ? `${renterFirstName} ${renterLastName}` : `${ownerFirstName} ${ownerLastName}` } `,
                {
                  "autoClose" : 2000
                })
                : 
                toast.success(`✅ Succesfully left ${role === 'owner' ? `${renterFirstName} ${renterLastName}` : `${ownerFirstName} ${ownerLastName}` } a review`,
                {
                  "autoClose" : 2000
                }) 

                checkSession()
              })
            } else {
              console.log(resp.error)
              return toast.warn(`2️⃣ We do not allow duplicate reviews, please update or delete your previous one.`,
            {
            "autoClose" : 2000
            })
            }
          })
      }

      const reviewCommentHandler = (e) => {
        setReviewComment(e.target.value)
      }

    //   const reviewStarHandler = (e) => {
    //     setStarAmount(e.target.value)
    //     console.log(e.target.value)
    //     console.log(starAmount)
    //   }

      let starDisplayer = []

      const starFull = "https://static.thenounproject.com/png/626304-200.png" // Gold star image URL
      const starEmpty = "https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f195bcf37f880_Vector.svg" // Grey star image URL

      //Same one used in owner display reviews, just simply taking the amount of 5, and letting it push that many into star displayer. Test whether or not >= the index, and from there filling the star.

      for (let i = 1; i <= 5; i++) {
        starDisplayer.push (
        <img src= {starAmount >= i ? starEmpty : starFull}
        alt="" 
        className="mr-1.5 w-4 cursor-pointer"
        onClick={ () => {
        // console.log(`Setting star amount to ${i}`) // Star count
        setStarAmount(i)}}
        key={`star-${i}`} 
        />)
      }


      // console.log(starAmount)



    return(
        <> 
        <button onClick={toggleReviewModal} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        {postedReview ? 'Edit my Review' : 'Leave a Review'}
        </button>

    <div>
            {isModalOpen && (
      <div 
          id="authentication-modal" 
          tabIndex="-1" 
          aria-hidden="true" 
          onClick={() => {
            toggleReviewModal()
            setStarAmount(0)
            setReviewComment('')
          }} 
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto"
      >
          <div className="relative w-full max-w-2xl max-h-3/5 bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="">
                  <button 
                      onClick={() => {
                        toggleReviewModal()
                        setStarAmount(0)
                        setReviewComment('')
                      }} 
                      type="button" 
                      className="absolute top-3 right-2.5 text-white bg-blue-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                      X 
        </button>
        {/* ACTUAL CONTENT DIV */}
        <div className="px-6 py-6 lg:px-8 overflow-y-auto">
        <label htmlFor="stars" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Rating 1-5 </label>
        <div className="flex mb-6">
            {starDisplayer}
        </div>
        

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-2 inline-block text-sm text-gray-800 sm:text-base"> Review Comment</label>
          <textarea 
          type="text" 
          name="description" 
          value={reviewComment} 
          onChange={reviewCommentHandler} 
          className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" 
          > </textarea>
        </div>

        <div className="flex justify-end">
        <button 
            // type="submit" 
            // onClick={handleSendMessage}
            onClick={handleReviewSubmission}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Submit Review
        </button>
        </div>
        {/* ACTUAL CONTENT DIV */}
        </div>

              </div>
          </div>
          
      </div>
      )}
    </div>
    </>
    )
}

export default SubmitReview