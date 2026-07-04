import type { FieldValues, FieldErrors, RegisterOptions, Control, Path } from "react-hook-form"

export interface DateInputProps<TFieldValues extends FieldValues = FieldValues> {
  rules?: RegisterOptions<TFieldValues>
  control: Control<TFieldValues>
  errors?: FieldErrors<TFieldValues>
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  mode?: "single" | "range"
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  disablePastDates?: boolean
  disableFutureDates?: boolean
}
