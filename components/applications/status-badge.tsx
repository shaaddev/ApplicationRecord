import { cn } from "@/lib/utils";
import { STATUS_TONE, TONE_CLASS, TONE_DOT_CLASS, isStatus } from "@/lib/applications";

export function statusClasses(status: string) {
  const tone = isStatus(status) ? STATUS_TONE[status] : "neutral";
  return { badge: TONE_CLASS[tone], dot: TONE_DOT_CLASS[tone] };
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const { badge, dot } = statusClasses(status);
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-2xl px-2.5 text-xs font-medium whitespace-nowrap",
        badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden="true" />
      {status}
    </span>
  );
}
