const stripe = require('stripe')('sk_test_51NWaDzLMk7mdm7YPxSXwQkuoD4JtfO5IzxnwD8xGn4a94afKjV6UszROohOUcsusuA4KN3Vy2W0xjERFCPnziEv400yIpA51tI');
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = 'whsec_0b2be36f22517c4b15a4f88d4392785fc2a3c262d437d3a100193e78de3b777b';
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

// This is the endpoint called by the client to start a payment
app.post('/start-payment', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // amount in cents
        currency: 'usd'
    });

    res.json(paymentIntent.client_secret);
});

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    let event = request.body;
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));