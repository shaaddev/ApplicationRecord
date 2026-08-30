import { z } from "zod";
import type { applications } from "@/db/schema";
import type { ResumeMeta } from "./resumes";

export type ApplicationRow = typeof applications.$inferSelect;

/** A row plus the metadata of its attached resume, if any. Bytes are never sent to the client. */
export type Application = ApplicationRow & { resume: ResumeMeta | null };

export const STATUSES = [
  "Not Applied",
  "Applied",
  "Phone Screen",
  "Offer",
  "Hired",
  "Rejected",
  "Ghosted",
  "Blacklist",
] as const;

export type Status = (typeof STATUSES)[number];

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

type Tone = "neutral" | "info" | "progress" | "success" | "danger" | "dark";

export const STATUS_TONE: Record<Status, Tone> = {
  "Not Applied": "neutral",
  Applied: "info",
  "Phone Screen": "progress",
  Offer: "success",
  Hired: "success",
  Rejected: "danger",
  Ghosted: "neutral",
  Blacklist: "dark",
};

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-status-neutral/15 text-status-neutral",
  info: "bg-status-info/20 text-status-info",
  progress: "bg-status-progress/18 text-status-progress",
  success: "bg-status-success/18 text-status-success",
  danger: "bg-status-danger/15 text-status-danger",
  dark: "bg-status-dark/12 text-status-dark",
};

export const TONE_DOT_CLASS: Record<Tone, string> = {
  neutral: "bg-status-neutral",
  info: "bg-status-info",
  progress: "bg-status-progress",
  success: "bg-status-success",
  danger: "bg-status-danger",
  dark: "bg-status-dark",
};

/** Yearly pay is stored in `salary`, hourly pay in `rate`. */
export const PAY_UNITS = ["year", "hour"] as const;

export type PayUnit = (typeof PAY_UNITS)[number];

export const PAY_UNIT_LABEL: Record<PayUnit, string> = {
  year: "per year",
  hour: "per hour",
};

/** Working hours in a year, used to compare hourly pay against salaries. */
export const HOURS_PER_YEAR = 2080;

/** Shared by the form (client) and the server actions. */
export const applicationSchema = z.object({
  role: z.string().trim().min(1, "Required").max(120, "Keep it under 120 characters"),
  company_name: z.string().trim().min(1, "Required").max(120, "Keep it under 120 characters"),
  location: z.string().trim().min(1, "Required").max(120, "Keep it under 120 characters"),
  status: z.enum(STATUSES),
  date_applied: z.date().nullable(),
  link: z
    .string()
    .trim()
    .max(2048)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "Must start with http:// or https://"),
  pay: z.string().trim().max(32, "Keep it under 32 characters"),
  pay_unit: z.enum(PAY_UNITS),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export function toFormValues(app?: Application): ApplicationInput {
  return {
    role: app?.role ?? "",
    company_name: app?.company_name ?? "",
    location: app?.location ?? "",
    status: isStatus(app?.status) ? app.status : "Applied",
    date_applied: app?.date_applied ?? null,
    link: app?.link ?? "",
    pay: app?.rate ?? app?.salary ?? "",
    pay_unit: app?.rate ? "hour" : "year",
  };
}

export type Stats = {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  responseRate: number | null;
};

export function computeStats(apps: Application[]): Stats {
  const count = (...s: Status[]) => apps.filter((a) => (s as string[]).includes(a.status)).length;
  const sent = apps.length - count("Not Applied");
  const responded = count("Phone Screen", "Offer", "Hired", "Rejected");
  return {
    total: apps.length,
    active: count("Applied", "Phone Screen", "Offer"),
    interviews: count("Phone Screen", "Offer", "Hired"),
    offers: count("Offer", "Hired"),
    responseRate: sent > 0 ? Math.round((responded / sent) * 100) : null,
  };
}

const salaryFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const hourlyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export type Pay = Pick<Application, "salary" | "rate">;

function positiveNumber(value: string | null) {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Numeric pay with its unit. Hourly wins if both columns are filled. */
export function payAmount(pay: Pay): { amount: number; unit: PayUnit } | null {
  const hourly = positiveNumber(pay.rate);
  if (hourly !== null) return { amount: hourly, unit: "hour" };
  const yearly = positiveNumber(pay.salary);
  if (yearly !== null) return { amount: yearly, unit: "year" };
  return null;
}

/** Pay normalized to a yearly figure so hourly and salaried rows sort together. */
export function annualPay(pay: Pay) {
  const p = payAmount(pay);
  if (!p) return undefined;
  return p.unit === "hour" ? p.amount * HOURS_PER_YEAR : p.amount;
}

/** "$120,000/yr" or "$45/hr". Free text like "Negotiable" is shown as typed. */
export function formatPay(pay: Pay) {
  const p = payAmount(pay);
  if (p) {
    return p.unit === "hour"
      ? `${hourlyFormatter.format(p.amount)}/hr`
      : `${salaryFormatter.format(p.amount)}/yr`;
  }
  return pay.rate || pay.salary || null;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : null;
}
