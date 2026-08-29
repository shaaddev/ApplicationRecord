"use server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { updateApplicationStatus } from "@/db/queries";

export const updateAction = async (formData: FormData, id: string) => {
  const user = await getUser();
  if (!user) {
    return {
      success: false,
      error: "Sign in to update an application",
    };
  }

  const new_status = formData.get("new_status") as string;

  if (!id || !new_status) {
    return {
      success: false,
      error: "Missing required fields",
    };
  }

  try {
    await updateApplicationStatus(new_status, id, user.id);

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return {
      success: false,
      error: "Failed to update status",
    };
  }
};
