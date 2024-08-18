import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Stripe, loadStripe } from '@stripe/stripe-js';

/**
* @param amount - The amount in the main currency unit (e.g., dollars).
* @param currency - The currency code (e.g., 'usd').
* @returns The amount formatted for Stripe (in the smallest currency unit).
*/

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
    );

  return stripePromise;
}
//-------------------------------------------------------
// for the checkoutform.tsx
// utils/api-helpers.ts
export async function fetchPostJSON(url: string, data: any) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  } catch (error:any) {
    console.error('Error fetching JSON:', error);
    return { statusCode: 500, message: error.message };
  }
}

// ------------------------------------------------------------------
//  for the CustomDonationInput.tsx in CheckOutForm folder
export function formatAmountForDisplay(
  amount: number,
  currency: string,
): string {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
}
// ------------------------------------------------------------------
//  for route.ts
export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
