"use client";

import { useState, useTransition } from "react";
import { type Control, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparkleIcon } from "@phosphor-icons/react";
import {
  type Application,
  type ApplicationInput,
  NOTES_LIMIT,
  PAY_UNITS,
  PAY_UNIT_LABEL,
  STATUSES,
  applicationSchema,
  toFormValues,
} from "@/lib/applications";
import {
  autofillFromLink,
  createApplication,
  updateApplication,
} from "@/app/(application-record)/actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateField } from "./date-field";
import { SuggestInput } from "./suggest-input";
import { useSuggestions } from "./suggestions-provider";
import { statusClasses } from "./status-badge";
import { cn } from "@/lib/utils";

const statusItems = STATUSES.map((s) => ({ label: s, value: s }));
const payUnitItems = PAY_UNITS.map((u) => ({ label: PAY_UNIT_LABEL[u], value: u }));

const URL_RE = /^https?:\/\/\S+$/i;

const FILL_LABELS = {
  role: "role",
  company_name: "company",
  location: "location",
} as const;

function listify(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

type DateName = "date_applied" | "planned_date" | "follow_up_date";

function DateInput({
  control,
  name,
  label,
}: {
  control: Control<ApplicationInput>;
  name: DateName;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <DateField
            id={name}
            value={field.value}
            onChange={field.onChange}
            invalid={fieldState.invalid}
          />
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}

export function ApplicationForm({
  application,
  onDone,
}: {
  application?: Application;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [filling, setFilling] = useState(false);
  const suggestions = useSuggestions();
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: toFormValues(application),
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
  } = form;
  const errors = formState.errors;
  const busy = pending || filling;
  const [status, payUnit, plannedDate, dateApplied] = watch([
    "status",
    "pay_unit",
    "planned_date",
    "date_applied",
  ]);
  // Show the date that fits the status. A date that already has a value stays
  // visible either way, so switching status never hides what the user entered.
  const notApplied = status === "Not Applied";
  const showPlanned = notApplied || plannedDate !== null;
  const showApplied = !notApplied || dateApplied !== null;

  const submit = handleSubmit((values) => {
    startTransition(async () => {
      const result = application
        ? await updateApplication(application.id, values)
        : await createApplication(values);

      if (!result.ok) {
        toast.add({ type: "error", title: "Not saved", description: result.error });
        return;
      }
      toast.add({
        type: "success",
        title: application ? "Application updated" : "Application added",
      });
      onDone();
    });
  });

  async function autofill(fromUrl?: string) {
    const url = (fromUrl ?? getValues("link")).trim();
    if (!URL_RE.test(url)) {
      setError("link", { message: "Paste a full link that starts with http:// or https://" });
      return;
    }
    clearErrors("link");
    setFilling(true);
    try {
      const result = await autofillFromLink(url);
      if (!result.ok) {
        toast.add({ type: "error", title: "Autofill didn't work", description: result.error });
        return;
      }

      const filled: string[] = [];
      for (const key of Object.keys(FILL_LABELS) as (keyof typeof FILL_LABELS)[]) {
        const value = result.data[key];
        if (!value) continue;
        setValue(key, value, { shouldDirty: true, shouldValidate: true });
        filled.push(FILL_LABELS[key]);
      }
      // The extractor only reports yearly pay, so the unit is always "year".
      if (result.data.salary) {
        setValue("pay", result.data.salary, { shouldDirty: true, shouldValidate: true });
        setValue("pay_unit", "year", { shouldDirty: true });
        filled.push("salary");
      }

      if (filled.length === 0) {
        toast.add({
          type: "warning",
          title: "Nothing to fill in",
          description: "Couldn't find job details on that page.",
        });
        return;
      }
      toast.add({
        type: "success",
        title: "Details filled in",
        description: `Filled ${listify(filled)} from the posting. Autofill can be wrong, so check them before saving.`,
      });
    } finally {
      setFilling(false);
    }
  }

  const linkField = register("link");

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={errors.link ? true : undefined}>
          <FieldLabel htmlFor="link">Posting link</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="link"
              type="url"
              inputMode="url"
              placeholder="https://"
              aria-invalid={errors.link ? true : undefined}
              disabled={filling}
              {...linkField}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text").trim();
                if (!URL_RE.test(text)) return;
                e.preventDefault();
                setValue("link", text, { shouldDirty: true });
                void autofill(text);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                void autofill();
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => autofill()} disabled={busy}>
                {filling ? <Spinner className="size-3.5" /> : <SparkleIcon weight="fill" />}
                Autofill
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.link ? (
            <FieldError>{errors.link.message}</FieldError>
          ) : (
            <FieldDescription>
              Paste a posting link to fill in the details. Autofill can get things wrong, so check
              the fields before saving.
            </FieldDescription>
          )}
        </Field>

        <Controller
          control={control}
          name="role"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <SuggestInput
                id="role"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                items={suggestions.roles}
                placeholder="Software Engineer"
                invalid={fieldState.invalid}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="company_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="company_name">Company</FieldLabel>
              <SuggestInput
                id="company_name"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                items={suggestions.companies}
                placeholder="Acme"
                invalid={fieldState.invalid}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <SuggestInput
                  id="location"
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  items={suggestions.locations}
                  placeholder="Remote, NYC"
                  invalid={fieldState.invalid}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select
                  items={statusItems}
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                >
                  <SelectTrigger id="status" aria-invalid={fieldState.invalid || undefined}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <span
                            className={cn("size-1.5 rounded-full", statusClasses(item.value).dot)}
                            aria-hidden="true"
                          />
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {showPlanned ? (
            <DateInput control={control} name="planned_date" label="Planned application date" />
          ) : null}
          {showApplied ? (
            <DateInput control={control} name="date_applied" label="Date applied" />
          ) : null}
          <DateInput control={control} name="follow_up_date" label="Follow-up date" />

          <Field data-invalid={errors.pay ? true : undefined}>
            <FieldLabel htmlFor="pay">Pay</FieldLabel>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="pay"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={payUnit === "hour" ? 1 : 1000}
                  placeholder={payUnit === "hour" ? "45" : "120000"}
                  aria-invalid={errors.pay ? true : undefined}
                  {...register("pay")}
                />
              </InputGroup>
              <Controller
                control={control}
                name="pay_unit"
                render={({ field }) => (
                  <Select
                    items={payUnitItems}
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <SelectTrigger aria-label="Pay unit" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {payUnitItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldError>{errors.pay?.message}</FieldError>
          </Field>
        </div>

        <Field data-invalid={errors.notes ? true : undefined}>
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <Textarea
            id="notes"
            placeholder="Recruiter name, referral, interview prep, anything worth remembering"
            maxLength={NOTES_LIMIT}
            aria-invalid={errors.notes ? true : undefined}
            className="max-h-48 overflow-y-auto"
            {...register("notes")}
          />
          <FieldError>{errors.notes?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {application ? "Save changes" : "Add application"}
        </Button>
      </div>
    </form>
  );
}
