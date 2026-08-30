import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { type Application, formatDate, formatPay } from "@/lib/applications";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusMenu } from "./status-menu";
import { RowActions } from "./row-actions";

export function ApplicationCard({ application }: { application: Application }) {
  const applied = formatDate(application.date_applied);
  const pay = formatPay(application);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader>
        <CardTitle className="truncate">{application.company_name}</CardTitle>
        <CardDescription className="truncate">{application.role}</CardDescription>
        <CardAction>
          <RowActions application={application} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <StatusMenu id={application.id} status={application.status} />
        </div>
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex gap-1">
            <dt className="sr-only">Location</dt>
            <dd className="truncate">{application.location}</dd>
          </div>
          {applied ? (
            <div className="flex gap-1">
              <dt>Applied</dt>
              <dd className="text-foreground tabular-nums">{applied}</dd>
            </div>
          ) : null}
          {pay ? (
            <div className="flex gap-1">
              <dt className="sr-only">Pay</dt>
              <dd className="text-foreground tabular-nums">{pay}</dd>
            </div>
          ) : null}
          {application.link ? (
            <a
              href={application.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-ink underline-offset-4 hover:underline"
            >
              Posting
              <ArrowSquareOutIcon className="size-3" aria-hidden="true" />
            </a>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  );
}
