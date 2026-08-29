import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Reads the better-auth session for the current request. Memoized per render
 * so layouts, pages, and server actions in the same request share one lookup.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const getUser = async () => (await getSession())?.user ?? null;
