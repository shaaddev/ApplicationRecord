/**
 * Shared by the upload control (client), the server action, and the download
 * route. Keep this file free of server-only imports.
 */

/** Vercel caps request bodies at 4.5MB, so 4MB leaves room for multipart overhead. */
export const RESUME_MAX_BYTES = 4 * 1024 * 1024;

export const RESUME_ACCEPT = "application/pdf,.pdf";

export type ResumeMeta = {
  file_name: string;
  size: number;
  updated_at: Date;
};

export function resumeUrl(applicationId: number) {
  return `/api/applications/${applicationId}/resume`;
}

export function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function looksLikePdf(file: { name: string; type: string }) {
  return file.type === "application/pdf" || (file.type === "" && /\.pdf$/i.test(file.name));
}

/** Cheap checks that run in the browser before upload and again on the server. */
export function checkResumeFile(file: { name: string; size: number; type: string }) {
  if (!looksLikePdf(file)) return "Only PDF files are supported for now.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > RESUME_MAX_BYTES) return `Keep it under ${formatBytes(RESUME_MAX_BYTES)}.`;
  return null;
}

/** PDF files start with `%PDF-`, sometimes after a few bytes of junk. */
export function hasPdfHeader(bytes: Uint8Array) {
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 1024));
  return head.includes("%PDF-");
}

/** Strips paths and control characters, keeps the name readable, and forces a .pdf suffix. */
export function cleanFileName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? "";
  let cleaned = Array.from(base)
    .filter((c) => {
      const code = c.charCodeAt(0);
      return code >= 32 && code !== 127 && c !== '"';
    })
    .join("")
    .trim();
  if (!cleaned || cleaned.toLowerCase() === ".pdf") cleaned = "resume.pdf";
  if (!/\.pdf$/i.test(cleaned)) cleaned += ".pdf";
  if (cleaned.length > 120) cleaned = `${cleaned.slice(0, 116)}.pdf`;
  return cleaned;
}
