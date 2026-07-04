import React from 'react'
import {
  RegisterOptions,
  Control,
  FieldValues,
  FieldErrors,
} from 'react-hook-form'

export type OptionsProps = {
  value: string
  label: string
  disabled?: boolean
}

/**
 * TODO: Implement correct type for errors prop
 */
export type SelectProps = {
  isInput?: boolean
  rules?: RegisterOptions
  control: Control
  errors?: FieldErrors<FieldValues>
  name: string
  children?: string | React.ReactNode
  placeholder?: string
  options: OptionsProps[]
  isSearchable?: boolean
  isDisabled?: boolean
  handleChange?: any
  optionLabel?: string
  optionValue?: string
  defaultValue?: any
  inputHeight?: 'default' | 'lg'
}
