import { DateInputTemplate } from "./DateInput.template"
import type { DateInputProps } from "./DateInput.types"
import type { FieldValues } from "react-hook-form"

export const DateInput = <TFieldValues extends FieldValues = FieldValues>(props: DateInputProps<TFieldValues>) => {
  return <DateInputTemplate<TFieldValues> {...props} />
}
