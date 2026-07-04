import React from 'react'
import {
  UseFormRegister,
  FieldValues,
  RegisterOptions,
  FieldErrors,
} from 'react-hook-form'
import { HTMLMotionProps } from 'framer-motion'

export type TextInputProps = {
  register: UseFormRegister<FieldValues>
  name: string
  label?: string | React.ReactNode
  rules?: RegisterOptions
  errors?: FieldErrors<FieldValues>
  icon?: any
  type?: string
  placeholder?: string
  disabled?: boolean
  variant?: string
  className?: string
  labelClassName?: string
  description?: string
  focus?: boolean
  labelUp?: boolean
  inputHeight?: 'default' | 'lg'
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
} & HTMLMotionProps<'input'>
