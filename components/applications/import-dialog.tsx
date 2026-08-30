"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import {
  CheckIcon,
  CopySimpleIcon,
  FileArrowUpIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { type Application, PAY_UNIT_LABEL, formatDate, formatPay } from "@/lib/applications";
import { IMPORT_ACCEPT, IMPORT_FILE_LIMIT, IMPORT_ROW_LIMIT } from "@/lib/import/shared";
import {
  type DuplicateStrategy,
  FIELD_LABEL,
  IMPORT_FIELDS,
  type ImportField,
  type ImportPlan,
  type ImportRow,
  type Mapping,
  REQUIRED_FIELDS,
  type Sheet,
  buildRows,
  guessMapping,
  planImport,
  readSheet,
} from "@/lib/import/parse";
import { downloadCsv, templateCsv } from "@/lib/import/csv";
import { importApplications } from "@/app/(application-record)/actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";

type Stage =
  | { kind: "pick" }
  | { kind: "review"; fileName: string; sheet: Sheet; mapping: Mapping };

const NONE = "none";

const STRATEGY_HINT: Record<DuplicateStrategy, string> = {
  skip: "Rows that match a company and role you already track are left out.",
  replace: "Matching applications are overwritten with the row from the file.",
  keep: "Everything is added, so you may end up with two entries for the same role.",
};

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function ImportDialog({
  open,
  onOpenChange,
  applications,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applications: Application[];
}) {
  const [stage, setStage] = useState<Stage>({ kind: "pick" });
  const [strategy, setStrategy] = useState<DuplicateStrategy>("skip");
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [pending, startTransition] = useTransition();

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setStage({ kind: "pick" });
      setStrategy("skip");
      setError(null);
    }
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (file.size > IMPORT_FILE_LIMIT) {
      setError("Files must be under 2 MB.");
      return;
    }
    setReading(true);
    try {
      const sheet = await readSheet(file);
      if (sheet.rows.length === 0) {
        setError("No rows found under the header row.");
        return;
      }
      if (sheet.rows.length > IMPORT_ROW_LIMIT) {
        setError(
          `This file has ${sheet.rows.length} rows. Import up to ${IMPORT_ROW_LIMIT} at a time.`,
        );
        return;
      }
      setStage({
        kind: "review",
        fileName: file.name,
        sheet,
        mapping: guessMapping(sheet.headers),
      });
    } catch (err) {
      console.error("readSheet", err);
      setError("Could not read that file. Try saving it as CSV or XLSX.");
    } finally {
      setReading(false);
    }
  };

  const submit = (plan: ImportPlan) => {
    startTransition(async () => {
      const result = await importApplications(plan.payload);
      if (!result.ok) {
        toast.add({ type: "error", title: "Not imported", description: result.error });
        return;
      }
      const notes = [
        result.replaced > 0 ? `${result.replaced} replaced` : null,
        plan.skipped > 0 ? `${plan.skipped} skipped` : null,
        plan.invalid > 0 ? `${plan.invalid} invalid` : null,
      ].filter(Boolean);
      toast.add({
        type: "success",
        title: `Imported ${plural(result.inserted + result.replaced, "application")}`,
        description: notes.length > 0 ? notes.join(", ") : undefined,
      });
      close(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className={stage.kind === "review" ? "sm:max-w-4xl" : "sm:max-w-lg"}>
        <DialogHeader>
          <DialogTitle>Import applications</DialogTitle>
          <DialogDescription>
            {stage.kind === "pick"
              ? "Bring in rows from a spreadsheet, one row per application."
              : `${stage.fileName}: ${plural(stage.sheet.rows.length, "row")} found. Check the columns and preview before saving.`}
          </DialogDescription>
        </DialogHeader>

        {stage.kind === "pick" ? (
          <FilePicker onFile={pick} reading={reading} error={error} />
        ) : (
          <Review
            sheet={stage.sheet}
            mapping={stage.mapping}
            onMappingChange={(mapping) => setStage({ ...stage, mapping })}
            applications={applications}
            strategy={strategy}
            onStrategyChange={setStrategy}
            pending={pending}
            onBack={() => setStage({ kind: "pick" })}
            onSubmit={submit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FilePicker({
  onFile,
  reading,
  error,
}: {
  onFile: (file: File | undefined) => void;
  reading: boolean;
  error: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-brand bg-brand/8" : "border-border",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-brand/20 text-brand-ink">
          <FileArrowUpIcon className="size-5" weight="duotone" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Drop a spreadsheet here</p>
          <p className="text-xs text-muted-foreground">
            CSV, Excel, Numbers or OpenDocument. Up to 2 MB and {IMPORT_ROW_LIMIT} rows.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={reading}
          onClick={() => inputRef.current?.click()}
        >
          {reading ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <UploadSimpleIcon data-icon="inline-start" />
          )}
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={IMPORT_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-label="Spreadsheet file"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Columns are matched by name and you can adjust them before anything is saved.{" "}
        <button
          type="button"
          className="text-brand-ink underline-offset-4 hover:underline"
          onClick={() => downloadCsv("applications-template.csv", templateCsv())}
        >
          Download the template
        </button>{" "}
        to see the expected layout.
      </p>
    </div>
  );
}

function Review({
  sheet,
  mapping,
  onMappingChange,
  applications,
  strategy,
  onStrategyChange,
  pending,
  onBack,
  onSubmit,
}: {
  sheet: Sheet;
  mapping: Mapping;
  onMappingChange: (mapping: Mapping) => void;
  applications: Application[];
  strategy: DuplicateStrategy;
  onStrategyChange: (strategy: DuplicateStrategy) => void;
  pending: boolean;
  onBack: () => void;
  onSubmit: (plan: ImportPlan) => void;
}) {
  const rows = useMemo(
    () => buildRows(sheet, mapping, applications),
    [sheet, mapping, applications],
  );
  const plan = useMemo(() => planImport(rows, strategy), [rows, strategy]);
  const missing = REQUIRED_FIELDS.filter((f) => mapping[f] === undefined);
  const duplicates = rows.filter((r) => r.duplicateOf || r.duplicateInFile).length;
  const total = plan.adding + plan.replacing;

  const columnItems = [
    { label: "Not in file", value: NONE },
    ...sheet.headers.map((h, i) => ({ label: h || `Column ${i + 1}`, value: String(i) })),
  ];

  const summary = [
    plan.adding > 0 ? `${plan.adding} new` : null,
    plan.replacing > 0 ? `${plan.replacing} to replace` : null,
    plan.skipped > 0 ? `${plan.skipped} skipped` : null,
    plan.invalid > 0 ? `${plan.invalid} invalid` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {IMPORT_FIELDS.map((field) => (
          <MappingSelect
            key={field}
            field={field}
            value={mapping[field]}
            items={columnItems}
            onChange={(idx) => {
              const next = { ...mapping };
              if (idx === undefined) delete next[field];
              else next[field] = idx;
              onMappingChange(next);
            }}
          />
        ))}
      </div>
      {missing.length > 0 ? (
        <p role="alert" className="-mt-2 text-sm text-destructive">
          Map {missing.map((f) => FIELD_LABEL[f]).join(", ")} to continue.
        </p>
      ) : null}

      {duplicates > 0 ? (
        <div className="flex flex-col gap-2 rounded-2xl bg-muted/50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm">
              <CopySimpleIcon
                className="mr-1.5 inline size-4 align-text-bottom"
                aria-hidden="true"
              />
              {plural(duplicates, "row")} match applications you already track.
            </p>
            <ToggleGroup
              variant="outline"
              size="sm"
              spacing={0}
              value={[strategy]}
              onValueChange={(v) => {
                const next = v[0];
                if (next === "skip" || next === "replace" || next === "keep")
                  onStrategyChange(next);
              }}
              aria-label="What to do with duplicates"
            >
              <ToggleGroupItem value="skip">Skip</ToggleGroupItem>
              <ToggleGroupItem value="replace">Replace</ToggleGroupItem>
              <ToggleGroupItem value="keep">Keep both</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <p className="text-xs text-muted-foreground">{STRATEGY_HINT[strategy]}</p>
        </div>
      ) : null}

      <div className="max-h-72 overflow-y-auto rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 w-10 text-xs">#</TableHead>
              <TableHead className="h-9 text-xs">Company</TableHead>
              <TableHead className="h-9 text-xs">Role</TableHead>
              <TableHead className="h-9 text-xs">Location</TableHead>
              <TableHead className="h-9 text-xs">Status</TableHead>
              <TableHead className="h-9 text-xs">Applied</TableHead>
              <TableHead className="h-9 text-xs">Pay</TableHead>
              <TableHead className="h-9 text-xs">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <PreviewRow key={row.line} row={row} strategy={strategy} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground tabular-nums">{summary}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack} disabled={pending}>
            Change file
          </Button>
          <Button
            type="button"
            variant="brand"
            onClick={() => onSubmit(plan)}
            disabled={pending || total === 0 || missing.length > 0}
          >
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {total > 0 ? `Import ${total}` : "Import"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MappingSelect({
  field,
  value,
  items,
  onChange,
}: {
  field: ImportField;
  value: number | undefined;
  items: { label: string; value: string }[];
  onChange: (index: number | undefined) => void;
}) {
  const id = `map-${field}`;
  const required = REQUIRED_FIELDS.includes(field);
  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-xs">
        {FIELD_LABEL[field]}
        {required ? null : <span className="font-normal text-muted-foreground"> (optional)</span>}
      </FieldLabel>
      <Select
        items={items}
        value={value === undefined ? NONE : String(value)}
        onValueChange={(next) => {
          const v = String(next ?? NONE);
          onChange(v === NONE ? undefined : Number(v));
        }}
      >
        <SelectTrigger
          id={id}
          size="sm"
          aria-invalid={required && value === undefined ? true : undefined}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

function outcome(row: ImportRow, strategy: DuplicateStrategy) {
  if (row.errors.length > 0) {
    return { tone: "error" as const, text: row.errors[0], title: row.errors.join("\n") };
  }
  if (row.duplicateInFile) {
    return strategy === "keep"
      ? { tone: "info" as const, text: "Added, repeated in file" }
      : { tone: "muted" as const, text: "Skipped, repeated in file" };
  }
  if (row.duplicateOf) {
    if (strategy === "skip") return { tone: "muted" as const, text: "Skipped, already tracked" };
    if (strategy === "replace") return { tone: "info" as const, text: "Replaces existing" };
    return { tone: "info" as const, text: "Added next to existing" };
  }
  return { tone: "ok" as const, text: "New" };
}

function PreviewRow({ row, strategy }: { row: ImportRow; strategy: DuplicateStrategy }) {
  const result = outcome(row, strategy);
  const muted = result.tone === "muted" || result.tone === "error";
  const pay = formatPay({
    salary: row.input.pay_unit === "year" ? row.input.pay : null,
    rate: row.input.pay_unit === "hour" ? row.input.pay : null,
  });

  return (
    <TableRow className={cn("hover:bg-transparent", muted && "text-muted-foreground")}>
      <TableCell className="py-2 text-xs tabular-nums">{row.line}</TableCell>
      <TableCell className="max-w-40 truncate py-2 font-medium">
        {row.input.company_name || "—"}
      </TableCell>
      <TableCell className="max-w-40 truncate py-2">{row.input.role || "—"}</TableCell>
      <TableCell className="max-w-32 truncate py-2">{row.input.location || "—"}</TableCell>
      <TableCell className="py-2">
        <StatusBadge status={row.input.status} className={cn(muted && "opacity-60")} />
      </TableCell>
      <TableCell className="py-2 tabular-nums">
        {formatDate(row.input.date_applied) ?? "—"}
      </TableCell>
      <TableCell
        className="py-2 tabular-nums"
        title={pay ? PAY_UNIT_LABEL[row.input.pay_unit] : undefined}
      >
        {pay ?? "—"}
      </TableCell>
      <TableCell className="py-2 text-xs" title={result.title}>
        <span
          className={cn(
            "inline-flex items-center gap-1",
            result.tone === "error" && "text-destructive",
            result.tone === "ok" && "text-status-success",
            result.tone === "info" && "text-brand-ink",
          )}
        >
          {result.tone === "error" ? (
            <WarningCircleIcon className="size-3.5" aria-hidden="true" />
          ) : result.tone === "ok" ? (
            <CheckIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <CopySimpleIcon className="size-3.5" aria-hidden="true" />
          )}
          {result.text}
        </span>
      </TableCell>
    </TableRow>
  );
}

export function ImportButton({
  applications,
  size = "sm",
  variant = "outline",
}: {
  applications: Application[];
  size?: "default" | "sm";
  variant?: "outline" | "ghost" | "brand";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} variant={variant} onClick={() => setOpen(true)}>
        <UploadSimpleIcon data-icon="inline-start" />
        Import
      </Button>
      <ImportDialog open={open} onOpenChange={setOpen} applications={applications} />
    </>
  );
}
