import {
  RegisterOptions,
  Control,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'

export type PatternInputProps = {
  rules?: RegisterOptions
  control: Control
  errors?: FieldErrors<FieldValues>
  name: string
  label: string
  placeholder?: string
  prefix?: string
  mask?: string
  format: string
  type?: 'text' | 'tel'
  disabled?: boolean
}
