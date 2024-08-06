"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

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

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/'
  url = url.startsWith('http') ? url :
    `https://${url}`

  url = url.endsWith('/') ? url : `${url}/`
  return url
}

console.log(getURL())

export const signInWithGitHubAction = async () => {
  const supabase = createClient()
  const origin = headers().get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${getURL()}/auth/callback`,
    }
  })

  if (error){
    return redirect('/error')
  } else {
    return redirect(data.url)
  }
}


export const signInWithGoogleAction = async () => {
  const supabase = createClient()
  const origin = headers().get('origin')


  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })

  if (error){
    return redirect('/error')
  } else {
    return redirect(data.url)
  }
}