"use server";
import { revalidatePath } from "next/cache";
import { updateApplicationStatus } from "@/db/queries";

export const updateAction = async (formData: FormData, id: string) => {
  const new_status = formData.get("new_status") as string;

  if (!id || !new_status) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }

  try {
    updateApplicationStatus(new_status, id);

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
