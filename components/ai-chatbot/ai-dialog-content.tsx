import { DialogContent, DialogHeader, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Chatbot } from './chatbot'

export function AiDialogContent() {
  return(
    <DialogContent className='h-[500px] max-w-[425px] p-5'>
      <div className='bg-inherit  flex flex-col items-start justify-start border m-0 p-0'>
        <p className='text-lg font-medium'>Landy</p>
        <p className='text-sm'>AI Customer Support</p>
      </div>
      <div className='relative w-full p-5'>
        <Chatbot />
      </div>
    </DialogContent>
  )
}