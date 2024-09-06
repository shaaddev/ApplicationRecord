import { LoginForm } from "@/components/Forms/login-form"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export default async function Login(){
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user){
    redirect('/api/auth/login')
  }
  return(
    <main className="flex items-center justify-center m-auto max-w-screen-xl">
      <LoginForm />
    </main>
  )
}