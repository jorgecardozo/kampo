import { ChevronIconTemplate } from './ChevronIcon.template'
import { ChevronIconProps } from './ChevronIcon.types'

export const ChevronIcon = ({ ...props }: ChevronIconProps) => {
  return <ChevronIconTemplate {...props} />
}
