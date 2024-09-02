'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditForm } from '../Forms/edit-form'
import { JobProps } from "@/lib/info"

export function EditButton({ job }: { job: JobProps }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] w-full">
        <EditForm {...job} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}