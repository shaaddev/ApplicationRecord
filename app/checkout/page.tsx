import type { Metadata } from "next";

import Link from "next/link";
import "@/styles.css"
import { CardStripe } from "@/components/Stripe/CardStripe";

const checkouts = [
  {
    name: 'Donate with embedded Checkout',
    href: '/donate-with-embedded-checkout',
    svg: '/checkout-one-time-payments.svg',
  },
  {
    name: 'Donate with hosted Checkout',
    href: '/donate-with-checkout',
    svg: '/checkout-one-time-payments.svg',
  },
  {
    name: 'Donate with Elements',
    href: '/donate-with-elements',
    svg: '/elements-card-payment.svg',

  }
]

export default function IndexPage(): JSX.Element {
  return (
    <div className={`${stripe_div}`}>
      <ul className="flex flex-wrap items-start pt-16">
        {checkouts.map((c, index) => (
          <li key={index} className="mx-2">
            <Link
              href={c.href}
            >
              <CardStripe>
                  <h2 className="text-lg ">{c.name}</h2>
                  <img src={c.svg} />
              </CardStripe>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const stripe_div = 'flex flex-col items-center justify-center p-5'