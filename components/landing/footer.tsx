import logo from "@/public/logo.svg";
import Image from "next/image";

export function Footer() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={logo}
        alt="Logo"
        width={150}
        height={24}
        className="invert dark:invert-0"
      />
      <div className="w-4/5 border-t border-slate-300/50 mt-5 pt-5 uppercase flex items-center justify-center text-muted-foreground">
        &copy; {new Date().getFullYear()} Landit all rights reserved
      </div>
    </div>
  );
}
