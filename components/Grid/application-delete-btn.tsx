'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache';
import { toast } from 'sonner';

export function Delete({id, className}: {id: number, className?: string}){
  const router = useRouter();

  const removeApplication = async () => {
    const confirmed = confirm('Are you sure you want to delete this application?');

    if (confirmed){
      const res = await fetch(`/api/applications?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok){
        throw new Error('Something went wrong');
      }

      toast.success('Application Deleted Successfully')
    } else  {
      toast.error('Application Not Deleted', { description: 'Please try again' })
    }
    
    router.refresh();
  }

  return(
    <>
      <Button type='button' onClick={removeApplication} className={`${className} w-full`}>Delete</Button>
    </>
  )
}