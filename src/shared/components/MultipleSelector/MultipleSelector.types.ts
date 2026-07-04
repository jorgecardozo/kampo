// Libraries
import {
  Control,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form'
import { MultiValue } from 'react-select'

export type MultipleSelectorProps = {
  name: string
  children: string | React.ReactNode
  placeholder?: string
  options?: Array<any>
  selectedOption?: MultiValue<any>
  isDisabled?: boolean
  isLoading?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  closeMenuOnSelect?: boolean
  hideSelectedOptions?: boolean
  rules?: RegisterOptions
  control: Control
  errors?: FieldErrors<FieldValues>
  onSelectOption?: (value: MultiValue<any>) => void
}
