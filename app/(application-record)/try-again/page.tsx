import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center p-10 lg:p-16 gap-12">
      <p>The page is only for logged in users. Please sign in and try again.</p>
      <Button asChild className="px-7 py-4 bg-lime-600 dark:bg-lime-500 text-primary-foreground">
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </main>
  );
}
