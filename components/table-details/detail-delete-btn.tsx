'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache';

export function Delete({id}: {id: number}){
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
    }
    
    router.refresh();
  }

  return(
    <>
      <Button type='button' onClick={removeApplication} className='dark:bg-slate-500 dark:text-black'>Delete</Button>
    </>
  )
}