"use server";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { insertApplication, updateApplication } from "@/db/queries";

export const createAction = async (formData: FormData) => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const authed = await isAuthenticated().catch(() => false);

  if (!authed) {
    return {
      success: false,
      message: "You must be signed in to add an application.",
    };
  }

  const user = await getUser();
  const user_id = user?.id;

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
      message: "Missing required fields",
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
      user_id,
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: console.log(error),
    };
  }
};

export const editAction = async (formData: FormData, id: string) => {
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
