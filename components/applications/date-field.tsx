"use client";

import { useState } from "react";
import { CalendarBlankIcon, XIcon } from "@phosphor-icons/react";
import { formatDate } from "@/lib/applications";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DateField({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-invalid={invalid || undefined}
          render={
            <Button
              variant="outline"
              className="flex-1 justify-start font-normal data-[empty=true]:text-muted-foreground"
              data-empty={!value}
            />
          }
        >
          <CalendarBlankIcon data-icon="inline-start" />
          {value ? formatDate(value) : "Pick a date"}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(date) => {
              onChange(date ?? null);
              setOpen(false);
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear date"
          onClick={() => onChange(null)}
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  );
}
