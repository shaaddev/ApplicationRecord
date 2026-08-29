import type { Icon } from "@phosphor-icons/react";
import {
  BriefcaseIcon,
  ChatsCircleIcon,
  ClockIcon,
  TrophyIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Stats } from "@/lib/applications";
import { Card, CardContent } from "@/components/ui/card";

function Tile({
  icon: TileIcon,
  label,
  value,
  hint,
}: {
  icon: Icon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
          <span className="truncate text-xs text-muted-foreground">{hint}</span>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand-ink">
          <TileIcon className="size-4.5" weight="duotone" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

export function StatsRow({ stats }: { stats: Stats }) {
  const rate =
    stats.responseRate === null ? "No replies yet" : `${stats.responseRate}% response rate`;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile
        icon={BriefcaseIcon}
        label="Total"
        value={String(stats.total)}
        hint="applications tracked"
      />
      <Tile
        icon={ClockIcon}
        label="Active"
        value={String(stats.active)}
        hint="waiting on a reply"
      />
      <Tile
        icon={ChatsCircleIcon}
        label="Interviews"
        value={String(stats.interviews)}
        hint={rate}
      />
      <Tile icon={TrophyIcon} label="Offers" value={String(stats.offers)} hint="including hired" />
    </div>
  );
}
