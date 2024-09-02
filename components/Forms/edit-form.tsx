'use client'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { editAction } from './editAction';
import { JobProps } from '@/lib/info';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
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
import { DatePicker } from "./date-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface EditFormProps extends JobProps {
  onSuccess?: () => void;
}


const formSchema = z.object({
  new_role: z.string().min(1, { message: 'Required' }),
  new_company_name: z.string().min(1, { message: 'Required' }),
  new_location: z.string().min(1, { message: 'Required' }),
  new_date_applied: z.string().optional(),
  new_link: z.string().optional(),
  new_salary: z.string().optional(),
})

export function EditForm({
  id, role, company_name, location, status, date_applied, link, salary,  onSuccess
}: EditFormProps){
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_role: role,
      new_company_name: company_name,
      new_location: location,
      new_date_applied: date_applied,
      new_link: link,
      new_salary: salary,
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
      const result = await editAction(formData, id!)

      if (result.success){
        toast.success('Updated Successfully', {
          description: 'Application Updated'
        })

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('You must fill out all required fields', {
          description: 'Fields Required'
        })
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }
  
  return(
    <>
      <div className="flex flex-col items-center justify-center p-5 lg:p-16">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 w-full'>
            <FormField 
              control={form.control}
              name="new_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="new_company_name"
              render={({ field}) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="new_location"
              render={({ field}) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="new_date_applied"
              render={({ field}) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date Applied (Optional)</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange}>
                    <FormControl>
                      <Button variant={"outline"}>
                        {field.value ? (
                          format(field.value, "PPP")
                        ): (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                      </Button>
                    </FormControl>
                  </DatePicker>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6'>
              <FormField 
                control={form.control}
                name="new_link"
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>Link (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="new_salary"
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>Salary (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  )
}