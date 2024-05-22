import { Dialog, DialogTrigger} from "@/components/ui/dialog";
import { FormDialog } from "./form-dialog";
import { CreateForm } from "../create-form";
import React from "react";

export function FormTrigger({ children }: { children: React.ReactNode}) {

  return(
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <FormDialog>
          <CreateForm />
        </FormDialog>
      </Dialog>
    </>
  )
}