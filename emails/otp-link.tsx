import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import React from "react";

interface OtpEmailProps {
  email?: string;
  expiresInMinutes?: number;
  pin: string;
}

// Prefer Geist (the app's typeface) when available, then fall back to the
// system sans stack, since most email clients won't load custom web fonts.
const fontStack =
  '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default function OtpEmail({ email, pin, expiresInMinutes = 5 }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your LandIt - Application Record sign-in code${email ? ` for ${email}` : ""}`}</Preview>
      <Tailwind>
        <Body className="bg-[#fafafa] py-10" style={{ fontFamily: fontStack }}>
          <Container className="mx-auto max-w-116.25 rounded-[10px] border border-[#e5e5e5] border-solid bg-white p-8">
            <Section>
              <Text className="m-0 text-center font-semibold text-[13px] text-[#0a0a0a] uppercase tracking-[0.22em]">
                LandIt
              </Text>
            </Section>

            <Hr className="my-6 border-[#ededed]" />

            <Heading className="m-0 text-center font-medium text-[18px] text-[#0a0a0a]">
              Verify your sign-in
            </Heading>
            <Text className="mt-2 mb-0 text-center text-[14px] text-[#525252] leading-5.5">
              Enter this one-time code to finish signing in. The code expires in {expiresInMinutes}{" "}
              minutes.
            </Text>

            <Section className="mt-6 text-center">
              <Text className="m-0 inline-block rounded-[8px] border border-[#e5e5e5] border-solid bg-[#f5f5f5] px-6 py-3 text-center font-mono font-semibold text-[32px] text-[#0a0a0a] tracking-[0.35em]">
                {pin}
              </Text>
            </Section>

            <Hr className="my-6 border-[#ededed]" />

            <Text className="m-0 text-center text-[12px] text-[#737373] leading-5">
              Never share this code. If you didn&apos;t request it, ignore this email.
            </Text>
            <Text className="mt-3 mb-0 text-center text-[12px] text-[#a3a3a3]">© LandIt</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
