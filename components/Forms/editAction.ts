"use server"
import { db } from "@/db"
import { applications } from "@/db/schema/applications";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export const editAction = async (formData: FormData, id: string) => {
  const new_role = formData.get('new_role')
  const new_company_name = formData.get('new_company_name')
  const new_location = formData.get('new_location')
  const new_status = formData.get('new_status')
  const new_date_applied = formData.get('new_date_applied')
  const new_link = formData.get('new_link')
  const new_salary = formData.get('new_salary')


  if (!new_role || !new_company_name || !new_location) {
    return {
      success: false,
      error: 'Missing required fields'
    }
  }  

  
  try {
    const result = await db.update(applications)
      .set({
        role: new_role as string,
        company_name: new_company_name as string,
        location: new_location as string,
        date_applied: new_date_applied as string || null,
        link: new_link as string || null,
        salary: new_salary as string || null,
      })
      .where(eq(applications.id, parseInt(id)));

      revalidatePath("/")
    
      return { success: true, redirect: '/application-record' }
  } catch (error){
    return {
      success: false,
      error: console.log(error)
    }
  }
}