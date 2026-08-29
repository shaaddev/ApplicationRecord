"use server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { insertApplication, updateApplication } from "@/db/queries";

export const createAction = async (formData: FormData) => {
  const user = await getUser();
  if (!user) {
    return {
      success: false,
      error: "Sign in to add an application",
    };
  }

  const role = formData.get("role");
  const company_name = formData.get("company_name");
  const location = formData.get("location");
  const status = formData.get("status");
  const date_applied = formData.get("date_applied") as string | null;
  const link = formData.get("link");
  const salary = formData.get("salary");

  if (!role || !company_name || !location || !status) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  try {
    await insertApplication({
      role,
      company_name,
      location,
      status,
      date_applied,
      link,
      salary,
      user_id: user.id,
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating application:", error);
    return {
      success: false,
      error: "Failed to add application",
    };
  }
};

export const editAction = async (formData: FormData, id: string) => {
  const user = await getUser();
  if (!user) {
    return {
      success: false,
      error: "Sign in to edit an application",
    };
  }

  const role = formData.get("role") as string;
  const company_name = formData.get("company_name") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;
  const date_applied = formData.get("date_applied") as string | null;
  const link = formData.get("link") as string | null;
  const salary = formData.get("salary") as string | null;

  if (!role || !company_name || !location || !status) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  try {
    await updateApplication({
      role,
      company_name,
      location,
      status,
      date_applied,
      link,
      salary,
      id,
      user_id: user.id,
    });

    revalidatePath("/application-record");

    return { success: true, redirect: "/application-record" };
  } catch (error) {
    console.error("Error updating application:", error);
    return {
      success: false,
      error: "Failed to update application",
    };
  }
};
