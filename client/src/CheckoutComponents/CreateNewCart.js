import React,{useState, useContext, useEffect} from "react";
import ApiUrlContext from "../Api";
import {toast} from 'react-toastify'
import { UserSessionContext } from "../UserComponents/SessionContext";

function CreateNewCart({addCart, toggleModal, setCurrentCart}){

  const { currentUser, role, checkSession } = UserSessionContext() 
  const apiUrl = useContext(ApiUrlContext)
  const [cartName, setCartName] = useState('')
  // const [cartStatus, setCartStatus] = useState('')
  

//   console.log("CART CURRENT USER:",currentUser)
//   console.log("CART CURRENT ROLE:",role)

  // useEffect(() => {
  //     fetch(`${apiUrl}check_session`).then((response) => {
  //       if (response.ok) {
  //         response.json().then((user) => setUser(user))
  //       }
  //     })
  //   }, [])


  const handleCartCreation = async () => {
    
    if (role !== 'user') {
    toast.warn(`🛒 We don't currently support owner cart creation`,{
    "autoClose" : 30000
    })
    } 

    const new_cart ={
      'total' : 0,
      'cart_name' : cartName,
      'cart_status' : 'ACTIVE',
      'created_at': new Date().toISOString(),
      'user_id' : currentUser?.id
    }
      try {
        const resp = await fetch(`${apiUrl}carts`, {
            method: "POST",
            body: JSON.stringify(new_cart),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            throw new Error('Failed to create new cart')
        }
        const createdCart = await resp.json()
        // console.log("THE NEW CART:", createdCart)
        addCart(createdCart)
        toggleModal()
        checkSession()

        toast.success(`🛒 ${cartName}, successfully created!`, {
            "autoClose": 2000
        })
    } catch (error) {
        console.error("Error creating cart:", error)

    }
  }

  return(
      <div className="bg-white p-4 rounded-lg shadow w-full max-w-xs mx-auto">
          <div className="mb-4">
          <input
              className="w-full p-2 mb-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="Cart Name"
          />
          </div>
          <button
          className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
          onClick={handleCartCreation}
          >
          Create Cart
          </button>

          <button 
              onClick={toggleModal} 
              type="button" 
              className="absolute top-3 right-2.5 text-white bg-blue-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
              X 
          </button>
      </div>
  )
}

export default CreateNewCart