import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import { Theme } from "@/components/theme";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-primary">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Land It home">
          <Image
            src={logo}
            alt="Land It"
            width={130}
            height={34}
            className="invert dark:invert-0"
          />
        </Link>
        <Theme className="text-black dark:text-slate-200" />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">{children}</main>
    </div>
  );
}
