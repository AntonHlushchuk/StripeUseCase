import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 1. Create a basic CardElement component
function CardComponent() {
    const CARD_OPTIONS = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const card = elements.getElement(CardElement);

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement options={CARD_OPTIONS} />
            <button type="submit" disabled={!stripe}>Pay</button>
        </form>
    );
}

// 2. Create a HOC to handle Stripe API errors
const withStripeErrorHandling = WrappedComponent => {
    return class extends React.Component {
        componentDidCatch(error, info) {
            if(error.type === 'StripeError') {
                // handle Stripe errors here
                console.log('Caught a Stripe error: ', error.message);
            } else {
                // handle other errors normally
                super.componentDidCatch(error, info);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
};

// 3. Wrap our CardComponent in the HOC
const CardComponentWithErrorHandling = withStripeErrorHandling(CardComponent);

export default CardComponentWithErrorHandling;
