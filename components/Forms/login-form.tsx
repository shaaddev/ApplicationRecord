'use client'
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { LoginAction } from "./authActions";
import Link from "next/link";

export function LoginForm(){
  const { register } = useForm();

  return(
    <>
      <div className="flex flex-col items-center justify-center p-5 lg:p-16 w-full lg:w-3/5">
        <form action={LoginAction} 
          className="space-y-6 w-full">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password"
              className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
              {...register("password", { required: true })}
            />
          </div>
          <Button type="submit" >Login</Button>
        </form>
        <div className="flex flex-col items-end justify-center w-full my-5">
          <p className="text-sm text-slate-500 dark:text-slate-300 mb-5">{`Don't have an account?`}</p>
          <Link href="/signup">
            <Button type="button">Sign up</Button>
          </Link>
        </div>
      </div>
    </>
  )
}