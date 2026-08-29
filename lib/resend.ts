"use server";

import React from "react";
import { Resend } from "resend";
import OtpEmail from "@/emails/otp-link";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export const email_otp_message = async (email: string, pin: string) => {
  try {
    await getResend().emails.send({
      from: "LandIt - Application Record <system@shaaddev.com>",
      to: [email],
      subject: "Your LandIt - Application Record sign-in code",
      react: React.createElement(OtpEmail, {
        email: email as string,
        pin: pin as string,
      }),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
