import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/redirect-path";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in | Land It",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const { next, email } = await searchParams;
  const target = safeNextPath(next);

  if (await getSession()) {
    redirect(target);
  }

  return <AuthForm mode="login" next={target} initialEmail={email ?? ""} />;
}
