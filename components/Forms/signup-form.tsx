'use client'
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { SignupAction } from "./authActions";
import Link from "next/link";
import { AuthAltBtns } from "./auth-alt-btns";

export function SignupForm(){
  const { register } = useForm();

  return(
    <>
      <div className="flex flex-col items-center justify-center p-5 lg:p-16 w-full lg:w-3/5">
        <form action={ SignupAction } className="space-y-6 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 justify-center">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input 
                id="first_name"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("first_name", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input 
                id="last_name"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("last_name", { required: true })}
                />
            </div>
          </div>
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
              {...register("password", { required: true, minLength: 6 })}
            />
          </div>
          <Button type="submit" >Sign Up</Button>
        </form>
        <div className="flex flex-col items-end justify-center w-full my-5">
          <p className="text-sm text-slate-500 dark:text-slate-300 mb-5">Already have an account? </p>
          <Link href="/login">
            <Button type="button">Login</Button>
          </Link>
        </div>

        <AuthAltBtns />
      </div>
    </>
  )
}