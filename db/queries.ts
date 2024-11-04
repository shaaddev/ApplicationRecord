import { db } from ".";
import { eq, desc } from "drizzle-orm";
import { applications } from "./schema/applications";

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
    .where(eq(applications.id, parseInt(id)))
    .returning();

  return updatedApplication;
}

export async function updateApplicationStatus(status: string, id: string) {
  await db
    .update(applications)
    .set({
      status: status as string,
    })
    .where(eq(applications.id, parseInt(id)));
}
