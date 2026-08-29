import { z } from "zod";
import type { applications } from "@/db/schema";

export type Application = typeof applications.$inferSelect;

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
  neutral: "bg-status-neutral/12 text-status-neutral",
  info: "bg-status-info/15 text-status-info",
  progress: "bg-status-progress/12 text-status-progress",
  success: "bg-status-success/12 text-status-success",
  danger: "bg-status-danger/12 text-status-danger",
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
  salary: z.string().trim().max(32),
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
    salary: app?.salary ?? "",
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

export function formatSalary(salary: string | null) {
  if (!salary) return null;
  const n = Number(salary);
  return Number.isFinite(n) && n > 0 ? salaryFormatter.format(n) : salary;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : null;
}
