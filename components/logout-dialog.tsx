"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LogoutDialog() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const logout = async () => {
    setPending(true);
    const { error } = await authClient.signOut();
    setPending(false);

    if (error) {
      toast.error("Logout failed", { description: error.message });
      return;
    }

    router.push("/");
    router.refresh();
  };

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
          <Button variant="outline" onClick={logout} disabled={pending}>
            {pending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
