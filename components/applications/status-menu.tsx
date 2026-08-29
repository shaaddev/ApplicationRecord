"use client";

import { useOptimistic, useTransition } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { STATUSES } from "@/lib/applications";
import { updateApplicationStatus } from "@/app/(application-record)/actions";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statusClasses } from "./status-badge";

export function StatusMenu({ id, status }: { id: number; status: string }) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(status);
  const { badge, dot } = statusClasses(optimistic);

  const change = (next: string | null) => {
    if (!next || next === optimistic) return;
    startTransition(async () => {
      setOptimistic(next);
      const result = await updateApplicationStatus(id, next);
      if (!result.ok) {
        toast.add({ type: "error", title: "Status not updated", description: result.error });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Change status, currently ${optimistic}`}
        disabled={pending}
        className={cn(
          "inline-flex h-6 shrink-0 cursor-pointer items-center gap-1.5 rounded-2xl pr-1.5 pl-2.5 text-xs font-medium whitespace-nowrap transition-[opacity,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-60",
          badge,
        )}
      >
        <span className={cn("size-1.5 rounded-full", dot)} aria-hidden="true" />
        {optimistic}
        <CaretDownIcon className="size-3 opacity-70" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuRadioGroup value={optimistic} onValueChange={change}>
          {STATUSES.map((s) => (
            <DropdownMenuRadioItem key={s} value={s} closeOnClick>
              <span
                className={cn("size-1.5 rounded-full", statusClasses(s).dot)}
                aria-hidden="true"
              />
              {s}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
