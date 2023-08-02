import React, { useCallback } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51NWaDzLMk7mdm7YPyY3KabnUjCcgWGMVfwRETpz0Tb7saXfBv4wnS54jM56HGBA3HpLglg5ds405jDiTf69J5Ro300NSvanGl8');

const CheckoutElement = ({children}) => (
    <Elements stripe={stripePromise}>
        {children}
    </Elements>
);


const withStripeErrorHandling = (WrappedComponent) => {
    return function WithStripeErrorHandlingComponent(props) {
        const stripe = useStripe();
        const elements = useElements();

        const handleSubmit = useCallback(async (event) => {
            event.preventDefault();

            if (!stripe || !elements) {
                return;
            }

            const cardElement = elements.getElement(CardElement);

            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                console.log('[error]', error);
            } else {
                console.log('[PaymentMethod]', paymentMethod);
            }
        }, [stripe, elements]);

        return <WrappedComponent {...props} handleSubmit={handleSubmit} />
    };
};

const EnhancedCheckoutElement = withStripeErrorHandling(CheckoutElement);

export default EnhancedCheckoutElement;
