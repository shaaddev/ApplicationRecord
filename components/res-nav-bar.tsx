import { DropdownMenuIcon,  } from "@radix-ui/react-icons";
import { User } from "@supabase/supabase-js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";

export function ResNavBar({
  theme, user, paths
}: {
  theme: React.ReactNode, user: User | null, paths: any
}) {
  return(
    <div className="flex lg:hidden">
      <Sheet>
        <SheetTrigger className="text-white"><DropdownMenuIcon className="w-6 h-6 mr-2"/></SheetTrigger>
        <SheetContent side='top' className="bg-lime-500 text-white border-none">
          <div className="flex flex-row items-center justify-center p-10">
            <ul className="flex flex-col gap-2 w-full text-center">
              {user ? (
                <>
                  {Object.entries(paths).slice(1).map(([path, { name }]) => (
                    <li key={path} className="w-full border border-white border-opacity-10 p-2 rounded-xl">
                      <Link href={path} >{name}</Link>
                    </li>
                  ))}
                  <li className="w-full border border-white border-opacity-10 p-2 rounded-xl">
                    <Link href='/logout' className="">
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <> 
                {Object.entries(paths).map(([path, {name}]) => (
                  <li key={path} className="w-full border border-white border-opacity-10 p-2 rounded-xl">
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