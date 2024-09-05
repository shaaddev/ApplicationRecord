import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListOrderedIcon, ChevronsUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

type SortableFields = 'role' | 'company_name' | 'status' | 'date_applied';

interface SortDropdownProps {
  sortBy: SortableFields;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: SortableFields, order: 'asc' | 'desc') => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const sortFields: SortableFields[] = ['role', 'company_name', 'status', 'date_applied'];

  const handleSortByChange = (value: string) => {
    onSortChange(value as SortableFields, sortOrder);
  };

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortByLabel = (field: SortableFields) => {
    switch (field) {
      case 'role':
        return 'Position';
      case 'company_name':
        return 'Company';
      case 'status':
        return 'Status';
      case 'date_applied':
        return 'Date Applied';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListOrderedIcon className="w-4 h-4 hidden md:flex" />
          <span className='hidden md:flex'>{getSortByLabel(sortBy)}</span>
          <ChevronsUpDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortByChange}>
          {sortFields.map((field) => (
            <DropdownMenuRadioItem key={field} value={field}>
              {getSortByLabel(field)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleSortOrder}
        >
          {sortOrder === 'asc' ? (
            <ArrowUpIcon className="w-4 h-4 mr-2" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-2" />
          )}
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}