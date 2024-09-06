"use server"
import { db } from "@/db"
import { applications } from "@/db/schema/applications";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const editAction = async (formData: FormData, id: string) => {
  const role = formData.get('role') as string
  const company_name = formData.get('company_name') as string
  const location = formData.get('location') as string
  const status = formData.get('status') as string
  const date_applied = formData.get('date_applied') as string | null
  const link = formData.get('link') as string | null
  const salary = formData.get('salary') as string | null

  if (!role || !company_name || !location || !status) {
    return {
      success: false,
      error: 'Missing required fields'
    }
  }  

  try {
    await db.update(applications)
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
      .where(eq(applications.id, parseInt(id)));

    revalidatePath("/application-record")
    
    return { success: true, redirect: '/application-record' }
  } catch (error){
    console.error('Error updating application:', error);
    return {
      success: false,
      error: 'Failed to update application'
    }
  }
}