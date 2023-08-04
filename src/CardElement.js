import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#32325d"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    }
};

export function CardComponent() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        const response = await fetch('http://localhost:4242/start-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log('[error]', response.statusText);
            return;
        }

        const { clientSecret } = await response.json();

        if (clientSecret) {
            const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card }
            });

            if (error) {
                console.log('[error]', error);
            } else {
                console.log('[PaymentIntent]', paymentIntent);
            }
        }
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        border: '1px solid #ccc',
        padding: '20px',
    };

    const cardElementContainerStyle = {
        height: '50px',
        width: '300px',
        marginBottom: '20px',
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div style={cardElementContainerStyle}>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
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
