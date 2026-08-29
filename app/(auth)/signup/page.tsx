import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/redirect-path";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign up | Land It",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const { next, email } = await searchParams;
  const target = safeNextPath(next);

  if (await getSession()) {
    redirect(target);
  }

  return <AuthForm mode="signup" next={target} initialEmail={email ?? ""} />;
}
