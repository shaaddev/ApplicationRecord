import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DetailInfo } from "./detail-info"
import { JobProps } from '@/lib/info'

export function Detail({ children, data}: { children: React.ReactNode, data: JobProps}) {
  return(
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DetailInfo data={data} />
      </Dialog>
    </>
  )
}