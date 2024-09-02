'use client'
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { signupAction } from "./authActions";
import Link from "next/link";
import { AuthAltBtns } from "./auth-alt-btns";
import { toast } from "sonner";
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

const formSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Email is invalid" }),
  password: z.string().min(6, { message: "Password is required" }),
})

export function SignupForm(){
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
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
      const result = await signupAction(formData)

      if (result.success){
        toast.success('Thank you for signing up!', {
          description: 'Please Login to continue',
        })

        window.location.href=`${result.redirect}`
      } else {
        toast.error('You must fill out all required fields')
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 justify-center">
              <FormField 
                control={form.control}
                name="first_name"
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="last_name"
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField 
                control={form.control}
                name="email"
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field}/>
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
                name="password"
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Sign up</Button>
          </form>
        </Form>
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