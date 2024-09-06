'use server'
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
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