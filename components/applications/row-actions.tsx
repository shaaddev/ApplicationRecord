"use client";

import { useState } from "react";
import {
  ArrowSquareOutIcon,
  DotsThreeVerticalIcon,
  FilePdfIcon,
  FileXIcon,
  PencilSimpleIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import type { Application } from "@/lib/applications";
import { resumeUrl } from "@/lib/resumes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApplicationDialog } from "./application-dialog";
import { DeleteDialog } from "./delete-dialog";
import { useResumeUpload } from "./resume-control";

export function RowActions({ application }: { application: Application }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const resume = useResumeUpload(application);

  return (
    <>
      {resume.input}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" />}
          aria-label={`Actions for ${application.company_name}`}
        >
          <DotsThreeVerticalIcon weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <PencilSimpleIcon />
              Edit
            </DropdownMenuItem>
            {application.link ? (
              <DropdownMenuItem
                render={
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open posting"
                  />
                }
              >
                <ArrowSquareOutIcon />
                Open posting
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {resume.attached ? (
              <>
                <DropdownMenuItem
                  render={
                    <a
                      href={resumeUrl(application.id)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open resume"
                    />
                  }
                >
                  <FilePdfIcon />
                  Open resume
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resume.pick} disabled={resume.pending}>
                  <UploadSimpleIcon />
                  Replace resume
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resume.remove} disabled={resume.pending}>
                  <FileXIcon />
                  Remove resume
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={resume.pick} disabled={resume.pending}>
                <UploadSimpleIcon />
                Upload resume
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ApplicationDialog open={editOpen} onOpenChange={setEditOpen} application={application} />
      <DeleteDialog
        id={application.id}
        company={application.company_name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
