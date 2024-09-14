import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="hover:text-slate-800 dark:hover:text-slate-800 hover:cursor-pointer">
          Logout
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] w-full">
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="mb-5">Are you sure you want to logout?</p>
          <LogoutLink className={cn(buttonVariants({ variant: 'outline' }))}>
            Logout
          </LogoutLink>
        </div>
      </DialogContent>
    </Dialog>
  )
}