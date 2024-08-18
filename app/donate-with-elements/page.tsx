import type { Metadata } from "next";

import ElementsForm from "@/components/Stripe/ElementsForm";
import { stripe_div } from "@/components/Stripe/CardStripe";

export const metadata: Metadata = {
  title: "Donate with Elements",
};

export default function PaymentElementPage({
  searchParams,
}: {
  searchParams?: { payment_intent_client_secret?: string };
}): JSX.Element {
  return (
    <div className={stripe_div}>
      <p className="text-xl font-bold">Donate to our project ❤️</p>
      <ElementsForm />
    </div>
  );
}