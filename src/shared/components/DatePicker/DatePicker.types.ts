import React from 'react'
import { Control, FieldValues, RegisterOptions } from 'react-hook-form'

export type DatePickerProps = {
  children?: React.ReactNode
  placeholder: string
  wrapperClassName?: string
  handleChange: (value: string) => void
  selectedDate?: string
  className?: string
  selectedStartDate?: string
  selectedEndDate?: string
  parentId?: string
  selectsRange?: boolean
  isInput?: boolean
  control?: Control<FieldValues>
  name?: string
  label?: string
  rules?: RegisterOptions
  isDisabled?: boolean
  includeDateIntervals?: Array<any>
}
