"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { authClient } from "@/lib/auth-client";
import { hasAccount } from "@/app/(auth)/actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Mode = "login" | "signup";
type Step = "details" | "code";

const copy: Record<Mode, { title: string; description: string; submit: string }> = {
  login: {
    title: "Welcome back",
    description: "Enter your email and we will send you a one-time code.",
    submit: "Send code",
  },
  signup: {
    title: "Create your account",
    description: "No password needed. We will email you a one-time code to verify.",
    submit: "Continue",
  },
};

export function AuthForm({
  mode,
  next,
  initialEmail = "",
}: {
  mode: Mode;
  next: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  const sendCode = async () => {
    setPending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    setPending(false);

    if (error) {
      toast.add({ type: "error", title: "Could not send code", description: error.message });
      return false;
    }
    return true;
  };

  const otherPage = (page: Mode) => {
    const params = new URLSearchParams({ email });
    if (next !== "/application-record") params.set("next", next);
    return `/${page}?${params.toString()}`;
  };

  const onSubmitDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const check = await hasAccount(email);
    if (!check.ok) {
      setPending(false);
      toast.add({ type: "error", title: check.error });
      return;
    }
    if (mode === "login" && !check.exists) {
      setPending(false);
      toast.add({
        type: "info",
        title: "No account for this email",
        description: "Create one to continue.",
      });
      router.push(otherPage("signup"));
      return;
    }
    if (mode === "signup" && check.exists) {
      setPending(false);
      toast.add({
        type: "info",
        title: "You already have an account",
        description: "Log in with a code instead.",
      });
      router.push(otherPage("login"));
      return;
    }
    if (await sendCode()) {
      setCode("");
      setStep("code");
    }
  };

  const onResend = async () => {
    if (await sendCode()) {
      setCode("");
      toast.add({ type: "success", title: "New code sent" });
    }
  };

  const verify = async (otp: string) => {
    setPending(true);
    const { error } = await authClient.signIn.emailOtp({
      email,
      otp,
      ...(mode === "signup" && name ? { name } : {}),
    });
    setPending(false);

    if (error) {
      setCode("");
      toast.add({
        type: "error",
        title: mode === "signup" ? "Sign up failed" : "Log in failed",
        description: error.message,
      });
      return;
    }

    router.push(next);
    router.refresh();
  };

  const onSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6) await verify(code);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">
          {step === "details" ? copy[mode].title : "Check your email"}
        </CardTitle>
        <CardDescription>
          {step === "details" ? copy[mode].description : `We sent a 6-digit code to ${email}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "details" ? (
          <form onSubmit={onSubmitDetails} className="flex flex-col gap-6">
            <FieldGroup>
              {mode === "signup" ? (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
              ) : null}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              size="lg"
              disabled={pending || !email || (mode === "signup" && !name.trim())}
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {copy[mode].submit}
            </Button>
          </form>
        ) : (
          <form onSubmit={onSubmitCode} className="flex flex-col gap-6">
            <Field className="items-center text-center">
              <FieldLabel htmlFor="code" className="justify-center">
                Code
              </FieldLabel>
              <InputOTP
                id="code"
                containerClassName="justify-center"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={code}
                onChange={setCode}
                onComplete={verify}
                disabled={pending}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center">
                The code expires in 5 minutes.
              </FieldDescription>
            </Field>
            <Button type="submit" size="lg" disabled={pending || code.length !== 6}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Verify
            </Button>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0 text-muted-foreground"
                disabled={pending}
                onClick={() => setStep("details")}
              >
                Use a different email
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0 text-muted-foreground"
                disabled={pending}
                onClick={onResend}
              >
                Resend code
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <p>
            New to Land It?{" "}
            <Link
              href={otherPage("signup")}
              className="text-foreground underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={otherPage("login")}
              className="text-foreground underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
