import { db } from ".";
import { eq, desc, and } from "drizzle-orm";
import { applications } from "./schema";
import type { ApplicationInput, Status } from "@/lib/applications";

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
    salary: input.salary || null,
  };
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
