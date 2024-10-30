import Link from "next/link";
import { Button } from "../ui/button";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { MoveRight } from "lucide-react";

export function NavBar() {
  return (
    <nav className="fixed flex flex-col max-w-full bg-none px-2 z-10 top-5 inset-x-0">
      <div className="flex flex-row items-center justify-between px-5">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={24}
            className="invert dark:invert-0"
          />
        </Link>
        <Button className="rounded-full px-4 py-6 bg-lime-500 text-primary-foreground hover:bg-lime-500 font-bold">
          <Link
            href="/api/auth/login"
            className="flex flex-row items-center gap-2"
          >
            Sign in
            <div className="rounded-full bg-lime-600 p-2">
              <MoveRight className="inline" />
            </div>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
