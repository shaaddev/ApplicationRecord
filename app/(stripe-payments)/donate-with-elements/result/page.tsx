import type { Stripe } from "stripe";
import { stripe } from "@/lib/Stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ResultPage(props: {
  searchParams: Promise<{ payment_intent: string }>;
}) {
  const searchParams = await props.searchParams;
  if (!searchParams.payment_intent)
    throw new Error("Please provide a valid payment_intent (`pi_...`)");

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  return (
    <div>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Thank you for your donation!</h3>

      <p>You will receive a confirmation email soon!</p>
      <Link href="/">
        <Button>Home</Button>
      </Link>
    </div>
  );
}
