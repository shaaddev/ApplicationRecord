"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUser } from "@/lib/session";
import { applicationSchema, isStatus, type ApplicationInput } from "@/lib/applications";
import { extractJobDetails, type ExtractResult } from "@/lib/job-posting";
import { checkResumeFile, cleanFileName, hasPdfHeader } from "@/lib/resumes";
import { IMPORT_ROW_LIMIT, type ImportRowInput } from "@/lib/import/shared";
import {
  deleteApplication as deleteRow,
  deleteResume as deleteResumeRow,
  importApplications as importRows,
  insertApplication,
  updateApplication as updateRow,
  updateApplicationStatus as updateStatusRow,
  upsertResume,
} from "@/db/queries";

type Result = { ok: true } | { ok: false; error: string };

export type ImportResult =
  | { ok: true; inserted: number; replaced: number }
  | { ok: false; error: string };

const importSchema = z
  .array(
    z.object({
      input: applicationSchema,
      replaceId: z.number().int().positive().optional(),
    }),
  )
  .min(1, "Nothing to import.")
  .max(IMPORT_ROW_LIMIT, `Import up to ${IMPORT_ROW_LIMIT} rows at a time.`);

const PATH = "/application-record";

function fail(error: string): Result {
  return { ok: false, error };
}

export async function createApplication(input: ApplicationInput): Promise<Result> {
  const user = await getUser();
  if (!user) return fail("Sign in to add an application.");

  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");

  try {
    await insertApplication(user.id, parsed.data);
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    console.error("createApplication", error);
    return fail("Could not add the application.");
  }
}

export async function updateApplication(id: number, input: ApplicationInput): Promise<Result> {
  const user = await getUser();
  if (!user) return fail("Sign in to edit an application.");

  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");

  try {
    const row = await updateRow(user.id, id, parsed.data);
    if (!row) return fail("Application not found.");
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    console.error("updateApplication", error);
    return fail("Could not save the application.");
  }
}

export async function updateApplicationStatus(id: number, status: string): Promise<Result> {
  const user = await getUser();
  if (!user) return fail("Sign in to update an application.");
  if (!isStatus(status)) return fail("Unknown status.");

  try {
    const row = await updateStatusRow(user.id, id, status);
    if (!row) return fail("Application not found.");
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    console.error("updateApplicationStatus", error);
    return fail("Could not update the status.");
  }
}

export async function deleteApplication(id: number): Promise<Result> {
  const user = await getUser();
  if (!user) return fail("Sign in to delete an application.");

  try {
    const deleted = await deleteRow(user.id, id);
    if (!deleted) return fail("Application not found.");
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    console.error("deleteApplication", error);
    return fail("Could not delete the application.");
  }
}

export async function autofillFromLink(url: string): Promise<ExtractResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to use autofill." };
  if (typeof url !== "string" || url.length > 2048) return { ok: false, error: "Check the link." };

  try {
    return await extractJobDetails(url);
  } catch (error) {
    console.error("autofillFromLink", error);
    return { ok: false, error: "Could not read that page." };
  }
}

/** Expects a multipart body with a single `file` field holding a PDF. Replaces any existing resume. */
export async function uploadResume(id: number, formData: FormData): Promise<Result> {
  const user = await getUser();
  if (!user) return fail("Sign in to upload a resume.");
  if (!Number.isInteger(id)) return fail("Application not found.");

  const file = formData.get("file");
  if (!(file instanceof File)) return fail("Choose a PDF to upload.");

  const problem = checkResumeFile(file);
  if (problem) return fail(problem);

  const data = Buffer.from(await file.arrayBuffer());
  if (!hasPdfHeader(data)) return fail("That file is not a PDF.");

  try {
    const row = await upsertResume(user.id, id, {
      file_name: cleanFileName(file.name),
      content_type: "application/pdf",
      size: data.byteLength,
      data,
    });
    if (!row) return fail("Application not found.");
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    console.error("uploadResume", error);
    return fail("Could not upload the resume.");
  }
}

export async function removeResume(id: number): Promise<Result> {
  const user = await getUser();
  if (!user) return fail("Sign in to remove a resume.");

  try {
    const deleted = await deleteResumeRow(user.id, id);
    if (!deleted) return fail("No resume attached.");
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    console.error("removeResume", error);
    return fail("Could not remove the resume.");
  }
}

export async function importApplications(rows: ImportRowInput[]): Promise<ImportResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to import applications." };

  const parsed = importSchema.safeParse(rows);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const row = typeof issue?.path[0] === "number" ? issue.path[0] + 1 : null;
    const message = issue?.message ?? "Check the file.";
    return { ok: false, error: row ? `Row ${row}: ${message}` : message };
  }

  try {
    const result = await importRows(user.id, parsed.data);
    revalidatePath(PATH);
    return { ok: true, ...result };
  } catch (error) {
    console.error("importApplications", error);
    return { ok: false, error: "Could not import the applications." };
  }
}
