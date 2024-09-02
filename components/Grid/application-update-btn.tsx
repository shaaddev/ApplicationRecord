import { JobProps } from "@/lib/info";
import { CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { updateAction } from "./update-action";
import { useForm} from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select"

export function UpdateStatusBtn({
  id, status, data, statusColours, className
}: { id: string, status: string, data: JobProps[], statusColours: { [key: string]: string }, className?: string }) {

  const { setValue, register } = useForm();
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    setValue('new_status', status)
  }, [setValue, status])

  const onSubmit = async (formData: FormData) => {
    setIsPending(true)

    try {
      const result = await updateAction(formData, id!)

      if (result.success) {
        toast.success('Status Updated')
      } else {
        toast.error('Whoops')
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const handleSelectChange = async (value: string) => {
    const formData = new FormData()
    formData.append('new_status', value)
    await onSubmit(formData)
  };


  return (
    <>
      <CardFooter className={`flex  w-full  items-center justify-center ${className}`}>
        <form className="w-full">
          <div>
           <Select 
            {...register('new_status')}
            onValueChange={handleSelectChange}  
          > 
            <SelectTrigger className="justify-between">
              <SelectValue placeholder="Update Status"/>
            </SelectTrigger>
              <SelectContent align="end">
                {Object.keys(statusColours).map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    style={{ color: statusColours[status] }}
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
           </Select>
           <input 
            type="hidden"
            {...register('status')}
           />
          </div>
        </form>
      </CardFooter>
    </>
  );
}
