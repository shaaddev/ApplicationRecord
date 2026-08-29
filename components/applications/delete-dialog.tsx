"use client";

import { useTransition } from "react";
import { deleteApplication } from "@/app/(application-record)/actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteDialog({
  id,
  company,
  open,
  onOpenChange,
}: {
  id: number;
  company: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteApplication(id);
      if (!result.ok) {
        toast.add({ type: "error", title: "Not deleted", description: result.error });
        return;
      }
      toast.add({ type: "success", title: "Application deleted" });
      onOpenChange(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this application?</AlertDialogTitle>
          <AlertDialogDescription>
            {company} will be removed from your list. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm} disabled={pending}>
            {pending ? <Spinner data-icon="inline-start" /> : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
