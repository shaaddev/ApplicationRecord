import { DialogContent, DialogHeader, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { JobProps } from '@/lib/info'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Delete } from '../Grid/application-delete-btn'
import { createClient } from '@/utils/supabase/server'


export async function DetailInfo({ data }: {data: JobProps}){

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return(
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data.role} - {data.status}</DialogTitle>
          <DialogDescription>
            {data.location} 
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col items-start justify-center text-black dark:text-slate-500'>
          <div>
            <p>{data.company_name}</p>
            <p>{data.status}</p>
            <p>{data.date_applied}</p>
          </div>
          {user ? (
            <div className='w-full pt-5 flex justify-between '>
              <Link href={`/edit/${data.id}`}>
                <Button type='button' className='dark:bg-slate-500 dark:text-black'>Edit</Button>
              </Link>
              <Delete id={parseInt(data.id!)}/>
            </div>
          ): null}
        </div>
      </DialogContent>
    </>
  )
}