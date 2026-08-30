"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparkleIcon } from "@phosphor-icons/react";
import {
  type Application,
  type ApplicationInput,
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
import { statusClasses } from "./status-badge";
import { cn } from "@/lib/utils";

const statusItems = STATUSES.map((s) => ({ label: s, value: s }));

const URL_RE = /^https?:\/\/\S+$/i;

const FILL_LABELS = {
  role: "role",
  company_name: "company",
  location: "location",
  salary: "salary",
} as const;

function listify(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
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
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: toFormValues(application),
  });
  const { register, control, handleSubmit, formState, getValues, setValue, setError, clearErrors } =
    form;
  const errors = formState.errors;
  const busy = pending || filling;

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

        <Field data-invalid={errors.role ? true : undefined}>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Input
            id="role"
            placeholder="Software Engineer"
            aria-invalid={errors.role ? true : undefined}
            autoComplete="off"
            {...register("role")}
          />
          <FieldError>{errors.role?.message}</FieldError>
        </Field>

        <Field data-invalid={errors.company_name ? true : undefined}>
          <FieldLabel htmlFor="company_name">Company</FieldLabel>
          <Input
            id="company_name"
            placeholder="Acme"
            aria-invalid={errors.company_name ? true : undefined}
            autoComplete="organization"
            {...register("company_name")}
          />
          <FieldError>{errors.company_name?.message}</FieldError>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={errors.location ? true : undefined}>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="Remote, NYC"
              aria-invalid={errors.location ? true : undefined}
              {...register("location")}
            />
            <FieldError>{errors.location?.message}</FieldError>
          </Field>

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
          <Controller
            control={control}
            name="date_applied"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="date_applied">Date applied</FieldLabel>
                <DateField
                  id="date_applied"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Field data-invalid={errors.salary ? true : undefined}>
            <FieldLabel htmlFor="salary">Salary</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="salary"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                placeholder="120000"
                aria-invalid={errors.salary ? true : undefined}
                {...register("salary")}
              />
            </InputGroup>
            <FieldError>{errors.salary?.message}</FieldError>
          </Field>
        </div>
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
