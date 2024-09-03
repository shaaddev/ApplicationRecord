'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { editAction } from './editAction';
import { JobProps } from '@/lib/info';
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "./date-picker"

const formSchema = z.object({
  role: z.string().min(1, { message: 'Required' }),
  company_name: z.string().min(1, { message: 'Required' }),
  location: z.string().min(1, { message: 'Required' }),
  status: z.string().min(1, { message: 'Required' }),
  date_applied: z.date().optional(),
  link: z.string().optional(),
  salary: z.string().optional(),
})

interface EditFormProps extends JobProps {
  onSuccess?: () => void;
}

export function EditForm({
  id, role, company_name, location, status, date_applied, link, salary, onSuccess
}: EditFormProps){
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: role,
      company_name: company_name,
      location: location,
      status: status,
      date_applied: date_applied ? new Date(date_applied) : undefined,
      link: link || '',
      salary: salary || '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPending(true)
    
    const formData = new FormData();
    formData.append('id', id!);

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null) {
        if (key === 'date_applied' && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value.trim());
        } else if (value !== '') {
          formData.append(key, String(value));
        }
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
        toast.error('Update failed', {
          description: result.error || 'An unknown error occurred'
        })
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }
  
  return(
    <div className="flex flex-col items-center justify-center p-10 w-full lg:p-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormField 
            control={form.control}
            name="role"
            render={({ field}) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="company_name"
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
          <div className="flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6">
            <FormField 
              control={form.control}
              name="location"
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
              name="status"
              render={({ field}) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2">
                        <SelectValue placeholder="Choose your status"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Not Applied">Not Applied</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Hired">Hired</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Ghosted">Ghosted</SelectItem>
                      <SelectItem value="Blacklist">Blacklist</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField 
            control={form.control}
            name="date_applied"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Applied (Optional)</FormLabel>
                <DatePicker 
                  value={field.value} 
                  onChange={(date: Date | undefined) => field.onChange(date)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6">
            <FormField 
              control={form.control}
              name="link"
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
              name="salary"
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
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </Form>
    </div>
  )
}