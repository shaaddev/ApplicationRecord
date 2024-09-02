import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ 
  children, value, onChange 
}: { children: React.ReactNode, value: any, onChange: any}) {
  const today = new Date()

  return(
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <Calendar 
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) =>
            date < new Date() || date > new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}