import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const base_url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: base_url,
  plugins: [emailOTPClient()],
});
