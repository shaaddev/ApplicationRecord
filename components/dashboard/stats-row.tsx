import type { Stats } from "@/lib/applications";
import { Card, CardContent } from "@/components/ui/card";

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </CardContent>
    </Card>
  );
}

export function StatsRow({ stats }: { stats: Stats }) {
  const rate =
    stats.responseRate === null ? "No replies yet" : `${stats.responseRate}% response rate`;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile label="Total" value={String(stats.total)} hint="applications tracked" />
      <Tile label="Active" value={String(stats.active)} hint="waiting on a reply" />
      <Tile label="Interviews" value={String(stats.interviews)} hint={rate} />
      <Tile label="Offers" value={String(stats.offers)} hint="including hired" />
    </div>
  );
}
