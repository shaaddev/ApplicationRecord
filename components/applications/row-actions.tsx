"use client";

import { useState } from "react";
import {
  ArrowSquareOutIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Application } from "@/lib/applications";
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

export function RowActions({ application }: { application: Application }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" />}
          aria-label={`Actions for ${application.company_name}`}
        >
          <DotsThreeVerticalIcon weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
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
