import { isValid, parse as parseWithFormat } from "date-fns";
import {
  type Application,
  type ApplicationInput,
  type PayUnit,
  type Status,
  NOTES_LIMIT,
  STATUSES,
  applicationSchema,
} from "@/lib/applications";
import type { ImportRowInput } from "./shared";

/** A raw cell as SheetJS hands it over. */
export type Cell = string | number | boolean | Date | null | undefined;
export type Sheet = { headers: string[]; rows: Cell[][] };

export const IMPORT_FIELDS = [
  "company_name",
  "role",
  "location",
  "status",
  "date_applied",
  "planned_date",
  "follow_up_date",
  "pay",
  "pay_unit",
  "link",
  "notes",
] as const;

export type ImportField = (typeof IMPORT_FIELDS)[number];

export const FIELD_LABEL: Record<ImportField, string> = {
  company_name: "Company",
  role: "Role",
  location: "Location",
  status: "Status",
  date_applied: "Date applied",
  planned_date: "Planned date",
  follow_up_date: "Follow-up date",
  pay: "Pay",
  pay_unit: "Pay unit",
  link: "Link",
  notes: "Notes",
};

export const REQUIRED_FIELDS: readonly ImportField[] = ["company_name", "role", "location"];

/** Column index in the sheet for each field. Unmapped fields are left out. */
export type Mapping = Partial<Record<ImportField, number>>;

const ALIASES: Record<ImportField, string[]> = {
  company_name: ["company", "company name", "employer", "organization", "organisation", "org"],
  role: ["role", "position", "title", "job title", "job", "job role"],
  location: ["location", "city", "where", "place", "office"],
  status: ["status", "stage", "state", "outcome"],
  date_applied: [
    "date applied",
    "applied",
    "applied on",
    "applied date",
    "application date",
    "date",
  ],
  planned_date: [
    "planned date",
    "planned",
    "plan to apply",
    "planned application date",
    "apply by",
    "apply on",
    "target date",
    "deadline",
    "due",
    "due date",
  ],
  follow_up_date: [
    "follow up date",
    "follow up",
    "followup",
    "followup date",
    "follow up on",
    "next step",
    "next step date",
    "check in",
    "reminder",
  ],
  pay: ["pay", "salary", "compensation", "comp", "rate", "hourly rate", "wage", "pay rate"],
  pay_unit: ["pay unit", "unit", "per", "pay period", "pay type", "salary type"],
  link: ["link", "url", "posting", "job link", "job url", "listing", "job posting", "website"],
  notes: ["notes", "note", "comments", "comment", "remarks", "details", "description"],
};

function normalizeHeader(header: string) {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Matches sheet headers to fields. Exact matches win, then partial ones. */
export function guessMapping(headers: string[]): Mapping {
  const mapping: Mapping = {};
  const used = new Set<number>();
  const normalized = headers.map(normalizeHeader);
  const candidates = (field: ImportField) => [
    normalizeHeader(FIELD_LABEL[field]),
    ...ALIASES[field],
  ];

  for (const field of IMPORT_FIELDS) {
    const idx = normalized.findIndex((h, i) => !used.has(i) && candidates(field).includes(h));
    if (idx !== -1) {
      mapping[field] = idx;
      used.add(idx);
    }
  }
  for (const field of IMPORT_FIELDS) {
    if (mapping[field] !== undefined) continue;
    const idx = normalized.findIndex(
      (h, i) => !used.has(i) && h !== "" && candidates(field).some((c) => h.includes(c)),
    );
    if (idx !== -1) {
      mapping[field] = idx;
      used.add(idx);
    }
  }
  return mapping;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function isoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function cellText(cell: Cell): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date) return isoDate(cell);
  return String(cell).trim();
}

/** Reads the first sheet of a CSV, Excel, Numbers or OpenDocument file in the browser. */
export async function readSheet(file: File): Promise<Sheet> {
  const XLSX = await import("xlsx");
  const plainText = /\.(csv|tsv|txt)$/i.test(file.name);
  const workbook = XLSX.read(await file.arrayBuffer(), {
    type: "array",
    cellDates: true,
    // Keep CSV cells as typed text so dates and pay go through the parsers below.
    raw: plainText,
  });
  const name = workbook.SheetNames[0];
  const sheet = name ? workbook.Sheets[name] : undefined;
  if (!sheet) return { headers: [], rows: [] };

  const grid = XLSX.utils.sheet_to_json<Cell[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });
  const headerIndex = grid.findIndex((row) => row.some((c) => cellText(c) !== ""));
  if (headerIndex === -1) return { headers: [], rows: [] };

  const headers = grid[headerIndex].map(cellText);
  const rows = grid.slice(headerIndex + 1).filter((row) => row.some((c) => cellText(c) !== ""));
  return { headers, rows };
}

type Parsed<T> = { value: T; error?: string };

const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
const DAY = 86_400_000;

