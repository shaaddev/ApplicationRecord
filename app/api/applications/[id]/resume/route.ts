import { getUser } from "@/lib/session";
import { getResume } from "@/db/queries";

/** RFC 6266: an ASCII fallback plus the UTF-8 encoded original name. */
function contentDisposition(fileName: string) {
  const ascii = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return `inline; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new Response("Not found", { status: 404 });

  const resume = await getResume(user.id, id);
  if (!resume) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(resume.data), {
    headers: {
      "Content-Type": resume.content_type,
      "Content-Length": String(resume.size),
      "Content-Disposition": contentDisposition(resume.file_name),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
