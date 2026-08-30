"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Application,
  type ApplicationInput,
  PAY_UNITS,
  PAY_UNIT_LABEL,
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
import { SuggestInput } from "./suggest-input";
import { useSuggestions } from "./suggestions-provider";
import { statusClasses } from "./status-badge";
import { cn } from "@/lib/utils";

const statusItems = STATUSES.map((s) => ({ label: s, value: s }));
const payUnitItems = PAY_UNITS.map((u) => ({ label: PAY_UNIT_LABEL[u], value: u }));

export function ApplicationForm({
  application,
  onDone,
}: {
  application?: Application;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const suggestions = useSuggestions();
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: toFormValues(application),
  });
  const { register, control, handleSubmit, formState, watch } = form;
  const errors = formState.errors;
  const payUnit = watch("pay_unit");

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
