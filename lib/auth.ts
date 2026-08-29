import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { email_otp_message } from "./resend";

const base_url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  rateLimit: {
    enabled: true,
    storage: "database",
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    emailOTP({
      resendStrategy: "rotate",
      changeEmail: { enabled: true },
      sendVerificationOTP: async ({ email, otp, type }) => {
        // send email
        await email_otp_message(email, otp);
      },
    }),
    nextCookies(),
  ],
});
