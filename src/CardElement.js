import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

function CardComponent() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        const { data: clientSecret } = await axios.post('http://localhost:4242/start-payment');

        const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card }
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentIntent]', paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay</button>
        </form>
    );
}

const withStripeErrorHandling = (WrappedComponent) => (props) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const errorHandler = (err) => {
            if(err.type === 'StripeError') {
                setError(err);
                console.log('Caught a Stripe error: ', err.message);
            }
        }
        window.addEventListener('error', errorHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
        }
    }, []);

    if (error) {
        console.log('Caught other error: ', error.message)
    }

    return <WrappedComponent {...props} />;
};

const CardComponentWithErrorHandling = withStripeErrorHandling(CardComponent);

export default CardComponentWithErrorHandling;
