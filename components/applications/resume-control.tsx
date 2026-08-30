"use client";

import { type ChangeEvent, useRef, useTransition } from "react";
import { FilePdfIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Application } from "@/lib/applications";
import { RESUME_ACCEPT, checkResumeFile, formatBytes, resumeUrl } from "@/lib/resumes";
import { removeResume, uploadResume } from "@/app/(application-record)/actions";
import { toast } from "@/components/ui/toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Owns the hidden file input and the upload/remove transitions. Render
 * `input` somewhere in the tree, then call `pick()` from any button or menu item.
 */
export function useResumeUpload(application: Application) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const attached = application.resume !== null;

  const pick = () => inputRef.current?.click();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const problem = checkResumeFile(file);
    if (problem) {
      toast.add({ type: "error", title: "Resume not uploaded", description: problem });
      return;
    }

    startTransition(async () => {
      const body = new FormData();
      body.append("file", file);
      const result = await uploadResume(application.id, body);
      if (!result.ok) {
        toast.add({ type: "error", title: "Resume not uploaded", description: result.error });
        return;
      }
      toast.add({
        type: "success",
        title: attached ? "Resume replaced" : "Resume attached",
        description: file.name,
      });
    });
  };

  const remove = () => {
    startTransition(async () => {
      const result = await removeResume(application.id);
      if (!result.ok) {
        toast.add({ type: "error", title: "Resume not removed", description: result.error });
        return;
      }
      toast.add({ type: "success", title: "Resume removed" });
    });
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={RESUME_ACCEPT}
      className="hidden"
      tabIndex={-1}
      aria-hidden="true"
      onChange={onChange}
    />
  );

  return { attached, pending, pick, remove, input };
}

/** Card view: a chip that opens the PDF, or a quiet "Add resume" button. */
export function ResumeChip({ application }: { application: Application }) {
  const { pending, pick, input } = useResumeUpload(application);
  const resume = application.resume;

  return (
    <>
      {input}
      {resume ? (
        <a
          href={resumeUrl(application.id)}
          target="_blank"
          rel="noreferrer"
          title={`${resume.file_name} (${formatBytes(resume.size)})`}
          aria-label={`Open resume ${resume.file_name}`}
          className={cn(
            "inline-flex h-6 max-w-full items-center gap-1.5 rounded-2xl bg-brand/15 pr-2.5 pl-2 text-xs font-medium text-brand-ink transition-colors outline-none hover:bg-brand/25 focus-visible:ring-3 focus-visible:ring-ring/30",
            pending && "opacity-60",
          )}
        >
          {pending ? (
            <Spinner className="size-3.5" />
          ) : (
            <FilePdfIcon weight="fill" className="size-3.5 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{resume.file_name}</span>
        </a>
      ) : (
        <Button
          variant="ghost"
          size="xs"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={pick}
          disabled={pending}
        >
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <UploadSimpleIcon data-icon="inline-start" weight="bold" />
          )}
          Add resume
        </Button>
      )}
    </>
  );
}

/** Table view: one icon that either opens the PDF or starts an upload. */
export function ResumeCell({ application }: { application: Application }) {
  const { pending, pick, input } = useResumeUpload(application);
  const resume = application.resume;

  if (pending) {
    return (
      <span className="inline-flex size-7 items-center justify-center">
        <Spinner className="text-muted-foreground" />
      </span>
    );
  }

  return (
    <>
      {input}
      {resume ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <a
                href={resumeUrl(application.id)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open resume ${resume.file_name}`}
              />
            }
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "text-brand-ink hover:text-brand-ink",
            )}
          >
            <FilePdfIcon weight="fill" />
          </TooltipTrigger>
          <TooltipContent>
            {resume.file_name}
            <span className="opacity-60">{formatBytes(resume.size)}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Upload resume" />}
            className="text-muted-foreground/60 hover:text-foreground"
            onClick={pick}
          >
            <UploadSimpleIcon />
          </TooltipTrigger>
          <TooltipContent>Upload resume</TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
