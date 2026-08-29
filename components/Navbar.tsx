import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { Theme } from "./theme";
import { ResNavBar } from "./res-nav-bar";
import { LogoutDialog } from "./logout-dialog";
import { Link as ViewLink } from "next-view-transitions";
import { getUser } from "@/lib/session";

export interface PathProps {
  [key: string]: {
    name: string;
  };
}

const paths: PathProps = {
  "https://donate.stripe.com/aEUaI65a5fpjgTe144": {
    name: "Donate",
  },
};

const signInPath: PathProps = {
  "/sign-in": {
    name: "Sign in",
  },
};

export async function Navbar() {
  const user = await getUser();
  const links = user ? paths : { ...paths, ...signInPath };

  return (
    <nav className="sticky flex flex-col max-w-full h-max z-10 top-0 inset-x-o px-10 py-5 m-2 rounded-2xl border-none bg-lime-600 text-slate-100  dark:bg-lime-500 backdrop-blur-xl  shadow-md ">
      <div className="flex flex-row items-center justify-between px-5">
        <ViewLink href="/">
          <Image src={logo} alt="Logo" width={100} height={24} />
        </ViewLink>
        <ul className="hidden lg:flex flex-row gap-6 justify-end">
          {Object.entries(links).map(([path, { name }]) => (
            <li key={path}>
              <Link href={path} className="hover:text-slate-800 dark:hover:text-slate-800">
                {name}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <LogoutDialog />
            </li>
          )}
          <li>
            <Theme />
          </li>
        </ul>
        <ResNavBar theme={<Theme />} signedIn={!!user} paths={links} />
      </div>
    </nav>
  );
}
