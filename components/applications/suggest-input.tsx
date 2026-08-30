"use client";

import type { Ref } from "react";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete";

const LIMIT = 8;

/**
 * Free-text input with a suggestion list. The user can type any value, or
 * pick a match with the pointer or arrow keys + Enter.
 */
export function SuggestInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  items,
  placeholder,
  invalid,
  ref,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  items: readonly string[];
  placeholder?: string;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <Autocomplete
      items={items}
      value={value}
      onValueChange={onChange}
      limit={LIMIT}
      openOnInputClick
    >
      <AutocompleteInput
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        onBlur={onBlur}
      />
      <AutocompleteContent>
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
