import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

/**
 * Pulls role, company, location, and salary out of a job posting URL.
 *
 * Order of operations, each step only filling what the previous left empty:
 * 1. Greenhouse and Lever links: call their public job-board APIs.
 * 2. Fetch the page (10s timeout, 1.5MB cap, public hosts only) and read
 *    schema.org JobPosting JSON-LD. Ashby, Indeed, Workable, and most ATS
 *    pages have it, and it's exact.
 * 3. Ask Gemini to read the visible page text (needs GOOGLE_GENERATIVE_AI_API_KEY).
 * 4. Parse "Role at Company" out of the page title.
 */

export type JobDetails = {
  role: string | null;
  company_name: string | null;
  location: string | null;
  /** Annual salary as a whole number string, matching the form's salary field. */
  salary: string | null;
};

export type ExtractResult = { ok: true; data: JobDetails } | { ok: false; error: string };

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BYTES = 1_500_000;
const MAX_PROMPT_CHARS = 12_000;
const MAX_FIELD = 120;

const EMPTY: JobDetails = { role: null, company_name: null, location: null, salary: null };

export async function extractJobDetails(rawUrl: string): Promise<ExtractResult> {
  const url = parseUrl(rawUrl);
  if (!url) return { ok: false, error: "Enter a full link that starts with http:// or https://." };

  if (!(await isPublicHost(url.hostname))) {
    return { ok: false, error: "That link points to a private address." };
  }

  let details = (await fromKnownAts(url)) ?? EMPTY;

  if (needsMore(details)) {
    let html: string;
    try {
      html = await fetchPage(url);
    } catch (error) {
      if (!isEmpty(details)) return { ok: true, data: details };
      return {
        ok: false,
        error: error instanceof FetchError ? error.message : "Could not load that page.",
      };
    }

    details = merge(details, readJsonLd(html));

    if (needsMore(details)) {
      const page = pageText(html);
      if (hasAiKey() && (page.body.length > 0 || page.title)) {
        try {
          details = merge(details, await readWithAi(url, page));
        } catch (error) {
          console.error("extractJobDetails ai", error);
        }
      }
      details = merge(details, fromTitle(page));
    }
  }

  if (isEmpty(details)) {
    return {
      ok: false,
      error: hasAiKey()
        ? "Couldn't find job details on that page. It may need a login or load with JavaScript."
        : "Couldn't find job details on that page.",
    };
  }

  return { ok: true, data: details };
}

/* ---------------------------------- URL ---------------------------------- */

function parseUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6 === "::" || v6 === "::1") return true;
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  const head = parseInt(v6.split(":")[0] || "0", 16);
  return (head & 0xfe00) === 0xfc00 || (head & 0xffc0) === 0xfe80;
}

async function isPublicHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return false;
  if (isIP(host)) return !isPrivateIp(host);
  try {
    const records = await lookup(host, { all: true });
    return records.length > 0 && records.every((r) => !isPrivateIp(r.address));
  } catch {
    return false;
  }
}

/* --------------------------------- fetch --------------------------------- */

class FetchError extends Error {}

async function fetchPage(url: URL) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 LandIt/1.0",
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
        "accept-language": "en-US,en;q=0.8",
      },
    });
  } catch (error) {
    clearTimeout(timer);
    if (controller.signal.aborted) throw new FetchError("That page took too long to load.");
    throw new FetchError("Could not reach that page.");
  }

  try {
    const finalHost = new URL(res.url || url.href).hostname;
    if (finalHost !== url.hostname && !(await isPublicHost(finalHost))) {
      throw new FetchError("That link redirects to a private address.");
    }
    if (res.status === 401 || res.status === 403) {
      throw new FetchError("That page needs a login, so it can't be read.");
    }
    if (!res.ok) throw new FetchError(`That page returned an error (${res.status}).`);

    const type = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml\+xml|text\/plain/i.test(type)) {
      throw new FetchError("That link isn't a web page.");
    }

    return await readCapped(res, MAX_BYTES);
  } finally {
    clearTimeout(timer);
  }
}

async function readCapped(res: Response, max: number) {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < max) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  await reader.cancel().catch(() => {});
  const joined = new Uint8Array(Math.min(total, max));
  let offset = 0;
  for (const chunk of chunks) {
    const slice = chunk.subarray(0, Math.max(0, joined.length - offset));
    joined.set(slice, offset);
    offset += slice.length;
    if (offset >= joined.length) break;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(joined);
}

/* ------------------------------ ATS adapters ----------------------------- */

/**
 * Greenhouse and Lever publish job-board APIs. Hitting those is exact and
 * skips the scrape, which matters because Greenhouse's newer boards render
 * client-side with no JSON-LD. Anything that fails here falls through to the
 * generic path.
 */
