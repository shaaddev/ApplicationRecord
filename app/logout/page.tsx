import { signOutAction } from "@/components/Forms/authActions"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Logout() {

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user){
    redirect('/login')
  }


  return(
    <main className="flex flex-col items-center justify-center mx-auto max-w-screen-xl mt-10">
      <p className="mb-5">Are you sure you would like to log out?</p>

      <form action={signOutAction}>
        <Button type="submit">Log Out</Button>
      </form>
    </main>
  )
}