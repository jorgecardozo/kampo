import { UseFormRegister, FieldValues, RegisterOptions } from 'react-hook-form'

/**
 * TODO: Implement correct type for errors prop
 */
export type RadioButtonProps = {
  value: string | number | readonly string[]
  name: string
  children?: string
  register: UseFormRegister<FieldValues>
  rules?: RegisterOptions
  checked?: boolean
  handleClick?: (value) => void
}