async function fromKnownAts(url: URL): Promise<JobDetails | null> {
  try {
    if (/^(job-boards|boards)\.greenhouse\.io$/.test(url.hostname)) {
      const m = url.pathname.match(/^\/([^/]+)\/jobs\/(\d+)/);
      if (m) return await greenhouseJob(m[1]!, m[2]!);
    }
    if (url.hostname === "jobs.lever.co") {
      const m = url.pathname.match(/^\/([^/]+)\/([0-9a-f-]{36})/i);
      if (m) return await leverPosting(m[1]!, m[2]!);
    }
  } catch (error) {
    console.error("fromKnownAts", error);
  }
  return null;
}

async function greenhouseJob(board: string, id: string): Promise<JobDetails | null> {
  const job = obj(
    await fetchJson(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${id}`),
  );
  if (!job) return null;
  return {
    role: clean(str(job.title)),
    company_name: clean(str(job.company_name)),
    location: clean(str(obj(job.location)?.name)),
    salary: null,
  };
}

async function leverPosting(company: string, id: string): Promise<JobDetails | null> {
  const job = obj(await fetchJson(`https://api.lever.co/v0/postings/${company}/${id}`));
  if (!job) return null;
  const categories = obj(job.categories);
  const range = obj(job.salaryRange);
  const yearly = !range?.interval || /year/i.test(String(range.interval));
  const remote = String(job.workplaceType ?? "").toLowerCase() === "remote";
  const place = str(categories?.location);
  return {
    role: clean(str(job.text)),
    company_name: null,
    location: clean(remote ? (place ? `Remote (${place})` : "Remote") : place),
    salary: yearly ? toSalary(num(range?.min) ?? num(range?.max)) : null,
  };
}

async function fetchJson(href: string): Promise<Json | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(href, {
      signal: controller.signal,
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as Json;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------- JSON-LD -------------------------------- */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function readJsonLd(html: string): JobDetails {
  const blocks = html.matchAll(
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const match of blocks) {
    const parsed = parseJson(match[1]!.trim());
    if (parsed === undefined) continue;
    const posting = findJobPosting(parsed);
    if (posting) return fromJobPosting(posting);
  }
  return EMPTY;
}

/** Raw JSON first; a few sites entity-encode the block, so retry decoded. */
function parseJson(text: string): Json | undefined {
  for (const candidate of [text, decodeEntities(text)]) {
    try {
      return JSON.parse(candidate) as Json;
    } catch {
      continue;
    }
  }
  return undefined;
}

function findJobPosting(node: Json, depth = 0): Record<string, Json> | null {
  if (depth > 4 || node === null || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findJobPosting(item, depth + 1);
      if (hit) return hit;
    }
    return null;
  }
  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.some((t) => typeof t === "string" && t.toLowerCase() === "jobposting")) return node;
  for (const key of ["@graph", "mainEntity", "itemListElement", "item"]) {
    if (key in node) {
      const hit = findJobPosting(node[key]!, depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

function fromJobPosting(job: Record<string, Json>): JobDetails {
  const org = obj(job.hiringOrganization);
  const locations = Array.isArray(job.jobLocation) ? job.jobLocation : [job.jobLocation];
  const remote =
    typeof job.jobLocationType === "string" && /telecommute|remote/i.test(job.jobLocationType);

  const places = locations
    .map((loc) => {
      const address = obj(obj(loc)?.address) ?? obj(loc);
      if (!address) return typeof loc === "string" ? loc : null;
      if (typeof address === "object" && Object.keys(address).length === 0) return null;
      const parts = [address.addressLocality, address.addressRegion]
        .map(str)
        .filter((s): s is string => Boolean(s));
      if (parts.length === 0) {
        const country = str(address.addressCountry) ?? str(obj(address.addressCountry)?.name);
        return country ?? str(address.name);
      }
      return parts.join(", ");
    })
    .filter((p): p is string => Boolean(p));

  const location = remote
    ? places.length > 0
      ? `Remote (${places[0]})`
      : "Remote"
    : (places[0] ?? null);

  return {
    role: clean(str(job.title)),
    company_name: clean(str(org?.name) ?? str(job.hiringOrganization)),
    location: clean(location),
    salary: annualSalary(job.baseSalary),
  };
}

function annualSalary(base: Json | undefined): string | null {
  const salary = obj(base);
  if (!salary) return null;
  const value = obj(salary.value);
  const unit = String(value?.unitText ?? salary.unitText ?? "").toUpperCase();
  if (unit && unit !== "YEAR") return null;
  const amount =
    num(value?.value) ?? num(value?.minValue) ?? num(salary.value) ?? num(salary.minValue);
  return toSalary(amount);
}

function toSalary(amount: number | null | undefined) {
  if (!amount || !Number.isFinite(amount)) return null;
  const rounded = Math.round(amount);
  // Anything under 1000/year is almost certainly hourly or a placeholder.
  return rounded >= 1000 && rounded < 100_000_000 ? String(rounded) : null;
}

function obj(v: Json | undefined): Record<string, Json> | null {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? v : null;
}

function str(v: Json | undefined): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function num(v: Json | undefined): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  return null;
}

/* -------------------------------- page text ------------------------------ */

type PageText = { title: string | null; siteName: string | null; body: string };

function pageText(html: string): PageText {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const ogTitle = meta(html, "og:title");
  const siteName = meta(html, "og:site_name");

  const body = decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript|svg|template|iframe|head)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/article)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t\f\v ]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, MAX_PROMPT_CHARS);

  return { title: ogTitle || title || null, siteName, body };
}

function meta(html: string, name: string) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)\\s*=\\s*["']${name.replace(":", "\\:")}["'][^>]*content\\s*=\\s*["']([^"']*)["']|<meta[^>]+content\\s*=\\s*["']([^"']*)["'][^>]*(?:property|name)\\s*=\\s*["']${name.replace(":", "\\:")}["']`,
    "i",
  );
  const m = html.match(re);
  const value = (m?.[1] ?? m?.[2] ?? "").trim();
  return value ? decodeEntities(value) : null;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "-",
  mdash: "-",
  hellip: "...",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  bull: "*",
  middot: "*",
};

function decodeEntities(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1]?.toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : whole;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? whole;
  });
}

