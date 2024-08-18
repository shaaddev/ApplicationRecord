import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AiDialogContent } from "./ai-dialog-content"

export function AiDialog({ children }: { children: React.ReactNode}) {
  return(
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <AiDialogContent />
    </Dialog>
  )
}