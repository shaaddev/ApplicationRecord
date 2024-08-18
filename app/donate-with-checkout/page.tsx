import type { Metadata } from "next";

import CheckoutForm from "@/components/Stripe/Checkoutform";
import { stripe_div } from "@/components/Stripe/CardStripe";

export const metadata: Metadata = {
  title: "Donate with hosted Checkout | Next.js + TypeScript Example",
};

export default function DonatePage(): JSX.Element {
  return (
    <div className={stripe_div}>
      <h1>Donate with hosted Checkout</h1>
      <p>Donate to our project</p>
      <CheckoutForm uiMode="hosted" />
    </div>
  );
}