import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, IbanElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51NWaDzLMk7mdm7YPyY3KabnUjCcgWGMVfwRETpz0Tb7saXfBv4wnS54jM56HGBA3HpLglg5ds405jDiTf69J5Ro300NSvanGl8');

const options = {
    supportedCountries: ['SEPA'],
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

export const ExpressCheckoutElement = ({ handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <IbanElement options={options} />
            <button type="submit">
                Iban Pay
            </button>
        </form>
    );
}


const CheckoutElement = ({children, handleSubmit}) => (
    <Elements stripe={stripePromise}>
        <ExpressCheckoutElement handleSubmit={handleSubmit}>
            {children}
        </ExpressCheckoutElement>
    </Elements>
);


export const withStripeErrorHandling = (WrappedComponent) => {
    return function WithStripeErrorHandlingComponent(props) {
        const stripe = useStripe();
        const elements = useElements();

        const handleSubmit = useCallback(async (event) => {
            event.preventDefault();

            if (!stripe || !elements) {
                return;
            }

            const ibanElement = elements.getElement(IbanElement);

            const response = await fetch('http://localhost:4242/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: 1000 }) // amount in the smallest currency unit (e.g., cent for euro)
            });

            const data = await response.json();
            const clientSecret = data.clientSecret;

            if (clientSecret) {
                const {error, paymentIntent} = await stripe.confirmSepaDebitPayment(clientSecret, {
                    payment_method: {
                        sepa_debit: ibanElement,
                        billing_details: {
                            name: 'John Wick',
                            email: 'john@mail.com',
                        },
                    }
                });

                if (error) {
                    console.log('[error]', error);
                } else {
                    console.log('[PaymentMethod]', paymentIntent);
                }
            }
        }, [stripe, elements]);

        return <WrappedComponent {...props} handleSubmit={handleSubmit} />
    };
};

const EnhancedCheckoutElement = withStripeErrorHandling(CheckoutElement);

export default EnhancedCheckoutElement;
