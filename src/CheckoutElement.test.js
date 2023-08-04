import React from 'react';
import renderer from 'react-test-renderer';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutElement from './CheckoutElement';

const stripePromise = loadStripe('pk_test_51NWaDzLMk7mdm7YPyY3KabnUjCcgWGMVfwRETpz0Tb7saXfBv4wnS54jM56HGBA3HpLglg5ds405jDiTf69J5Ro300NSvanGl8'); // replace with your public test key

test('renders correctly', () => {
    const tree = renderer.create(
        <Elements stripe={stripePromise}>
            <CheckoutElement />
        </Elements>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
