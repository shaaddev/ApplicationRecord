"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Step = "email" | "code";

export function SignInForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  const sendCode = async () => {
    setPending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setPending(false);

    if (error) {
      toast.error("Could not send code", { description: error.message });
      return false;
    }
    return true;
  };

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await sendCode()) {
      setCode("");
      setStep("code");
    }
  };

  const onResend = async () => {
    if (await sendCode()) {
      setCode("");
      toast.success("New code sent");
    }
  };

  const onSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const { error } = await authClient.signIn.emailOtp({ email, otp: code });
    setPending(false);

    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return;
    }

    router.push("/application-record");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email and we will send you a one-time code."
            : `Enter the 6-digit code sent to ${email}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={onSubmitEmail} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <Button type="submit" disabled={pending || !email}>
              {pending ? "Sending..." : "Send code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={onSubmitCode} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <Button type="submit" disabled={pending || code.length !== 6}>
              {pending ? "Verifying..." : "Verify"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="underline underline-offset-4"
                disabled={pending}
                onClick={() => setStep("email")}
              >
                Use a different email
              </button>
              <button
                type="button"
                className="underline underline-offset-4"
                disabled={pending}
                onClick={onResend}
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
