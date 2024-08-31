'use server'
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { applications } from '@/db/schema/applications';
import { createClient } from '@/utils/supabase/server'

export const createAction = async (formData: FormData) => {
  const role = formData.get('role')
  const company_name = formData.get('company_name')
  const location = formData.get('location')
  const status = formData.get('status')
  const date_applied = formData.get('date_applied')
  const link = formData.get('link')
  const salary = formData.get('salary')

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser();


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
      date_applied: date_applied as string || null,
      link: link as string || null,
      salary: salary as string || null,
      user_id: user?.id
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