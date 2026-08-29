import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { email_otp_message } from "./resend";

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
  hooks: {
    // Email OTP treats sign in and sign up as one endpoint. Only allow a new
    // account to be created when the request came from the sign-up form,
    // which is the only caller that sends a name. Login attempts for unknown
    // emails fail here with a message that points at /signup.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email-otp") return;

      const body = ctx.body as { email?: unknown; name?: unknown } | undefined;
      if (typeof body?.name === "string" && body.name.trim()) return;

      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
      const existing = email ? await ctx.context.internalAdapter.findUserByEmail(email) : null;
      if (!existing) {
        throw new APIError("BAD_REQUEST", {
          code: "NO_ACCOUNT",
          message: "No account found for this email. Sign up first.",
        });
      }
    }),
  },
  plugins: [
    emailOTP({
      resendStrategy: "rotate",
      changeEmail: { enabled: true },
      sendVerificationOTP: async ({ email, otp }) => {
        await email_otp_message(email, otp);
      },
    }),
    nextCookies(),
  ],
});
