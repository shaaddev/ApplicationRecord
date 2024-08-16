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
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;

//-------------------------------------------------------
// for route.ts
export function formatAmountForStripe(amount: number, currency: string): number {
 let multiplier = 100; // Default multiplier for most currencies (e.g., USD, EUR, etc.)

 // You can adjust the multiplier for currencies that don't use cents (e.g., JPY).
 switch (currency.toLowerCase()) {
   case 'jpy': // Japanese Yen
   case 'vnd': // Vietnamese Dong
     multiplier = 1;
     break;
   // Add more cases if needed for other currencies
 }

 return Math.round(amount * multiplier);
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
