'use server'
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { eq } from "drizzle-orm";
import { applications } from '@/db/schema/applications';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const createAction = async (formData: FormData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const role = formData.get('role')
  const company_name = formData.get('company_name')
  const location = formData.get('location')
  const status = formData.get('status')
  const date_applied = formData.get('date_applied') as string | null
  const link = formData.get('link')
  const salary = formData.get('salary')


  if (!role || !company_name || !location || !status) {
    return {
      success: false,
      message: 'Missing required fields',
    }
  }
  
  try {
    await db.insert(applications).values({
      role: role as string,
      company_name: company_name as string,
      location: location as string,
      status: status as string,
      date_applied: date_applied ? new Date(date_applied) : null,
      link: link as string || null,
      salary: salary as string || null,
      user_id: user?.id as string
    })

    revalidatePath("/")

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: console.log(error)
    }

  }
}

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