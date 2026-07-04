import { PinIconTemplate } from './PinIcon.template'
import { PinIconProps } from './PinIcon.types'

export const PinIcon = ({ ...props }: PinIconProps) => {
  return <PinIconTemplate {...props} />
}
