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
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { createAction } from "./actions"
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker } from "./date-picker"
import { format } from "date-fns"

const formSchema = z.object({
  role: z.string().min(1, { message: 'Required' }),
  company_name: z.string().min(1, { message: 'Required' }),
  location: z.string().min(1, { message: 'Required' }),
  status: z.string().min(1, { message: 'Required' }),
  date_applied: z.date().optional(),
  link: z.string().optional(),
  salary: z.number().positive().optional(),
  rate: z.enum(['hourly', 'weekly', 'monthly', 'yearly']).optional()
})

export function CreateForm(){
  const [isPending, setIsPending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      company_name: '',
      location: '',
      status: '',
      date_applied: undefined,
      link: '',
      salary: undefined,
      rate: 'hourly'
    },
  })

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPending(true)
    
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'date_applied' && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as string);
        }
      }
    }

    try {
      const result = await createAction(formData)

      if (result.success) {
        toast.success('Submitted Successfully', {
          description: 'Application Added'
        })
        form.reset();
      } else {
        toast.error('Submission failed', {
          description: result.error || 'An unknown error occurred'
        })
      }
    } catch (error){
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
                  <Select onValueChange={field.onChange}>
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
                {isMobile ? (
                  <FormControl>
                    <Input 
                      type="date"
                      {...field}
                      value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = new Date(e.target.value)
                        field.onChange(isNaN(date.getTime()) ? undefined : date)
                      }}
                    />
                  </FormControl>
                ): (
                  <>
                    <DatePicker 
                      value={field.value} 
                      onChange={(date: Date | undefined) => field.onChange(date)}
                    />
                  </>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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
          {/* <div className="flex flex-row items-end w-full"> */}
            <FormField 
              control={form.control}
              name="salary"
              render={({ field}) => (
                <FormItem>
                  <FormLabel>Salary (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className=""  
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField 
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[120px] rounded-l-none border-l-none">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            /> */}
          {/* </div> */}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}