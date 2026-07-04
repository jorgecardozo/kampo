import { NumberInputTemplate } from './NumberInput.template'
import { NumberInputProps } from './NumberInput.types'
import { FieldValues } from 'react-hook-form'

export const NumberInput = <TFieldValues extends FieldValues = FieldValues>(
  props: NumberInputProps<TFieldValues>
) => {
  return <NumberInputTemplate<TFieldValues> {...props} />
}