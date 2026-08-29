/**
 * Only allow same-origin relative paths for post-login redirects so a crafted
 * `?next=` cannot bounce users to another site.
 */
export function safeNextPath(next: string | undefined, fallback = "/application-record") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
