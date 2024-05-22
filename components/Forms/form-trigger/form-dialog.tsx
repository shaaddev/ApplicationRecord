import { DialogTrigger, DialogContent } from '@/components/ui/dialog'

export function FormDialog({ children }: { children: React.ReactNode}) {
  return(
    <>
      <DialogContent className='p-1'>
        <div className='flex flex-col items-center justify-center'>
          {children}
        </div>
      </DialogContent>
    </>
  )
}