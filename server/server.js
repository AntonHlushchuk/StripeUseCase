const express = require('express');
const stripe = require('stripe')('sk_test_51NWaDzLMk7mdm7YPxSXwQkuoD4JtfO5IzxnwD8xGn4a94afKjV6UszROohOUcsusuA4KN3Vy2W0xjERFCPnziEv400yIpA51tI');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/payment', async (req, res) => {
    try {
        let {amount, id} = req.body;
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'USD',
            description: 'Your Company Description',
            payment_method: id,
            confirm: true
        });

        console.log("Payment", payment);
        res.json({
            message: 'Payment successful',
            success: true
        });
    } catch (error) {
        console.log("Error", error);
        res.json({
            message: 'Payment failed',
            success: false
        });
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});