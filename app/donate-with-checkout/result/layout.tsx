import type { Metadata } from "next";
import { stripe_div } from "@/components/Stripe/CardStripe";

export const metadata: Metadata = {
  title: "Checkout Session Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className={stripe_div}>
      <h1>Checkout Session Result</h1>
      {children}
    </div>
  );
}