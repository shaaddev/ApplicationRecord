"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export const LoginAction = async (formData: FormData) => {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error){
    redirect('/error')
  }

  revalidatePath('/')
  redirect("/")
}

export const SignupAction = async (formData: FormData) => {
  const supabase = createClient()

  const data = {
    display_name: `${formData.get('first_name')} ${formData.get('last_name')}`,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error){
    redirect('/error')
  }

  revalidatePath('/')
  redirect("/login")
}

export const signOutAction = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error){
    redirect('/error')
  }

  revalidatePath('/')
  redirect('/')
}