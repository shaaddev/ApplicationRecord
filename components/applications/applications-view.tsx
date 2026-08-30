"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowSquareOutIcon,
  ArrowsDownUpIcon,
  BriefcaseIcon,
  CaretDownIcon,
  CaretUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  type Application,
  type Status,
  STATUSES,
  formatDate,
  formatSalary,
} from "@/lib/applications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NewApplicationButton } from "./application-dialog";
import { ApplicationCard } from "./application-card";
import { ResumeCell } from "./resume-control";
import { StatusMenu } from "./status-menu";
import { RowActions } from "./row-actions";
import { statusClasses } from "./status-badge";

type View = "table" | "cards";

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => <span className="font-medium">{row.original.company_name}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusMenu id={row.original.id} status={row.original.status} />,
  },
  {
    id: "salary",
    accessorFn: (row) => {
      const n = Number(row.salary);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    },
    sortUndefined: "last",
    header: "Salary",
    cell: ({ row }) => {
      const salary = formatSalary(row.original.salary);
      return salary ? (
        <span className="tabular-nums">{salary}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "date_applied",
    accessorFn: (row) => row.date_applied?.getTime(),
    sortUndefined: "last",
    header: "Applied",
    cell: ({ row }) => {
      const applied = formatDate(row.original.date_applied);
      return applied ? (
        <span className="tabular-nums">{applied}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "resume",
    accessorFn: (row) => (row.resume ? 1 : 0),
    header: "Resume",
    cell: ({ row }) => <ResumeCell application={row.original} />,
  },
  {
    id: "link",
    header: () => <span className="sr-only">Posting</span>,
    enableSorting: false,
    cell: ({ row }) =>
      row.original.link ? (
        <Button
          variant="ghost"
          size="icon-sm"
          render={
            <a
              href={row.original.link}
              target="_blank"
              rel="noreferrer"
              aria-label="Open posting"
            />
          }
          nativeButton={false}
          aria-label="Open posting"
        >
          <ArrowSquareOutIcon />
        </Button>
      ) : null,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => <RowActions application={row.original} />,
  },
];

function matches(app: Application, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [app.company_name, app.role, app.location].some((v) => v.toLowerCase().includes(q));
}

export function ApplicationsView({ applications }: { applications: Application[] }) {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [view, setView] = useState<View>("table");
  const [sorting, setSorting] = useState<SortingState>([{ id: "date_applied", desc: true }]);

  const filtered = useMemo(
    () =>
      applications.filter(
        (a) =>
          matches(a, query) && (statuses.length === 0 || statuses.includes(a.status as Status)),
      ),
    [applications, query, statuses],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row.id),
  });

  if (applications.length === 0) {
    return (
      <Empty className="rounded-2xl bg-card ring-1 ring-foreground/5 dark:ring-foreground/10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BriefcaseIcon />
          </EmptyMedia>
          <EmptyTitle>No applications yet</EmptyTitle>
          <EmptyDescription>
            Add the first role you applied to and track it from here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <NewApplicationButton size="sm" />
        </EmptyContent>
      </Empty>
    );
  }

  const toggleStatus = (status: Status, checked: boolean) =>
    setStatuses((prev) => (checked ? [...prev, status] : prev.filter((s) => s !== status)));

  const hasFilters = query !== "" || statuses.length > 0;
  const rows = table.getRowModel().rows;
  const sortedApps = rows.map((r) => r.original);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full max-w-xs">
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search company, role, location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search applications"
          />
        </InputGroup>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <FunnelIcon data-icon="inline-start" />
            Status
            {statuses.length > 0 ? (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 tabular-nums">
                {statuses.length}
              </Badge>
            ) : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              {STATUSES.map((s) => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={statuses.includes(s)}
                  onCheckedChange={(checked) => toggleStatus(s, checked)}
                >
                  <span
                    className={cn("size-1.5 rounded-full", statusClasses(s).dot)}
                    aria-hidden="true"
                  />
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setStatuses([]);
            }}
          >
            Clear
          </Button>
        ) : null}

        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {filtered.length} of {applications.length}
        </span>

        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          value={[view]}
          onValueChange={(v) => {
            const next = v[0];
            if (next === "table" || next === "cards") setView(next);
          }}
          className="hidden md:flex"
          aria-label="View"
        >
          <ToggleGroupItem value="table" aria-label="Table view">
            <TableIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="cards" aria-label="Card view">
            <SquaresFourIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-card px-4 py-10 text-center text-sm text-muted-foreground ring-1 ring-foreground/5 dark:ring-foreground/10">
          Nothing matches these filters.
        </p>
      ) : (
        <>
          <div
            className={cn(
              "overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5 dark:ring-foreground/10",
              view === "table" ? "hidden md:block" : "hidden",
            )}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      return (
                        <TableHead key={header.id} className="h-10 text-xs">
                          {header.isPlaceholder ? null : canSort ? (
                            <Button
                              variant="ghost"
                              size="xs"
                              className="-ml-2 text-xs font-medium text-muted-foreground data-[sorted=true]:text-brand-ink"
                              data-sorted={sorted !== false}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {sorted === "asc" ? (
                                <CaretUpIcon data-icon="inline-end" />
                              ) : sorted === "desc" ? (
                                <CaretDownIcon data-icon="inline-end" />
                              ) : (
                                <ArrowsDownUpIcon data-icon="inline-end" className="opacity-40" />
                              )}
                            </Button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-brand/8">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div
            className={cn(
              "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
              view === "table" ? "md:hidden" : "",
            )}
          >
            {sortedApps.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
