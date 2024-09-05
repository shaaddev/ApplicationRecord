import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

interface FilterDropdownProps {
  onSort: (status: string) => void;
}

export function FilterDropdown({ onSort }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <ArrowUpDown className=" h-4 w-4" />
          <span className="hidden md:flex p-0 ml-2">Filter by Status</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort('all')}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Not Applied')}>
          Not Applied
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Applied')}>
          Applied
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Phone Screen')}>
          Phone Screen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Offer')}>
          Offer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Hired')}>
          Hired
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Rejected')}>
          Rejected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Ghosted')}>
          Ghosted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('Blacklist')}>
          Blacklist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}