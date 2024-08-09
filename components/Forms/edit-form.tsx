'use client'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button'


export function EditForm({
  id, role, company_name, location, status, date_applied, link, salary
}: JobProps){
  const { register, setValue } = useForm();

  useEffect(() => {
    setValue('new_role', role);
    setValue('new_company_name', company_name);
    setValue('new_location', location);
    setValue('new_status', status);
    setValue('new_date_applied', date_applied);
    setValue('new_link', link);
    setValue('new_salary', salary);
  }, [setValue, role, company_name, location, status, date_applied, link, salary])

  const { toast } = useToast();

  const onSubmit = () => {
    toast({
      title: 'Check supabase',
      description: '...'
    })
  }
  
  return(
    <>
      <div className="flex flex-col items-center justify-center p-5 lg:p-16">
        <form onSubmit={ async (e) => { 
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await editAction(formData, id!) 
          
            }} className="space-y-6 w-full"
          >
            <div>
              <Label htmlFor="role" >Role</Label>
              <Input 
                id="role"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("new_role", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input 
                id="company_name"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("new_company_name", { required: true })}
              />
            </div>
            <div className="flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                  {...register("new_location", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={status} {...register("new_status", { required: true })}>
                  <SelectTrigger className='border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2'>
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
            <div>
              <Label htmlFor="date_applied">Date Applied</Label>
              <Input 
                id="date_applied"
                type="date"
                className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                {...register("new_date_applied", { required: true })}
              />
            </div>
            <div className="flex flex-col justify-center lg:grid lg:grid-cols-2 lg:gap-6">
              
              <div>
                <Label htmlFor="link">Link</Label>
                <Input 
                  id="link"
                  className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                  {...register("new_link", { required: false })}
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input 
                  id="salary"
                  className="border border-black border-opacity-10 dark:border-white dark:border-opacity-15 dark:bg-inherit mt-2"
                  {...register("new_salary", { required: false })}
                />
              </div>
            </div>
            <Button type="submit" onClick={onSubmit} className="">Submit</Button>
        </form>
      </div>
    </>
  )
}