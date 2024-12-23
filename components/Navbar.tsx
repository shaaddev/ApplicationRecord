import Link from "next/link";
import { SpreadSheet } from "@/lib/Logos";
import { Theme } from "./theme";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { ResNavBar } from "./res-nav-bar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutDialog } from "./logout-dialog";
import { Link as ViewLink } from "next-view-transitions";

export interface PathProps {
  [key: string]: {
    name: string;
  };
}

const paths: PathProps = {
  "/donate-with-elements": {
    name: "Donate",
  },
  "/api/auth/login": {
    name: "Login",
  },
};

export async function Navbar() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <nav className="sticky flex flex-col max-w-full h-max z-10 top-0 inset-x-o px-10 py-5 m-2 rounded-2xl border-none bg-lime-600 text-slate-100  dark:bg-lime-500 backdrop-blur-xl  shadow-md ">
      <div className="flex flex-row items-center justify-between px-5">
        {/* <SpreadSheet className='w-6 h-6' /> */}
        <ViewLink href="/">
          <Image src={logo} alt="Logo" width={100} height={24} />
        </ViewLink>
        <ul className="hidden lg:flex flex-row gap-6 justify-end">
          {user ? (
            <>
              {Object.entries(paths)
                .slice(1)
                .map(([path, { name }]) => (
                  <li key={path}>
                    {path === "/donate-with-elements" ? (
                      <ViewLink
                        href={path}
                        className="hover:text-slate-800 dark:hover:text-slate-800"
                      >
                        {name}
                      </ViewLink>
                    ) : (
                      <Link
                        href={path}
                        className="hover:text-slate-800 dark:hover:text-slate-800"
                      >
                        {name}
                      </Link>
                    )}
                  </li>
                ))}
              <li>
                <LogoutDialog />
              </li>
            </>
          ) : (
            <>
              {Object.entries(paths).map(([path, { name }]) => (
                <li key={path}>
                  {path === "/donate-with-elements" ? (
                    <ViewLink
                      href={path}
                      className="hover:text-slate-800 dark:hover:text-slate-800"
                    >
                      {name}
                    </ViewLink>
                  ) : (
                    <Link
                      href={path}
                      className="hover:text-slate-800 dark:hover:text-slate-800"
                    >
                      {name}
                    </Link>
                  )}
                </li>
              ))}
            </>
          )}
          <li>
            <Theme />
          </li>
        </ul>
        <ResNavBar theme={<Theme />} user={user} paths={paths} />
      </div>
    </nav>
  );
}
