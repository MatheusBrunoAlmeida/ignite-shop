import Stripe from 'stripe'

// @ts-ignore
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
    appInfo: {
        name: 'Ignite Shop'
    }
})