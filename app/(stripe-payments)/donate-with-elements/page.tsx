import ElementsForm from "@/components/Stripe/ElementsForm";
import { stripe_div } from "@/components/Stripe/CardStripe";
import { unstable_noStore as noStore } from "next/cache";

export const metadata = {
  title: "Donate with Elements",
};

export default function PaymentElementPage() {
  noStore();

  return (
    <div className={stripe_div}>
      <p className="text-xl font-bold">Donate to our project ❤️</p>
      <ElementsForm />
    </div>
  );
}
