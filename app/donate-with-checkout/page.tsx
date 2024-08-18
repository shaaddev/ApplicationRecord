import CheckoutForm from "@/components/Stripe/Checkoutform";

export const stripe_div = 'flex flex-col items-center justify-center p-5 min-h-screen'


export default function DonatePage() {
  return (
    <div className={stripe_div}>
      <h1>Donate with hosted Checkout</h1>
      <p>Donate to our project</p>
      <CheckoutForm uiMode="hosted" />
    </div>
  );
}