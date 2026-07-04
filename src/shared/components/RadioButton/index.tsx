import { RadioButtonTemplate } from './RadioButton.template'
import { RadioButtonProps } from './RadioButton.types'

export const RadioButton = ({ ...props }: RadioButtonProps) => {
  return <RadioButtonTemplate {...props} />
}
