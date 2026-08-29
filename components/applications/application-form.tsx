"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Application,
  type ApplicationInput,
  STATUSES,
  applicationSchema,
  toFormValues,
} from "@/lib/applications";
import { createApplication, updateApplication } from "@/app/(application-record)/actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
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

export function ApplicationForm({
  application,
  onDone,
}: {
  application?: Application;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: toFormValues(application),
  });
  const { register, control, handleSubmit, formState } = form;
  const errors = formState.errors;

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

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <FieldGroup>
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

        <Field data-invalid={errors.link ? true : undefined}>
          <FieldLabel htmlFor="link">Posting link</FieldLabel>
          <Input
            id="link"
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-invalid={errors.link ? true : undefined}
            {...register("link")}
          />
          <FieldError>{errors.link?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {application ? "Save changes" : "Add application"}
        </Button>
      </div>
    </form>
  );
}
