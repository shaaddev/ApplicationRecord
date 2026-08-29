"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { hasAccount } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const otherPage = (page: "login" | "signup") => {
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
      toast.error(check.error);
      return;
    }
    if (mode === "login" && !check.exists) {
      setPending(false);
      toast.error("No account for this email", { description: "Create one to continue." });
      router.push(otherPage("signup"));
      return;
    }
    if (mode === "signup" && check.exists) {
      setPending(false);
      toast.info("You already have an account", { description: "Log in with a code instead." });
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
      toast.success("New code sent");
    }
  };

  const onSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: code,
      ...(mode === "signup" && name ? { name } : {}),
    });
    setPending(false);

    if (error) {
      toast.error(mode === "signup" ? "Sign up failed" : "Log in failed", {
        description: error.message,
      });
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === "details" ? copy[mode].title : "Check your email"}
        </CardTitle>
        <CardDescription>
          {step === "details" ? copy[mode].description : `Enter the 6-digit code sent to ${email}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "details" ? (
          <form onSubmit={onSubmitDetails} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
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
            <Button
              type="submit"
              className="bg-lime-500 text-black hover:bg-lime-400"
              disabled={pending || !email || (mode === "signup" && !name.trim())}
            >
              {pending ? "Sending..." : copy[mode].submit}
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
                className="text-center text-lg tracking-[0.4em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <Button
              type="submit"
              className="bg-lime-500 text-black hover:bg-lime-400"
              disabled={pending || code.length !== 6}
            >
              {pending ? "Verifying..." : "Verify"}
            </Button>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <button
                type="button"
                className="underline underline-offset-4 hover:text-primary"
                disabled={pending}
                onClick={() => setStep("details")}
              >
                Use a different email
              </button>
              <button
                type="button"
                className="underline underline-offset-4 hover:text-primary"
                disabled={pending}
                onClick={onResend}
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <p>
            New to Land It?{" "}
            <Link href={otherPage("signup")} className="text-primary underline underline-offset-4">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href={otherPage("login")} className="text-primary underline underline-offset-4">
              Log in
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
