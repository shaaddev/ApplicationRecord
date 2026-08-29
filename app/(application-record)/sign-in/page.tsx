import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage() {
  const session = await getSession();
  if (session) {
    redirect("/application-record");
  }

  return (
    <main className="flex flex-col items-center justify-center p-10 lg:p-16">
      <SignInForm />
    </main>
  );
}
