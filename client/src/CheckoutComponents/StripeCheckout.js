import * as React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripe_key=process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
console.log("THE STRIPE KEY:",stripe_key)
const stripePromise = loadStripe(stripe_key)

const StripeCheckout = ({clientSecret}) => {
  const options = {clientSecret}

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={options}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

export default StripeCheckout