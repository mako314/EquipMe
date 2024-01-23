import * as React from 'react';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';



// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// https://stackoverflow.com/questions/42173786/react-router-pass-data-when-navigating-programmatically
const stripe_key=`${process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY}`
// console.log("THE STRIPE KEY:",stripe_key)
const stripePromise = loadStripe(stripe_key)

const StripeCheckout = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const location = useLocation()
  const { clientSecret } = location.state || {}
  // console.log("CLIENT SECRET:?", clientSecret)
  const options = {clientSecret}

  return (
    <div className='mt-6 mb-6'> 
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={options}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
    </div>
  )

}

export default StripeCheckout