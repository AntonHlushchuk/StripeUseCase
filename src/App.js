import './App.css';
import React from 'react';
import CheckoutForm from './CheckoutForm';
import CardComponentWithErrorHandling from "./CardElement";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51NWaDzLMk7mdm7YPyY3KabnUjCcgWGMVfwRETpz0Tb7saXfBv4wnS54jM56HGBA3HpLglg5ds405jDiTf69J5Ro300NSvanGl8');

export default function App() {
  return (
      <Elements stripe={stripePromise}>
          <CardComponentWithErrorHandling />
        {/*<CheckoutForm />*/}
      </Elements>
  );
};
