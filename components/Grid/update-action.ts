'use server'
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { applications } from '@/db/schema/applications';
import { eq } from 'drizzle-orm';

export const updateAction = async (formData: FormData, id: string) => {
  const new_status = formData.get('new_status') as string

  if (!id || !new_status) {
    return {
      success: false,
      message: 'Missing required fields',
    }
  }

  try {
    await db.update(applications)
      .set({
        status: new_status as string,
      })
      .where(eq(applications.id, parseInt(id)));


    revalidatePath('/')

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