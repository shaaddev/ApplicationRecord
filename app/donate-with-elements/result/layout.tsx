import type { Metadata } from "next";
import { stripe_div } from "@/app/checkout/page";


export const metadata: Metadata = {
  title: "Payment Intent Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className={stripe_div}>
      <h1>Payment Intent Result</h1>
      {children}
    </div>
  );
}