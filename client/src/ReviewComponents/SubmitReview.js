import React, {useState, useContext} from "react";
import ApiUrlContext from '../Api'
import { UserSessionContext } from "../UserComponents/SessionContext";
import {toast} from 'react-toastify'


function SubmitReview({toggleModal, isModalOpen}){
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession } = UserSessionContext()

    const [starAmount, setStarAmount] = useState(0)
    const [reviewComment, setReviewComment] = useState('')

    function handleReviewSubmission() {
         if(reviewComment ===''){
          return toast.warn(`📝 Please leave a comment greater than 0 characters.`,
          {
          "autoClose" : 2000
          })
        }
        let newReview ={
          'review_comment' : reviewComment,
          'reviewer_type' : role,
          'created_at': '',
          'updated_at': '',
          'user_id' : '',
          'owner_id' : ''
        }
    
        fetch(`${apiUrl}review`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReview),
          }).then((resp) => {
            if (resp.ok) {
              resp.json().then((newReviewData) => {

                console.log(newReviewData)

              })
            } else {
              console.log(resp.error)
            }
          })
      }

      const reviewCommentHandler = (e) => {
        setReviewComment(e.target.value)
      }



    return(
        <> 
        <button onClick={toggleModal} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Submit Review
        </button>

    <div>
            {isModalOpen && (
      <div 
          id="authentication-modal" 
          tabIndex="-1" 
          aria-hidden="true" 
          onClick={toggleModal}
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto"
      >
          <div className="relative w-full max-w-2xl max-h-3/5 bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="">
                  <button 
                      onClick={toggleModal} 
                      type="button" 
                      className="absolute top-3 right-2.5 text-white bg-blue-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                      X 
        </button>
        {/* ACTUAL CONTENT DIV */}
        <div className="px-6 py-6 lg:px-8 overflow-y-auto"> 


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