// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51PoSv8P3xKFVp0jOBdMFa6Y8RFlrhXqH5fkzi4BaAwovG29A17KQ0VLMRPlWN605UaV8YoG1R3Jb0iBd1AgJyf6X00H7KJHDnq');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 500,
  currency: 'gbp',
  payment_method: 'pm_card_visa',
});