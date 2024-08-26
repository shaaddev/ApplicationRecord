import type { Metadata } from "next";
import { stripe_div } from "@/components/Stripe/CardStripe";

export const metadata = {
  title: "Payment Intent Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${stripe_div} gap-4`}>
      <h1>Payment Intent Result</h1>
      {children}
    </div>
  );
}