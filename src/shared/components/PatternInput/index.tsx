import { PatternInputTemplate } from './PatternInput.template'
import { PatternInputProps } from './PatternInput.types'

export const PatternInput = ({ ...props }: PatternInputProps) => {
  return <PatternInputTemplate {...props} />
}
