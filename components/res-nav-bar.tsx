import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";
import { PathProps } from "./Navbar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export function ResNavBar({
  theme, user, paths
}: {
  theme: React.ReactNode, user: any, paths: PathProps
}) {
  return(
    <div className="flex lg:hidden">
      <Sheet>
        <SheetTrigger className="text-white"><Menu className="w-6 h-6 mr-2"/></SheetTrigger>
        <SheetContent side='top' className="bg-lime-500 text-white border-none rounded-b-3xl">
          <div className="flex flex-row items-center justify-center p-10">
            <ul className="flex flex-col gap-2 w-full text-center">
              {user ? (
                <>
                  {Object.entries(paths).slice(1).map(([path, { name }]) => (
                    <li key={path} className="w-full border border-black border-opacity-10 p-2 rounded-xl">
                      <Link href={path} >{name}</Link>
                    </li>
                  ))}
                  <li className="w-full border border-black border-opacity-10 p-2 rounded-xl">
                    <LogoutLink>
                      Logout
                    </LogoutLink>
                  </li>
                </>
              ) : (
                <> 
                {Object.entries(paths).map(([path, {name}]) => (
                  <li key={path} className="w-full border border-black border-opacity-10 p-2 rounded-xl">
                    <Link href={path}>{name}</Link>
                  </li>
                ))}
                </>
              )}
              <li>
                {theme}
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}