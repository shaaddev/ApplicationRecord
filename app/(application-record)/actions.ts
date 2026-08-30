"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { applicationSchema, isStatus, type ApplicationInput } from "@/lib/applications";
import { checkResumeFile, cleanFileName, hasPdfHeader } from "@/lib/resumes";
import {
  deleteApplication as deleteRow,
  deleteResume as deleteResumeRow,
  insertApplication,
  updateApplication as updateRow,
  updateApplicationStatus as updateStatusRow,
  upsertResume,
} from "@/db/queries";

type Result = { ok: true } | { ok: false; error: string };

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
