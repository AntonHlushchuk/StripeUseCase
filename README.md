Sure, here is an updated `README.md` file:

---

# Stripe Payment Integration in React

## Application Description

This application demonstrates how to use the Stripe API with a React application to make payments. It features a single page where a user can enter their card details and submit the payment. Under the hood, it uses Stripe's `react-stripe-js` library to create a `CardElement` (a pre-built UI component for collecting card details) and the Stripe API to create a payment intent.

Our application is designed to handle errors gracefully. It wraps the `CardElement` in a higher-order component (HOC) that listens for global errors and handles Stripe errors specifically. The error handling logic uses the `stripe.error` event type and logs any Stripe error to the console. If there's an error during payment submission, the error message is shown on the page.

## How to Run the Application Locally

1. Clone the repository:
    ```
    git clone <repository-url>
    ```

2. Navigate into the cloned repository:
    ```
    cd <repository-folder>
    ```

3. Install dependencies:
    ```
    npm install
    ```

4. Run the application:
    ```
    npm start
    ```

The application will start on `http://localhost:3000` by default (you can change this in the script inside `package.json`).

## Example URLs

Here are example URLs to test the application:

1. Starting the payment process:
    ```
    http://localhost:3000/start-payment
    ```
   This URL initiates the payment process. On the frontend, it's hit when the "Pay" button is pressed, and it starts the payment process on the backend. The backend returns a `clientSecret`, which is used by the Stripe API on the frontend to confirm the payment.

2. Webhook for Stripe events:
    ```
    http://localhost:4242/webhook
    ```
   This is the webhook endpoint which Stripe will hit to send events related to the payment process. This URL will not return anything meaningful when opened in a browser because it is intended to receive POST requests from the Stripe API.

Please note that you will need to set up a local server on port 4242 and establish a Stripe webhook endpoint at `/webhook` to handle the Stripe events for the second example URL.

---

Please replace `<repository-url>` and `<repository-folder>` with the actual repository URL and folder name.