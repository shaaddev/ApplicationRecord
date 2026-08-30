import { db } from ".";
import { eq, desc, and } from "drizzle-orm";
import { applications, resumes } from "./schema";
import type { Application, ApplicationInput, Status } from "@/lib/applications";
import type { ImportRowInput } from "@/lib/import/shared";

const resumeMeta = {
  file_name: resumes.file_name,
  size: resumes.size,
  updated_at: resumes.updated_at,
};

export async function getUserApplications(userId: string): Promise<Application[]> {
  const rows = await db
    .select({ application: applications, resume: resumeMeta })
    .from(applications)
    .leftJoin(resumes, eq(resumes.application_id, applications.id))
    .where(eq(applications.user_id, userId))
    .orderBy(desc(applications.id));
  return rows.map(({ application, resume }) => ({ ...application, resume }));
}

function toRow(input: ApplicationInput) {
  return {
    role: input.role,
    company_name: input.company_name,
    location: input.location,
    status: input.status,
    date_applied: input.date_applied,
    planned_date: input.planned_date,
    follow_up_date: input.follow_up_date,
    notes: input.notes || null,
    link: input.link || null,
    salary: input.pay_unit === "year" ? input.pay || null : null,
    rate: input.pay_unit === "hour" ? input.pay || null : null,
  };
}

/**
 * Inserts new rows and overwrites the ones flagged with `replaceId`, all in one
 * transaction. Replacements are scoped to the user, so a foreign id is a no-op.
 */
export async function importApplications(userId: string, rows: ImportRowInput[]) {
  return db.transaction(async (tx) => {
    const inserts = rows
      .filter((r) => r.replaceId === undefined)
      .map((r) => ({ ...toRow(r.input), user_id: userId }));
    const inserted =
      inserts.length > 0
        ? (await tx.insert(applications).values(inserts).returning({ id: applications.id })).length
        : 0;

    let replaced = 0;
    for (const r of rows) {
      if (r.replaceId === undefined) continue;
      const updated = await tx
        .update(applications)
        .set({ ...toRow(r.input), updated_at: new Date() })
        .where(and(eq(applications.id, r.replaceId), eq(applications.user_id, userId)))
        .returning({ id: applications.id });
      replaced += updated.length;
    }

    return { inserted, replaced };
  });
}

export async function insertApplication(userId: string, input: ApplicationInput) {
  const [row] = await db
    .insert(applications)
    .values({ ...toRow(input), user_id: userId })
    .returning();
  return row;
}

export async function updateApplication(userId: string, id: number, input: ApplicationInput) {
  const [row] = await db
    .update(applications)
    .set({ ...toRow(input), updated_at: new Date() })
    .where(and(eq(applications.id, id), eq(applications.user_id, userId)))
    .returning();
  return row ?? null;
}

export async function updateApplicationStatus(userId: string, id: number, status: Status) {
  const [row] = await db
    .update(applications)
    .set({ status, updated_at: new Date() })
    .where(and(eq(applications.id, id), eq(applications.user_id, userId)))
    .returning({ id: applications.id });
  return row ?? null;
}

export async function deleteApplication(userId: string, id: number) {
  const deleted = await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.user_id, userId)))
    .returning({ id: applications.id });
  return deleted.length > 0;
}

type ResumeFile = {
  file_name: string;
  content_type: string;
  size: number;
  data: Buffer;
};

/** Inserts or replaces the resume. Returns null when the application is not the user's. */
export async function upsertResume(userId: string, applicationId: number, file: ResumeFile) {
  const [owned] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.user_id, userId)));
  if (!owned) return null;

  const [row] = await db
    .insert(resumes)
    .values({ ...file, application_id: applicationId, user_id: userId })
    .onConflictDoUpdate({
      target: resumes.application_id,
      set: { ...file, user_id: userId, updated_at: new Date() },
    })
    .returning({ id: resumes.id });
  return row ?? null;
}

export async function deleteResume(userId: string, applicationId: number) {
  const deleted = await db
    .delete(resumes)
    .where(and(eq(resumes.application_id, applicationId), eq(resumes.user_id, userId)))
    .returning({ id: resumes.id });
  return deleted.length > 0;
}

export async function getResume(userId: string, applicationId: number) {
  const [row] = await db
    .select({
      file_name: resumes.file_name,
      content_type: resumes.content_type,
      size: resumes.size,
      data: resumes.data,
    })
    .from(resumes)
    .where(and(eq(resumes.application_id, applicationId), eq(resumes.user_id, userId)));
  return row ?? null;
}
