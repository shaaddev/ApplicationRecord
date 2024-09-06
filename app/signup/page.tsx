import { SignupForm } from "@/components/Forms/signup-form"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Signup(){
  const supabase = createClient()

  const { data: { user }} = await supabase.auth.getUser()
  if (!user){
    redirect('/api/auth/login')
  }

  return(
    <main className="flex items-center justify-center m-auto max-w-screen-xl">
      <SignupForm />
    </main>
  )
}