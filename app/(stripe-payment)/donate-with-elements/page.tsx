import ElementsForm from "@/components/Stripe/ElementsForm";
import { stripe_div } from "@/components/Stripe/CardStripe";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Donate with Elements",
};

export default function PaymentElementPage() {
  return (
    <div className={stripe_div}>
      <p className="text-xl font-bold">Donate to our project ❤️</p>
      <ElementsForm />
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "rounded-xl px-10 py-5 bg-lime-600 text-primary-foreground hover:bg-lime-600 font-bold"
        )}
        rel="noreferrer noopener"
      >
        Home
      </Link>
    </div>
  );
}
