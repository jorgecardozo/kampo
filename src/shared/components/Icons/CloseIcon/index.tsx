import { CloseIconTemplate } from './CloseIcon.template'
import { CloseIconProps } from './CloseIcon.types'

export const CloseIcon = ({ ...props }: CloseIconProps) => {
  return <CloseIconTemplate {...props} />
}
