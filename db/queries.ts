import { db } from ".";
import { eq, desc, and } from "drizzle-orm";
import { applications } from "./schema";
import type { ApplicationInput, Status } from "@/lib/applications";
import type { ImportRowInput } from "@/lib/import/shared";

export async function getUserApplications(userId: string) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.user_id, userId))
    .orderBy(desc(applications.id));
}

function toRow(input: ApplicationInput) {
  return {
    role: input.role,
    company_name: input.company_name,
    location: input.location,
    status: input.status,
    date_applied: input.date_applied,
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
