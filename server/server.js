const express = require('express');
const stripe = require('stripe')('sk_test_51NWaDzLMk7mdm7YPxSXwQkuoD4JtfO5IzxnwD8xGn4a94afKjV6UszROohOUcsusuA4KN3Vy2W0xjERFCPnziEv400yIpA51tI');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(
    helmet({
        hidePoweredBy: { setTo: 'NodeJS' }, // Customize the X-Powered-By header (optional)
    })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend domain
    methods: 'GET, POST, PUT, DELETE', // Specify allowed methods
    allowedHeaders: 'Content-Type', // Specify allowed headers
}));

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd"
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});