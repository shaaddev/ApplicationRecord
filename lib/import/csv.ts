import type { Application } from "@/lib/applications";
import { isoDate } from "./parse";

/** Export headers. They match the import aliases, so an export re-imports cleanly. */
export const CSV_HEADERS = [
  "Company",
  "Role",
  "Location",
  "Status",
  "Date applied",
  "Planned date",
  "Follow-up date",
  "Pay",
  "Pay unit",
  "Link",
  "Notes",
] as const;

function escapeCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Prefixed with a BOM so Excel reads UTF-8 without a wizard. */
export function toCsv(rows: readonly (readonly string[])[]) {
  return "\uFEFF" + `${rows.map((row) => row.map(escapeCell).join(",")).join("\r\n")}\r\n`;
}

function applicationRow(app: Application): string[] {
  return [
    app.company_name,
    app.role,
    app.location,
    app.status,
    app.date_applied ? isoDate(app.date_applied) : "",
    app.planned_date ? isoDate(app.planned_date) : "",
    app.follow_up_date ? isoDate(app.follow_up_date) : "",
    app.rate ?? app.salary ?? "",
    app.rate ? "hour" : app.salary ? "year" : "",
    app.link ?? "",
    app.notes ?? "",
  ];
}

export function applicationsCsv(apps: Application[]) {
  return toCsv([CSV_HEADERS, ...apps.map(applicationRow)]);
}

export function templateCsv() {
  return toCsv([
    CSV_HEADERS,
    [
      "Acme",
      "Software Engineer",
      "Remote",
      "Applied",
      "2026-08-01",
      "",
      "2026-08-15",
      "120000",
      "year",
      "https://example.com/jobs/123",
      "Referred by Sam",
    ],
    [
      "Globex",
      "Frontend Developer",
      "New York, NY",
      "Not Applied",
      "",
      "2026-08-12",
      "",
      "65",
      "hour",
      "",
      "",
    ],
  ]);
}

export function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
