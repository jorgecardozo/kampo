import { MultipleSelectorTemplate } from './MultipleSelector.template'
import { MultipleSelectorProps } from './MultipleSelector.types'

export const MultipleSelector = ({ ...props }: MultipleSelectorProps) => {
  return <MultipleSelectorTemplate {...props}></MultipleSelectorTemplate>
}
