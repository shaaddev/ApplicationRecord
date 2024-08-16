// Partial of ./components/CheckoutForm.tsx

import getStripe, { fetchPostJSON } from "@/lib/utils";
import input from "postcss/lib/input";
import { FormEvent } from "react";
import Stripe from "stripe";

// ...
const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Get the amount from the input field
    const amountInput = document.getElementById('customDonation') as HTMLInputElement;
    const amount = parseInt(amountInput.value, 10) * 100; // Convert to cents

    // Create a Checkout Session.
    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      '/api/checkout_sessions',
      { amount },
    );
  
    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }
  
    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  };
  // ...