import React from 'react';
import renderer from 'react-test-renderer';
import CardComponent from './CardElement';  // adjust path to where your component is

jest.mock('@stripe/react-stripe-js', () => ({
    CardElement: () => <div data-testid="CardElement">CardElement</div>,
    useStripe: () => null,
    useElements: () => null,
}));

describe('CardComponent', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<CardComponent />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
