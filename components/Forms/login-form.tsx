'use client'
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { loginAction } from "./authActions";
import Link from "next/link";
import { AuthAltBtns } from "./auth-alt-btns";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from "sonner";
import Markdown from "react-markdown";


const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Email is invalid" }),
  password: z.string().min(6, { message: "Password is required" }),
})

export function LoginForm(){
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPending(true)

    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (value) {
        formData.append(key, value);
      }
    }

    try {
      const result = await loginAction(formData)

      if (result.success){
        toast.success('Login Successful', {
          description: 'Redirecting...'
        })

        window.location.href=`${result.redirect}`
      } else {
        toast.error('Login Failed')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return(
    <>
      <div className="flex flex-col items-center justify-center p-5 lg:p-16 w-full lg:w-3/5">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <div className="p-5 flex flex-col items-center justify-center gap-6 bg-neutral-800 rounded-xl text-white m-5">
          <p>We are currently having issues with the Authentication provider right now. </p>
          <p>
            <Markdown>
              Please feel free to use **one** of the following providers below.
            </Markdown>
          </p>
          Sorry for the inconvenience.
        </div>
        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <FormField 
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {`We'll never share your email.`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit">Login</Button>
          </form>
        </Form>   */}
        {/* <div className="flex flex-col items-end justify-center w-full my-5">
          <p className="text-sm text-slate-500 dark:text-slate-300 mb-5">{`Don't have an account?`}</p>
          <Link href="/signup">
            <Button type="button">Sign up</Button>
          </Link>
        </div> */}

        <AuthAltBtns />
      </div>
    </>
  )
}