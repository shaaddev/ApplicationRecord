// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config({ path: '.env.local'});

const paymentIntent = await stripe.paymentIntents.create({
  amount: 500,
  currency: 'gbp',
  payment_method: 'pm_card_visa',
});