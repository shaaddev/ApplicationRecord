import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import logo from "@/public/logo.svg";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { Link as ViewLink } from "next-view-transitions";

export function NavBar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex h-14 items-center justify-between bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <ViewLink href="/" aria-label="Land It home" className="flex items-center">
        <Image src={logo} alt="Land It" width={120} height={31} className="invert dark:invert-0" />
      </ViewLink>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button size="sm" render={<Link href="/login" />} nativeButton={false}>
          Log in
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </nav>
  );
}
