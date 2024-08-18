import type { Stripe } from "stripe";

import PrintObject from "@/components/Stripe/PrintObject";
import { stripe } from "@/lib/Stripe";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  if (!searchParams.payment_intent)
    throw new Error("Please provide a valid payment_intent (`pi_...`)");

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Payment Intent response:</h3>
      <PrintObject content={paymentIntent} />
    </>
  );
}