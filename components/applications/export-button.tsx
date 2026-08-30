"use client";

import { DownloadSimpleIcon } from "@phosphor-icons/react";
import type { Application } from "@/lib/applications";
import { applicationsCsv, downloadCsv } from "@/lib/import/csv";
import { isoDate } from "@/lib/import/parse";
import { Button } from "@/components/ui/button";

/** Downloads the given applications as CSV, in the order they are shown. */
export function ExportButton({
  applications,
  size = "sm",
}: {
  applications: Application[];
  size?: "default" | "sm";
}) {
  return (
    <Button
      variant="outline"
      size={size}
      disabled={applications.length === 0}
      onClick={() =>
        downloadCsv(`applications-${isoDate(new Date())}.csv`, applicationsCsv(applications))
      }
      aria-label={`Export ${applications.length} applications as CSV`}
    >
      <DownloadSimpleIcon data-icon="inline-start" />
      Export
    </Button>
  );
}
