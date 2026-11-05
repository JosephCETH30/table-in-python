"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { digitsOnly, formatThousands } from "@/lib/format";
import { ENFORCE_REQUIRED, type DriverProfileData } from "@/lib/driver-profile";

type FieldName = keyof DriverProfileData;

interface BaseProps {
  /** Sheet column this question fills; doubles as the input id. */
  name: FieldName;
  /** Questionnaire number, e.g. "3.2" or "3.2a" for a follow-up. */
  n: string;
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
}

/* ---------------------------------------------------------------------- */
/* Question shell: label, hint / error                                    */
/* ---------------------------------------------------------------------- */

function Question({
  name,
  n,
  label,
  required,
  hint,
  error,
  group,
  children,
}: BaseProps & { group?: boolean; children: React.ReactNode }) {
  const labelId = `${name}-label`;
  const Label = group ? "p" : "label";
  return (
    <div
      id={`q-${name}`}
      role={group ? "radiogroup" : undefined}
      aria-labelledby={group ? labelId : undefined}
      aria-invalid={group ? !!error : undefined}
      className="scroll-mt-28 border-t py-5 first:border-t-0"
    >
      <Label
        id={labelId}
        {...(group ? {} : { htmlFor: name })}
        className="flex items-baseline gap-2 text-[17px] leading-snug font-semibold"
      >
        <span className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums">{n}</span>
        <span>
          {label}
          {required && ENFORCE_REQUIRED && (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          )}
        </span>
      </Label>
      <div className="mt-3">{children}</div>
      {error ? (
        <p className="mt-2 text-sm font-medium text-destructive">{error}</p>
      ) : (
        hint && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/* Big inputs: thumbs, gloves, sunlight. */
const inputClass = "h-14 rounded-xl px-4 text-lg md:text-lg";

/* Bordered box that hosts an input plus a prefix / suffix. */
const affixBox = cn(
  "flex h-14 items-center gap-2 rounded-xl border border-input px-4 transition-colors dark:bg-input/30",
  "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
  "has-aria-invalid:border-destructive"
);
const affixInput =
  "h-full min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground";

/* ---------------------------------------------------------------------- */
/* Text / number / date                                                   */
/* ---------------------------------------------------------------------- */

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
  inputMode,
  min,
  max,
  ...q
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  min?: number;
  max?: number;
}) {
  const props = {
    id: q.name,
    type,
    inputMode,
    min,
    max,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    placeholder,
    "aria-invalid": !!q.error,
  };
  return (
    <Question {...q}>
      {suffix ? (
        <div className={affixBox}>
          <input {...props} className={cn(affixInput, type === "number" && "tabular-nums")} />
          <span className="shrink-0 text-base text-muted-foreground">{suffix}</span>
        </div>
      ) : (
        <Input {...props} className={cn(inputClass, type === "number" && "tabular-nums")} />
      )}
    </Question>
  );
}

/* ---------------------------------------------------------------------- */
/* Rupiah, with live thousands grouping                                   */
/* ---------------------------------------------------------------------- */

export function CurrencyField({
  value,
  onChange,
  placeholder,
  ...q
}: BaseProps & {
  value: string;
  onChange: (rawDigits: string) => void;
  placeholder?: string;
}) {
  return (
    <Question {...q}>
      <div className={affixBox}>
        <span className="shrink-0 text-base font-medium text-muted-foreground">Rp</span>
        <input
          id={q.name}
          type="text"
          inputMode="numeric"
          value={formatThousands(value)}
          onChange={(e) => onChange(digitsOnly(e.target.value))}
          placeholder={placeholder}
          aria-invalid={!!q.error}
          className={cn(affixInput, "tabular-nums")}
        />
        <span className="shrink-0 text-base text-muted-foreground">/hari</span>
      </div>
    </Question>
  );
}

/* ---------------------------------------------------------------------- */
/* Single choice                                                          */
/* ---------------------------------------------------------------------- */

/* Selected = solid primary fill, readable at a glance in direct sun. */
function optionClass(checked: boolean, error?: string) {
  return cn(
    "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base transition-colors select-none",
    "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
    checked
      ? "border-primary bg-primary font-semibold text-primary-foreground"
      : error
        ? "border-destructive/60 active:bg-muted"
        : "border-input hover:bg-muted active:bg-muted dark:bg-input/30"
  );
}

export function ChoiceField({
  value,
  onChange,
  options,
  layout = "list",
  ...q
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  /** "row" for 2–3 short answers, "list" for everything else. */
  layout?: "row" | "list";
}) {
  return (
    <Question {...q} group>
      <div className={layout === "row" ? "grid auto-cols-fr grid-flow-col gap-2" : "grid gap-2"}>
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              className={cn(optionClass(checked, q.error), layout === "row" && "justify-center text-center")}
            >
              <input
                type="radio"
                name={q.name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {layout === "list" && (
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    checked ? "border-primary-foreground" : "border-input"
                  )}
                >
                  {checked && <span className="size-2.5 rounded-full bg-primary-foreground" />}
                </span>
              )}
              <span className="leading-snug">{opt}</span>
            </label>
          );
        })}
      </div>
    </Question>
  );
}

/* ---------------------------------------------------------------------- */
/* 1–5 Likert strip                                                       */
/* ---------------------------------------------------------------------- */

export function RatingField({
  value,
  onChange,
  lowLabel,
  highLabel,
  ...q
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <Question {...q} group>
      <div className="grid grid-cols-5 gap-2">
        {["1", "2", "3", "4", "5"].map((n) => {
          const checked = value === n;
          return (
            <label
              key={n}
              className={cn(optionClass(checked, q.error), "justify-center px-0 text-xl tabular-nums")}
            >
              <input
                type="radio"
                name={q.name}
                value={n}
                checked={checked}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              {n}
            </label>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-4 text-sm text-muted-foreground">
        <span>1 = {lowLabel}</span>
        <span className="text-right">5 = {highLabel}</span>
      </div>
    </Question>
  );
}

/* ---------------------------------------------------------------------- */
/* Free text                                                              */
/* ---------------------------------------------------------------------- */

export function TextAreaField({
  value,
  onChange,
  placeholder,
  ...q
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Question {...q}>
      <Textarea
        id={q.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!q.error}
        className="min-h-32 rounded-xl px-4 py-3 text-lg leading-relaxed md:text-lg"
      />
    </Question>
  );
}
