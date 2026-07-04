import {
  FieldValues,
  FieldErrors,
  RegisterOptions,
  Control,
  Path,
} from 'react-hook-form'
import { NumericFormatProps } from 'react-number-format'

export interface NumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  rules?: RegisterOptions<TFieldValues>
  control: Control<TFieldValues>
  errors?: FieldErrors<TFieldValues>
  name: Path<TFieldValues>
  isAllowed?: NumericFormatProps['isAllowed']
  label: string
  placeholder?: string
  prefix?: string
  suffix?: string
  thousandSeparator?: string
  decimalSeparator?: string
  decimalScale?: number
  type?: 'text' | 'tel' | 'password'
  disabled?: boolean
  className?: string
  allowNegative?: boolean
}