"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";

const emailSchema = z.string().trim().toLowerCase().email();

type AccountCheck = { ok: true; exists: boolean } | { ok: false; error: string };

/**
 * Tells the login and sign-up forms which page the visitor belongs on before
 * a code is sent. The forms send the code themselves through the auth client
 * so better-auth's rate limit still applies.
 */
export async function hasAccount(rawEmail: string): Promise<AccountCheck> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email." };
  }

  const ctx = await auth.$context;
  const existing = await ctx.internalAdapter.findUserByEmail(parsed.data);
  return { ok: true, exists: existing !== null };
}
