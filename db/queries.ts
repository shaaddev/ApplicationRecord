import { db } from ".";
import { eq, desc, and } from "drizzle-orm";
import { applications } from "./schema";

export async function getUserApplications(userId: string) {
  const apps = await db
    .select()
    .from(applications)
    .where(eq(applications.user_id, userId))
    .orderBy(desc(applications.id));

  return apps.length > 0 ? apps : null;
}

export async function insertApplication({
  role,
  company_name,
  location,
  status,
  date_applied,
  link,
  salary,
  user_id,
}: any) {
  const [insertedApplication] = await db
    .insert(applications)
    .values({
      role: role,
      company_name: company_name,
      location: location,
      status: status,
      date_applied: date_applied ? new Date(date_applied) : null,
      link: link || null,
      salary: salary || null,
      user_id: user_id,
    })
    .returning();

  return insertedApplication;
}

export async function updateApplication({
  role,
  company_name,
  location,
  status,
  date_applied,
  link,
  salary,
  id,
  user_id,
}: any) {
  const [updatedApplication] = await db
    .update(applications)
    .set({
      role,
      company_name,
      location,
      status,
      date_applied: date_applied ? new Date(date_applied) : null,
      link: link || null,
      salary: salary || null,
      updated_at: new Date(),
    })
    .where(and(eq(applications.id, parseInt(id)), eq(applications.user_id, user_id)))
    .returning();

  return updatedApplication;
}

export async function updateApplicationStatus(status: string, id: string, userId: string) {
  await db
    .update(applications)
    .set({
      status: status as string,
    })
    .where(and(eq(applications.id, parseInt(id)), eq(applications.user_id, userId)));
}

export async function deleteApplication(id: number, userId: string) {
  const deleted = await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.user_id, userId)))
    .returning({ id: applications.id });

  return deleted.length > 0;
}
