import React, { useContext, useState, useEffect } from 'react'

function AddToCartModal(){
  
  const [quantity, setQuantity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
}

const decrementQuantity = () => {
  if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
  }
}

const incrementQuantity = () => {
  setQuantity(prevQuantity => prevQuantity + 1)
}

//   function handleAddToCartClick() {
        
//     let email = formik.values.email;
//     let password = formik.values.password;

//     fetch(`${apiUrl}cart/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify( { email, password } ),
//       }).then((resp) => {
//         if (resp.ok) {
//           resp.json().then((user) => {
//             setUser(user)
//             navigate(`/user/profile/${user.id}`); // <-------- navigates to the profile
//           });
//         }
//       });
// }


    return(
      <> 
      <button onClick={toggleModal} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
      Add to Cart
      </button>
      {isModalOpen && (
      <div 
          id="authentication-modal" 
          tabIndex="-1" 
          aria-hidden="true" 
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto"
      >
          <div className="relative w-full max-w-2xl max-h-3/5 bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto">
              <div className="">
                  <button 
                      onClick={toggleModal} 
                      type="button" 
                      className="absolute top-3 right-2.5 text-white bg-blue-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                      X 
                  </button>
      
                  <div className="px-6 py-6 lg:px-8 overflow-y-auto">
                      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">My Cart</h3>
                      <div className="space-y-6 " action="#">
                          <div className="flex justify-between">
                              <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                      {/* Checkbox*/}
                                  </div>
                                  <label 
                                      htmlFor="remember" 
                                      className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                      Make sure you've selected the correct rate! 
                                  </label>
                              </div>
                          </div>

                          {/* Cart Container Div */}
                          <div className="space-y-6 overflow-y-auto max-h-96">

                                <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                {/* Image Preview */}
                                <img src="https://www.ptsworks.com/wp-content/uploads/2020/02/heavy-construction-equipment-types.jpg" alt="product-image" className="w-full rounded-lg sm:w-40" />

                                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                    {/* Product Details */}
                                    <div className="mt-5 sm:mt-0">
                                        <h2 className="text-lg font-bold text-gray-900">Heavy Construction Equipment</h2>
                                        {/* Additional details like size or color can go here */}
                                        <p className="mt-1 text-xs text-gray-700">Various Models</p>
                                    </div>

                                    {/* Quantity and Price */}
                                    <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                        <div className="flex items-center border-gray-100">
                                            {/* Quantity Adjustment */}
                                            <span
                                                className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-white"
                                                onClick={decrementQuantity}
                                            >
                                                -
                                            </span>
                                            <input 
                                                  className="h-8 w-8 border bg-white text-center text-xs outline-none"
                                                  type="number"
                                                  value={quantity}
                                                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                                                  min="1" />
                                           <span
                                              className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                                              onClick={incrementQuantity}
                                          >
                                              +
                                          </span>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {/* Price */}
                                            <p className="text-sm">Price Here</p>
                                            {/* Delete Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grab this for the map */}
                            <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                {/* Image Preview */}
                                <img src="https://www.ptsworks.com/wp-content/uploads/2020/02/heavy-construction-equipment-types.jpg" alt="product-image" className="w-full rounded-lg sm:w-40" />

                                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                    {/* Product Details */}
                                    <div className="mt-5 sm:mt-0">
                                        <h2 className="text-lg font-bold text-gray-900">Heavy Construction Equipment</h2>
                                        {/* Additional details like size or color can go here */}
                                        <p className="mt-1 text-xs text-gray-700">Various Models</p>
                                    </div>

                                    {/* Quantity and Price */}
                                    <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                        <div className="flex items-center border-gray-100">
                                            {/* Quantity Adjustment */}
                                            <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-white"> - </span>
                                            <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" defaultValue="1" min="1" />
                                            <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"> + </span>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {/* Price */}
                                            <p className="text-sm">Price Here</p>
                                            {/* Delete Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Grab this for the map */}

                          </div>
                          {/* Cart Container Div */}

                          <div className="flex justify-end">
                              <button 
                                  // type="submit" 
                                  // onClick={handleSendMessage}
                                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                  Add to Cart
                              </button>
                          </div>
                          
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-300">
                              * You will have another chance to edit your carts contents  
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      )}
      </>
    )
}

export default AddToCartModal