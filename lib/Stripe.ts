//-------------------------------------------------------
// this is for the route.ts in the check_out sessions folder

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2024-09-30.acacia",
  appInfo: {
    name: "application-record-with-stripe-typescript",
    url: "https://application-record.vercel.app",
  },
});
