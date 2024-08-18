import CheckoutForm from "@/components/Stripe/Checkoutform";
import { stripe_div } from "@/components/Stripe/CardStripe";


export default function DonatePage() {
  return (
    <div className={stripe_div}>
      <h1>Donate with hosted Checkout</h1>
      <p>Donate to our project</p>
      <CheckoutForm uiMode="hosted" />
    </div>
  );
}