/* ------------------------------ title fallback --------------------------- */

/**
 * Last resort when there's no structured data and no AI key. Most ATS pages
 * title themselves "Role at Company" or "Job Application for Role at Company".
 */
function fromTitle(page: PageText): JobDetails {
  const title = (page.title ?? "")
    .replace(/\s+[|\u2013-]\s+(careers|jobs|job board).*$/i, "")
    .trim();
  const m = title.match(/^(?:job application for\s+)?(.+?)\s+at\s+(.+?)$/i);
  return {
    role: clean(m?.[1]),
    company_name: clean(m?.[2] ?? page.siteName),
    location: null,
    salary: null,
  };
}

/* ----------------------------------- AI ---------------------------------- */

const aiSchema = z.object({
  role: z
    .string()
    .nullable()
    .describe("The job title exactly as posted, without the company name."),
  company_name: z
    .string()
    .nullable()
    .describe("The hiring company's name. Not the job board's name."),
  location: z
    .string()
    .nullable()
    .describe(
      'City and state/country, e.g. "Austin, TX" or "London, UK". Use "Remote" for remote roles.',
    ),
  annual_salary: z
    .number()
    .nullable()
    .describe(
      "Yearly base salary in the posting's currency as a plain number. Use the low end of a range. Null if only hourly pay or no pay is listed.",
    ),
});

function hasAiKey() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

async function readWithAi(url: URL, page: PageText): Promise<JobDetails> {
  const { object } = await generateObject({
    model: google("gemini-2.0-flash-001"),
    schema: aiSchema,
    temperature: 0,
    system:
      "You read job posting web pages and pull out the facts a job seeker would log in a tracker. " +
      "Only report what the page states. Use null for anything missing, unclear, or that would be a guess. " +
      "If the page is not a job posting (a login wall, a listing index, a 404), return null for every field.",
    prompt: [
      `URL: ${url.href}`,
      page.siteName ? `Site name: ${page.siteName}` : null,
      page.title ? `Page title: ${page.title}` : null,
      "",
      "Page text:",
      page.body || "(no visible text)",
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  return {
    role: clean(object.role),
    company_name: clean(object.company_name),
    location: clean(object.location),
    salary: toSalary(object.annual_salary),
  };
}

/* --------------------------------- merge --------------------------------- */

function clean(v: string | null | undefined): string | null {
  const s = v?.replace(/\s+/g, " ").trim() ?? "";
  return s ? s.slice(0, MAX_FIELD) : null;
}

function needsMore(d: JobDetails) {
  return !d.role || !d.company_name || !d.location;
}

function isEmpty(d: JobDetails) {
  return !d.role && !d.company_name && !d.location && !d.salary;
}

function merge(primary: JobDetails, fallback: JobDetails): JobDetails {
  return {
    role: primary.role ?? fallback.role,
    company_name: primary.company_name ?? fallback.company_name,
    location: primary.location ?? fallback.location,
    salary: primary.salary ?? fallback.salary,
  };
}