/** Local midnight, same as the date picker in the form, so display and sorting match. */
function localDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid && year >= 1990 && year <= 2100 ? date : null;
}

const TEXT_DATE_FORMATS = [
  "MMM d yyyy",
  "MMMM d yyyy",
  "d MMM yyyy",
  "d MMMM yyyy",
  "MMM d yy",
  "d MMM yy",
  "MMM yyyy",
  "MMMM yyyy",
];

function parseDateText(raw: string): Date | null {
  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ]|$)/);
  if (iso) return localDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const numeric = raw.match(/^(\d{1,4})[/.-](\d{1,2})[/.-](\d{1,4})$/);
  if (numeric) {
    const [a, b, c] = numeric.slice(1).map(Number);
    if (numeric[1].length === 4) return localDate(a, b, c);
    const year = numeric[3].length <= 2 ? 2000 + c : c;
    // Month first (US) unless the first number can only be a day.
    const [month, day] = a > 12 ? [b, a] : [a, b];
    return localDate(year, month, day);
  }

  const cleaned = raw
    .replace(/(\d)(st|nd|rd|th)\b/gi, "$1")
    .replace(/[,.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const pattern of TEXT_DATE_FORMATS) {
    const date = parseWithFormat(cleaned, pattern, new Date());
    if (!isValid(date)) continue;
    // "yyyy" happily takes "24" as the year 24; fall through so "yy" gets a turn.
    const local = localDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (local) return local;
  }
  return null;
}

export function parseDate(cell: Cell): Parsed<Date | null> {
  if (cell === null || cell === undefined || cell === "") return { value: null };

  if (cell instanceof Date) {
    const date = localDate(cell.getFullYear(), cell.getMonth() + 1, cell.getDate());
    return date ? { value: date } : { value: null, error: "Date is out of range" };
  }

  if (typeof cell === "number") {
    // Excel serial date: days since 1899-12-30.
    if (cell < 20_000 || cell > 80_000)
      return { value: null, error: `Unrecognized date "${cell}"` };
    const utc = new Date(EXCEL_EPOCH + Math.round(cell) * DAY);
    const date = localDate(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate());
    return date ? { value: date } : { value: null, error: "Date is out of range" };
  }

  const raw = String(cell).trim();
  const date = parseDateText(raw);
  return date ? { value: date } : { value: null, error: `Unrecognized date "${raw}"` };
}

const STATUS_ALIASES: Record<string, Status> = {
  wishlist: "Not Applied",
  saved: "Not Applied",
  bookmarked: "Not Applied",
  planned: "Not Applied",
  "to apply": "Not Applied",
  submitted: "Applied",
  pending: "Applied",
  "in review": "Applied",
  "under review": "Applied",
  screen: "Phone Screen",
  screening: "Phone Screen",
  interview: "Phone Screen",
  interviewing: "Phone Screen",
  "interview scheduled": "Phone Screen",
  onsite: "Phone Screen",
  offered: "Offer",
  "offer received": "Offer",
  accepted: "Hired",
  "offer accepted": "Hired",
  rejection: "Rejected",
  declined: "Rejected",
  "no response": "Ghosted",
  "no reply": "Ghosted",
  blacklisted: "Blacklist",
  avoid: "Blacklist",
};

export function parseStatus(cell: Cell): Parsed<Status> {
  const raw = cellText(cell);
  if (raw === "") return { value: "Applied" };
  const key = raw.toLowerCase().replace(/[\s_-]+/g, " ");
  const exact = STATUSES.find((s) => s.toLowerCase() === key);
  if (exact) return { value: exact };
  const alias = STATUS_ALIASES[key];
  if (alias) return { value: alias };
  return { value: "Applied", error: `Unknown status "${raw}"` };
}

function guessUnit(amount: number): PayUnit {
  return amount < 1000 ? "hour" : "year";
}

function formatAmount(amount: number) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

/** "$120,000", "120k", "45/hr" and plain numbers. Anything without digits is kept as text. */
export function parsePay(cell: Cell): Parsed<{ pay: string; unit?: PayUnit }> {
  if (cell === null || cell === undefined || cell === "") return { value: { pay: "" } };
  if (typeof cell === "number") {
    if (cell <= 0) return { value: { pay: "" } };
    return { value: { pay: formatAmount(cell), unit: guessUnit(cell) } };
  }

  const raw = String(cell).trim();
  const lower = raw.toLowerCase();
  const unit: PayUnit | undefined = /\b(hourly|per hour|an hour)\b|\/\s*(h|hr|hour)\b/.test(lower)
    ? "hour"
    : /\b(yearly|annual|annually|per year|a year|per annum|salary)\b|\/\s*(y|yr|year|annum)\b/.test(
          lower,
        )
      ? "year"
      : undefined;

  const match = lower.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(k|m)?\b/);
  if (!match) return { value: { pay: raw.slice(0, 32) } };

  let amount = Number(match[1]);
  if (match[2] === "k") amount *= 1_000;
  if (match[2] === "m") amount *= 1_000_000;
  if (amount <= 0) return { value: { pay: "" } };
  return { value: { pay: formatAmount(amount), unit: unit ?? guessUnit(amount) } };
}

