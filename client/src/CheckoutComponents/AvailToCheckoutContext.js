import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserSessionContext } from '../UserComponents/SessionContext';

const AvailCheckoutNumb = createContext();

export const CartAvailProviderContext = () => useContext(AvailCheckoutNumb)

export const CartTotalNumbProvider = ({ children }) => {
  // State to simply hold the amount of items ready to be checked out in a cart
  const [availableToCheckoutNumb, setAvailableToCheckoutNumb] = useState(0)
  const { currentUser, role } = UserSessionContext()

  useEffect(() => {
    if (role === 'user'){
    calculateReadyToCheckout(currentUser.cart)
    }
  }, [currentUser]) // Recalculate whenever currentUser changes

  const calculateReadyToCheckout = (cartData) => {
    // Calculates the total items ready for checkout and displays the number in the cart svg in the navbar for users
    const totalAvailableToCheckout = cartData?.reduce((total, cart) => {
        // Iterate over cart items and filter for those with a 'both-accepted' agreement status
        const availableItems = cart.cart_item.filter(item =>
          item.agreements.some(agreement => agreement.agreement_status === 'both-accepted')
        )
      
        // Sum the quantities of the available items
        const availableQuantities = availableItems.reduce((sum, item) => {
          // console.log("THE ITEM IN THE SECOND REDUCER:", item)
          return sum + item.quantity;
        }, 0)
      
        // Add the available quantities to the running total
        return total + availableQuantities;
      }, 0) // Start the running total at 0
      
      // console.log("Total quantity of items available to checkout across all carts:", totalAvailableToCheckout)
      
      // Update the state with the new total
      setAvailableToCheckoutNumb(totalAvailableToCheckout)

  }

  return (
    <AvailCheckoutNumb.Provider value={{ availableToCheckoutNumb, setAvailableToCheckoutNumb, calculateReadyToCheckout}}>
      {children}
    </AvailCheckoutNumb.Provider>
  )
}

export default AvailCheckoutNumb;