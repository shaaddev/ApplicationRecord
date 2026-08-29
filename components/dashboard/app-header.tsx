import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { UserMenu } from "@/components/dashboard/user-menu";
import { getUser } from "@/lib/session";

export async function AppHeader() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Land It home" className="flex items-center">
          <Image
            src={logo}
            alt="Land It"
            width={104}
            height={27}
            priority
            className="h-auto invert dark:invert-0"
          />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <UserMenu name={user.name} email={user.email} image={user.image ?? null} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