export function parsePayUnit(cell: Cell): Parsed<PayUnit | undefined> {
  const raw = cellText(cell).toLowerCase();
  if (raw === "") return { value: undefined };
  if (/^(\/?(h|hr|hour)|hourly|per hour)$/.test(raw)) return { value: "hour" };
  if (/^(\/?(y|yr|year|annum)|yearly|annual|annually|per year|per annum|salary)$/.test(raw)) {
    return { value: "year" };
  }
  return { value: undefined, error: `Unknown pay unit "${raw}"` };
}

function parseLink(cell: Cell) {
  const raw = cellText(cell);
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
  const looksLikeHost = /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(raw);
  return raw && !hasScheme && looksLikeHost ? `https://${raw}` : raw;
}

export type ImportRow = {
  /** 1-based row number in the file, header row excluded. */
  line: number;
  input: ApplicationInput;
  errors: string[];
  /** An application the user already tracks with the same company and role. */
  duplicateOf?: Application;
  /** An earlier row in the same file has the same company and role. */
  duplicateInFile?: boolean;
};

function duplicateKey(company: string, role: string) {
  return `${company.trim().toLowerCase()}|${role.trim().toLowerCase()}`;
}

/** Turns sheet rows into validated inputs, flagging problems instead of dropping rows. */
export function buildRows(sheet: Sheet, mapping: Mapping, existing: Application[]): ImportRow[] {
  const byKey = new Map<string, Application>();
  for (const app of existing) {
    const key = duplicateKey(app.company_name, app.role);
    if (!byKey.has(key)) byKey.set(key, app);
  }
  const seen = new Set<string>();

  return sheet.rows.map((cells, i) => {
    const cell = (field: ImportField): Cell => {
      const idx = mapping[field];
      return idx === undefined ? null : cells[idx];
    };
    const errors: string[] = [];

    const date = parseDate(cell("date_applied"));
    if (date.error) errors.push(date.error);
    const planned = parseDate(cell("planned_date"));
    if (planned.error) errors.push(`Planned date: ${planned.error}`);
    const followUp = parseDate(cell("follow_up_date"));
    if (followUp.error) errors.push(`Follow-up date: ${followUp.error}`);
    const status = parseStatus(cell("status"));
    if (status.error) errors.push(status.error);
    const pay = parsePay(cell("pay"));
    const unit = parsePayUnit(cell("pay_unit"));
    if (unit.error) errors.push(unit.error);

    const input: ApplicationInput = {
      company_name: cellText(cell("company_name")),
      role: cellText(cell("role")),
      location: cellText(cell("location")),
      status: status.value,
      date_applied: date.value,
      planned_date: planned.value,
      follow_up_date: followUp.value,
      notes: cellText(cell("notes")).slice(0, NOTES_LIMIT),
      link: parseLink(cell("link")),
      pay: pay.value.pay,
      pay_unit: unit.value ?? pay.value.unit ?? "year",
    };

    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        const label = typeof field === "string" ? (FIELD_LABEL[field as ImportField] ?? field) : "";
        errors.push(label ? `${label}: ${issue.message}` : issue.message);
      }
    }

    const row: ImportRow = { line: i + 1, input: parsed.success ? parsed.data : input, errors };
    if (parsed.success) {
      const key = duplicateKey(input.company_name, input.role);
      const match = byKey.get(key);
      if (match) row.duplicateOf = match;
      if (seen.has(key)) row.duplicateInFile = true;
      seen.add(key);
    }
    return row;
  });
}

export type DuplicateStrategy = "skip" | "replace" | "keep";

export type ImportPlan = {
  payload: ImportRowInput[];
  adding: number;
  replacing: number;
  skipped: number;
  invalid: number;
};

/** Applies the duplicate strategy and drops invalid rows. */
export function planImport(rows: ImportRow[], strategy: DuplicateStrategy): ImportPlan {
  const plan: ImportPlan = { payload: [], adding: 0, replacing: 0, skipped: 0, invalid: 0 };
  for (const row of rows) {
    if (row.errors.length > 0) {
      plan.invalid += 1;
      continue;
    }
    if (row.duplicateInFile && strategy !== "keep") {
      plan.skipped += 1;
      continue;
    }
    if (row.duplicateOf && strategy === "skip") {
      plan.skipped += 1;
      continue;
    }
    if (row.duplicateOf && strategy === "replace") {
      plan.payload.push({ input: row.input, replaceId: row.duplicateOf.id });
      plan.replacing += 1;
      continue;
    }
    plan.payload.push({ input: row.input });
    plan.adding += 1;
  }
  return plan;
}
