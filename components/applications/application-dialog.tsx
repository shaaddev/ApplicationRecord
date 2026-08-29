"use client";

import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import type { Application } from "@/lib/applications";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationForm } from "./application-form";

export function ApplicationDialog({
  open,
  onOpenChange,
  application,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application;
}) {
  const editing = Boolean(application);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit application" : "New application"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details for this application."
              : "Add a role you applied to, or one you plan to."}
          </DialogDescription>
        </DialogHeader>
        <ApplicationForm
          key={application?.id ?? "new"}
          application={application}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function NewApplicationButton({ size = "default" }: { size?: "default" | "sm" | "lg" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <PlusIcon data-icon="inline-start" weight="bold" />
        New application
      </Button>
      <ApplicationDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
