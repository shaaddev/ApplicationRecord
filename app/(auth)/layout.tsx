import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import { ThemeToggle } from "@/components/theme";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Land It home" className="flex items-center">
          <Image
            src={logo}
            alt="Land It"
            width={104}
            height={27}
            className="h-auto invert dark:invert-0"
          />
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">{children}</main>
    </div>
  );
}
