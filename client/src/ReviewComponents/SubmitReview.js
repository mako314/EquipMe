import React from "react";

function SubmitReview({toggleModal, isModalOpen}){
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
        <div className="px-6 py-6 lg:px-8 overflow-y-auto"> 
        TEST
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