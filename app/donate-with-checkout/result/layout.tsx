import { stripe_div } from "../page";

export const metadata = {
  title: "Checkout Session Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={stripe_div}>
      <h1>Checkout Session Result</h1>
      {children}
    </div>
  );
}