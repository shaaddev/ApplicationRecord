'use client'
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { createAction } from "./createAction";
import { useState } from "react";



export function CreateForm(){
  const { register } = useForm();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)

    try {
      const result = await createAction(formData)

      if (result.success) {
        toast.success('Submitted Successfully', {
          description: 'Application Added'
        })
      } else {
        toast.error('You must fill out all required fields', {
          description: 'Fields Required'
        })
      }
    } catch (error){
      toast.error('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }
  return(
    <>
      <div className="flex flex-col items-center justify-center p-10 w-full lg:p-16">
        <form action={handleSubmit} className="space-y-6 w-full">
            <div>
              <Label htmlFor="role" >Role *</Label>
              <Input 
                id="role"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("role", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input 
                id="company_name"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("company_name", { required: true })}
              />
            </div>
            <div className="flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location"
                  className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                  {...register("location", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select {...register("status", { required: true })}>
                  <SelectTrigger className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2">
                    <SelectValue placeholder="Choose your status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Applied">Not Applied</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Ghosted">Ghosted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="date_applied">Date Applied *</Label>
              <Input 
                id="date_applied"
                type="date"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("date_applied", { required: true })}
              />
            </div>
            <div className="flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6">
              
              <div>
                <Label htmlFor="link">Link (Optional)</Label>
                <Input 
                  id="link"
                  className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                  {...register("link", { required: false })}
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input 
                  id="salary"
                  className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                  {...register("salary", { required: false })}
                />
              </div>
            </div>
            <Button type="submit" className="">Submit</Button>
        </form>
      </div>
    </>
  )
}