import { RadioButtonGroupTemplate } from './RadioButtonGroup.template'
import { RadioButtonGroupProps } from './RadioButtonGroup.types'

export const RadioButtonGroup = ({ ...props }: RadioButtonGroupProps) => {
  return <RadioButtonGroupTemplate {...props} />
}
