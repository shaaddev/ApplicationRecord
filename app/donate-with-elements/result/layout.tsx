import { stripe_div } from "@/app/donate-with-checkout/page";

export const metadata = {
  title: "Payment Intent Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={stripe_div}>
      <h1>Payment Intent Result</h1>
      {children}
    </div>
  );
}